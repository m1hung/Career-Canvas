import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative w-8 h-8 flex items-center justify-center">
        {/* Abstract Canvas/Paper Shape */}
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <path 
            d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" 
            className="fill-zinc-900 dark:fill-zinc-100"
          />
          <path 
            d="M7 7H17M7 12H17M7 17H13" 
            stroke="white" 
            strokeWidth="2" 
            strokeLinecap="round"
            className="dark:stroke-zinc-900"
          />
          {/* Accent Dot */}
          <circle cx="18" cy="18" r="3" className="fill-blue-500" />
        </svg>
      </div>
      <span className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white tracking-tight">
        Career <span className="text-blue-500">Canvas</span>
      </span>
    </div>
  );
};
