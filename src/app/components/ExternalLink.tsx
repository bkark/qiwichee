import type { ReactNode } from "react";

interface ExternalLinkProps {
  href: string;
  className?: string;
  "aria-label"?: string;
  showArrow?: boolean;
  children: ReactNode;
}

export default function ExternalLink({
  href,
  className,
  "aria-label": ariaLabel,
  showArrow = true,
  children,
}: ExternalLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className={className}
    >
      {children}
      {showArrow && <span aria-hidden="true"> ↗</span>}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
