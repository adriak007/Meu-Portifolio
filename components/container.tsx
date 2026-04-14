import { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  className?: string;
};

export function Container({ children, className = "" }: ContainerProps) {
  return (
    <div className={`mx-auto w-[min(100%-1.5rem,1180px)] ${className}`}>
      {children}
    </div>
  );
}
