import Link from "next/link";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  name: string;
  href?: string;
}

export function Breadcrumbs({
  items,
  className,
}: {
  items: BreadcrumbItem[];
  className?: string;
}) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("mb-6 text-sm text-[var(--muted)]", className)}
    >
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.name}-${index}`} className="flex items-center gap-2">
              {index > 0 && <span aria-hidden="true">/</span>}
              {item.href && !isLast ? (
                <Link href={item.href} className="hover:text-[var(--pitch)]">
                  {item.name}
                </Link>
              ) : (
                <span className={isLast ? "text-[var(--ink)]" : undefined}>
                  {item.name}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
