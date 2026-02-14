import Link from "next/link";

interface DemoLinksProps {
  regularHref?: string;
  primaryHref?: string;
}

export function BlogDemoLinks({ 
  regularHref = "#", 
  primaryHref = "#" 
}: DemoLinksProps) {
  return (
    <div className="flex gap-4 text-sm">
      <Link href={regularHref} className="hover:text-primary">regular link</Link>
      <Link href={primaryHref} className="text-primary underline">primary link</Link>
    </div>
  );
}
