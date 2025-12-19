import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary-orange' | 'primary-blue' | 'outline';
  children: React.ReactNode;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary-blue',
  children,
  fullWidth = false,
  icon,
  className = '',
  ...props
}) => {
  const baseStyles = 'px-6 py-3 rounded-full font-medium transition-all duration-200 flex items-center justify-center gap-2';
  
  const variantStyles = {
    'primary-orange': 'bg-[#E86C00] text-white hover:bg-[#d66100] active:scale-95',
    'primary-blue': 'bg-[#00569E] text-white hover:bg-[#004580] active:scale-95',
    'outline': 'border-2 border-[#00569E] text-[#00569E] hover:bg-[#00569E] hover:text-white'
  };

  const widthStyles = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${widthStyles} ${className}`}
      {...props}
    >
      {children}
      {icon && icon}
    </button>
  );
};
