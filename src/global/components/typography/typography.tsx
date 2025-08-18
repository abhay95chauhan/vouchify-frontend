// Typography.tsx
import React from 'react';

type TypographyProps = {
  children: React.ReactNode;
  className?: string;
};

// Define the different heading levels and text components
const H1: React.FC<TypographyProps> = ({ children, className }) => {
  return (
    <h1
      className={`scroll-m-20 text-4xl font-extrabold tracking-tight text-balance ${className}`} // 36px
    >
      {children}
    </h1>
  );
};

const H2: React.FC<TypographyProps> = ({ children, className }) => {
  return (
    <h2
      className={`scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 ${className}`} // 30px
    >
      {children}
    </h2>
  );
};

const H3: React.FC<TypographyProps> = ({ children, className }) => {
  return (
    <h3
      className={`scroll-m-20 text-2xl font-semibold tracking-tight ${className}`} // 24px
    >
      {children}
    </h3>
  );
};
const H4: React.FC<TypographyProps> = ({ children, className }) => {
  return (
    <h3
      className={`scroll-m-20 text-xl font-semibold tracking-tight ${className}`} // 20px
    >
      {children}
    </h3>
  );
};
const H5: React.FC<TypographyProps> = ({ children, className }) => {
  return (
    <h5
      className={`scroll-m-20 text-base font-semibold tracking-tight roboto-bold ${className}`} // 18px
    >
      {children}
    </h5>
  );
};

const H6: React.FC<TypographyProps> = ({ children, className }) => {
  return (
    <h6
      className={`${className} scroll-m-20 text-sm font-semibold tracking-tight`} // 14px
    >
      {children}
    </h6>
  );
};

const P: React.FC<TypographyProps> = ({ children, className }) => {
  return <p className={`leading-7 ${className}`}>{children}</p>;
};

const Muted: React.FC<TypographyProps> = ({ children, className }) => {
  return (
    <p className={`text-sm text-muted-foreground ${className}`}>{children}</p> // 14px
  );
};

// Export the components as properties of Typography
export const Typography = {
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  P,
  Muted,
};
