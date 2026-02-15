interface ContainerProps {
  children: React.ReactNode;
}

export function Container({ children }: ContainerProps) {
  return (
    <div /* className={`${MAX_WIDTH_CLASSES[maxWidth]} mx-auto px-6 py-12`} */>
      {children}
    </div>
  );
}
