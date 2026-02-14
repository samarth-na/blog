import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <h1 className="text-4xl font-medium" style={{ fontFamily: "'IBM Plex Serif', serif" }}>404</h1>
      <p className="text-muted-foreground">Page not found</p>
      <Link 
        href="/" 
        className="text-primary underline hover:text-primary/80 transition-colors"
      >
        Go back home
      </Link>
    </div>
  );
}
