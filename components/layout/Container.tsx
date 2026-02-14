interface ContainerProps {
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
}

const MAX_WIDTH_CLASSES = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-xl",
  xl: "max-w-2xl",
  "2xl": "max-w-2xl",
};

export function BlogContainer({ children, maxWidth = "2xl" }: ContainerProps) {
  return (
    <div /* className={`${MAX_WIDTH_CLASSES[maxWidth]} mx-auto px-6 py-12`} */>
      {children}
    </div>
  );
}
