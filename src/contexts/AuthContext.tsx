import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  deleteUser,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  serverTimestamp,
  collection,
  getDocs,
} from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { UserDoc, UserRole, OrganizationDoc } from '../types/auth';

const ADMIN_EMAIL_ALLOWLIST = ['omotoshopaul688@gmail.com'];

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userDoc: UserDoc | null;
  orgDoc: OrganizationDoc | null;
  loading: boolean;
  isAdmin: boolean;
  needsRoleSelection: boolean;
  demoRole: UserRole | null;
  activeRole: UserRole;
  setDemoRole: (role: UserRole | null) => void;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (
    email: string,
    pass: string,
    name: string,
    role: UserRole,
    consent: boolean,
    orgData?: { name: string; state: string; lga: string }
  ) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  completeGoogleRoleSetup: (
    role: UserRole,
    orgData?: { name: string; state: string; lga: string }
  ) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUserData: () => Promise<void>;
  deleteAccountAndData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userDoc, setUserDoc] = useState<UserDoc | null>(null);
  const [orgDoc, setOrgDoc] = useState<OrganizationDoc | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [needsRoleSelection, setNeedsRoleSelection] = useState<boolean>(false);
  const [demoRole, setDemoRoleState] = useState<UserRole | null>(() => {
    try {
      return (sessionStorage.getItem('femur_demo_role') as UserRole) || null;
    } catch {
      return null;
    }
  });

  const setDemoRole = (role: UserRole | null) => {
    setDemoRoleState(role);
    try {
      if (role) {
        sessionStorage.setItem('femur_demo_role', role);
      } else {
        sessionStorage.removeItem('femur_demo_role');
      }
    } catch {
      // ignore storage errors
    }
  };

  const activeRole: UserRole = demoRole || userDoc?.role || 'patient';

  const isAdmin = Boolean(
    currentUser?.email && ADMIN_EMAIL_ALLOWLIST.includes(currentUser.email.toLowerCase())
  ) || activeRole === 'admin';

  const fetchUserData = async (uid: string, userEmail?: string | null) => {
    try {
      const userDocRef = doc(db, 'users', uid);
      const snap = await getDoc(userDocRef);

      if (snap.exists()) {
        const data = snap.data() as UserDoc;
        setUserDoc(data);
        setNeedsRoleSelection(false);

        if (data.organizationId) {
          const orgSnap = await getDoc(doc(db, 'organizations', data.organizationId));
          if (orgSnap.exists()) {
            setOrgDoc({ id: orgSnap.id, ...(orgSnap.data() as OrganizationDoc) });
          }
        }
      } else {
        // If user is in admin allowlist, initialize as admin automatically
        if (userEmail && ADMIN_EMAIL_ALLOWLIST.includes(userEmail.toLowerCase())) {
          const adminDoc: UserDoc = {
            displayName: currentUser?.displayName || 'FEMUR Administrator',
            email: userEmail,
            role: 'admin',
            verificationStatus: 'approved',
            createdAt: serverTimestamp(),
          };
          await setDoc(userDocRef, adminDoc);
          setUserDoc(adminDoc);
          setNeedsRoleSelection(false);
        } else {
          // New user needs role selection (e.g. from Google sign in)
          setUserDoc(null);
          setNeedsRoleSelection(true);
        }
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, `users/${uid}`);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await fetchUserData(user.uid, user.email);
      } else {
        setUserDoc(null);
        setOrgDoc(null);
        setNeedsRoleSelection(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const refreshUserData = async () => {
    if (currentUser) {
      await fetchUserData(currentUser.uid, currentUser.email);
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const signUpWithEmail = async (
    email: string,
    pass: string,
    name: string,
    role: UserRole,
    consent: boolean,
    orgData?: { name: string; state: string; lga: string }
  ) => {
    if (!consent) {
      throw new Error('You must accept the Terms and Privacy Policy to continue.');
    }

    const res = await createUserWithEmailAndPassword(auth, email, pass);
    const uid = res.user.uid;

    const isUserAdmin = ADMIN_EMAIL_ALLOWLIST.includes(email.toLowerCase());
    const finalRole: UserRole = isUserAdmin ? 'admin' : role;
    const verificationStatus =
      finalRole === 'patient' || finalRole === 'admin' ? 'approved' : 'pending';

    let orgId: string | null = null;

    if (orgData && finalRole !== 'patient' && finalRole !== 'admin') {
      orgId = `org_${uid}`;
      const orgRecord: OrganizationDoc = {
        name: orgData.name,
        type: finalRole as 'hospital' | 'ambulance_provider' | 'sponsor',
        state: orgData.state,
        lga: orgData.lga,
        ownerUid: uid,
        verificationStatus: 'pending',
        createdAt: serverTimestamp(),
      };
      await setDoc(doc(db, 'organizations', orgId), orgRecord);
    }

    const userRecord: UserDoc = {
      displayName: name,
      email,
      role: finalRole,
      verificationStatus,
      organizationId: orgId,
      createdAt: serverTimestamp(),
    };

    await setDoc(doc(db, 'users', uid), userRecord);

    // Initialize patient profile
    if (finalRole === 'patient') {
      await setDoc(doc(db, 'patientProfiles', uid), {
        consentGivenAt: serverTimestamp(),
      });
    }

    await fetchUserData(uid, email);
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const res = await signInWithPopup(auth, provider);
    await fetchUserData(res.user.uid, res.user.email);
  };

  const completeGoogleRoleSetup = async (
    role: UserRole,
    orgData?: { name: string; state: string; lga: string }
  ) => {
    if (!currentUser) throw new Error('Not signed in.');

    const uid = currentUser.uid;
    const email = currentUser.email || '';
    const isUserAdmin = ADMIN_EMAIL_ALLOWLIST.includes(email.toLowerCase());
    const finalRole: UserRole = isUserAdmin ? 'admin' : role;
    const verificationStatus =
      finalRole === 'patient' || finalRole === 'admin' ? 'approved' : 'pending';

    let orgId: string | null = null;
    if (orgData && finalRole !== 'patient' && finalRole !== 'admin') {
      orgId = `org_${uid}`;
      const orgRecord: OrganizationDoc = {
        name: orgData.name,
        type: finalRole as 'hospital' | 'ambulance_provider' | 'sponsor',
        state: orgData.state,
        lga: orgData.lga,
        ownerUid: uid,
        verificationStatus: 'pending',
        createdAt: serverTimestamp(),
      };
      await setDoc(doc(db, 'organizations', orgId), orgRecord);
    }

    const userRecord: UserDoc = {
      displayName: currentUser.displayName || 'Member',
      email,
      role: finalRole,
      verificationStatus,
      organizationId: orgId,
      createdAt: serverTimestamp(),
    };

    await setDoc(doc(db, 'users', uid), userRecord);

    if (finalRole === 'patient') {
      await setDoc(doc(db, 'patientProfiles', uid), {
        consentGivenAt: serverTimestamp(),
      });
    }

    await fetchUserData(uid, email);
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    setUserDoc(null);
    setOrgDoc(null);
    setNeedsRoleSelection(false);
  };

  const deleteAccountAndData = async () => {
    if (!currentUser) return;
    const uid = currentUser.uid;

    try {
      // 1. Delete people subcollection
      const peopleSnap = await getDocs(collection(db, 'patientProfiles', uid, 'people'));
      for (const pDoc of peopleSnap.docs) {
        await deleteDoc(pDoc.ref);
      }

      // 2. Delete patient profile
      await deleteDoc(doc(db, 'patientProfiles', uid));

      // 3. Delete organization if owned
      if (userDoc?.organizationId) {
        await deleteDoc(doc(db, 'organizations', userDoc.organizationId));
      }

      // 4. Delete user doc
      await deleteDoc(doc(db, 'users', uid));

      // 5. Delete Firebase Auth user
      await deleteUser(currentUser);

      setUserDoc(null);
      setOrgDoc(null);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `users/${uid}`);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userDoc,
        orgDoc,
        loading,
        isAdmin,
        needsRoleSelection,
        demoRole,
        activeRole,
        setDemoRole,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        completeGoogleRoleSetup,
        signOut,
        refreshUserData,
        deleteAccountAndData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
