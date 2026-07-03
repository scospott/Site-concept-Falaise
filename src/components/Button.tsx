import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { Link } from "@/i18n/navigation";

type Variant = "primary" | "ghost";

const base =
  "inline-flex items-center justify-center rounded-full px-7 py-3 text-sm " +
  "font-medium tracking-wide transition-all duration-[350ms] ease-luxe " +
  "cursor-pointer select-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-ecume text-nuit hover:bg-[#c2e4d5] hover:-translate-y-px " +
    "active:translate-y-0",
  ghost:
    "border border-ecru/30 text-ecru hover:border-ecume hover:text-ecume",
};

type CommonProps = {
  variant?: Variant;
  className?: string;
  children: ReactNode;
};

type ButtonAsLink = CommonProps & {
  href: string;
} & Omit<ComponentPropsWithoutRef<"a">, "href" | "className" | "children">;

type ButtonAsButton = CommonProps & {
  href?: undefined;
} & Omit<ComponentPropsWithoutRef<"button">, "className" | "children">;

export default function Button(props: ButtonAsLink | ButtonAsButton) {
  const { variant = "primary", className, children } = props;
  const classes = `${base} ${variants[variant]}${className ? ` ${className}` : ""}`;

  if (props.href !== undefined) {
    const { href, variant: _v, className: _c, children: _ch, ...rest } = props;
    // Ancres locales : simple <a>, routes internes : Link i18n
    if (href.startsWith("#")) {
      return (
        <a href={href} className={classes} {...rest}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  const { variant: _v, className: _c, children: _ch, ...rest } = props;
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
