import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "gold";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  href?: string;
  className?: string;
  children: React.ReactNode;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--pitch)] text-white hover:bg-[var(--pitch-light)] border border-transparent",
  secondary:
    "bg-transparent text-[var(--pitch)] border border-[var(--pitch)] hover:bg-[var(--pitch)] hover:text-white",
  ghost:
    "bg-transparent text-[var(--ink)] border border-transparent hover:bg-[var(--mist)]",
  gold: "bg-[var(--gold)] text-[var(--pitch-deep)] hover:bg-[var(--gold-soft)] border border-transparent font-semibold",
};

export function Button({
  variant = "primary",
  href,
  className,
  children,
  target,
  rel,
  ...props
}: ButtonProps & { target?: string; rel?: string }) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold)] disabled:opacity-60",
    variants[variant],
    className,
  );

  if (href) {
    const external = href.startsWith("http");
    if (external) {
      return (
        <a
          href={href}
          className={classes}
          target={target || "_blank"}
          rel={rel || "noopener noreferrer"}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
