import clsx from 'clsx';
import React from 'react';

import styles from './button.styles';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>{
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  ...rest
}) => {
  return (
    <button
      className={clsx(styles.variant[variant])}
      {...rest}
    >
      {children}
    </button>
  );
}

export default Button;
