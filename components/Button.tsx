import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "py-4 px-8 rounded-xl text-xl font-bold transition-transform active:scale-95 focus:outline-none focus:ring-4 focus:ring-offset-2";
  
  const variants = {
    // Updated hover to a manually darkened version of #5e6d5a and focus ring to match
    primary: "bg-lanzarote-ocean text-white hover:bg-[#4a5647] focus:ring-[#5e6d5a] shadow-lg",
    secondary: "bg-lanzarote-volcano text-white hover:bg-red-800 focus:ring-red-500 shadow-md",
    outline: "border-4 border-lanzarote-ocean text-lanzarote-ocean hover:bg-lanzarote-sky"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className} disabled:opacity-50 disabled:cursor-not-allowed`}
      {...props}
    >
      {children}
    </button>
  );
};