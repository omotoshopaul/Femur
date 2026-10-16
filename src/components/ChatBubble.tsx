import React from 'react';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'navigator';
  text: string;
  timestamp: string;
  isDisclaimer?: boolean;
}

export interface ChatBubbleProps {
  message: ChatMessage;
  className?: string;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message, className = '' }) => {
  const isUser = message.sender === 'user';

  return (
    <div
      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[85%] ${
        isUser ? 'ml-auto' : 'mr-auto'
      } ${className}`}
    >
      <div className="flex items-center gap-2 mb-1 px-1">
        <span className="text-[13px] font-interface-sans font-medium text-[#4F6B58]">
          {isUser ? 'You' : 'AI Emergency Navigator'}
        </span>
        <span className="text-[12px] font-interface-sans text-[#4F6B58]/70">
          {message.timestamp}
        </span>
      </div>

      <div
        className={`rounded-[12px] p-4 text-[15px] font-interface-sans leading-relaxed border ${
          isUser
            ? 'bg-[#0F3F24] text-[#FFFFFF] border-[#0F3F24]'
            : 'bg-[#FFFFFF] text-[#0F3F24] border-[#CFDACF]'
        }`}
      >
        <p>{message.text}</p>
        {!isUser && message.isDisclaimer && (
          <div className="mt-3 pt-2.5 border-t border-[#CFDACF] text-[13px] text-[#4F6B58] flex items-start gap-1.5">
            <span className="font-semibold text-[#0F3F24]">Clinical Note:</span>
            <span>Does not provide medical diagnosis or invent live availability.</span>
          </div>
        )}
      </div>
    </div>
  );
};
