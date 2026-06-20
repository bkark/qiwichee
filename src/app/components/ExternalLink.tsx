import type { ReactNode } from "react";

interface ExternalLinkProps {
  href: string;
  className?: string;
  children: ReactNode;
}

export default function ExternalLink({
  href,
  className,
  children,
}: ExternalLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
      <span aria-hidden="true"> ↗</span>
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
