import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { Link } from "@/i18n/navigation";

type Variant = "primary" | "ghost";

const base =
  "inline-flex items-center justify-center rounded-full px-7 py-3 text-sm " +
  "font-medium tracking-wide transition-all duration-[350ms] ease-luxe " +
  "cursor-pointer select-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-pin text-creme hover:bg-[#2f4833] hover:-translate-y-px " +
    "active:translate-y-0",
  ghost:
    "border border-encre/35 text-encre hover:border-pin hover:text-pin",
};

// Sur le hero (vidéo dorée) : boutons inversés
const inverseVariants: Record<Variant, string> = {
  primary:
    "bg-creme text-encre hover:bg-blanc hover:-translate-y-px " +
    "active:translate-y-0",
  ghost:
    "border border-creme/60 text-creme hover:border-creme hover:bg-creme/10",
};

type CommonProps = {
  variant?: Variant;
  /** Variante hero : crème sur vidéo dorée */
  inverse?: boolean;
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
  const { variant = "primary", inverse = false, className, children } = props;
  const styles = inverse ? inverseVariants[variant] : variants[variant];
  const classes = `${base} ${styles}${className ? ` ${className}` : ""}`;

  if (props.href !== undefined) {
    const {
      href,
      variant: _v,
      inverse: _i,
      className: _c,
      children: _ch,
      ...rest
    } = props;
    // Ancres locales : simple <a>, routes internes : Link i18n
    if (href.startsWith("#")) {
      return (
        <a href={href} className={classes} data-cursor="link" {...rest}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} data-cursor="link" {...rest}>
        {children}
      </Link>
    );
  }

  const {
    variant: _v,
    inverse: _i,
    className: _c,
    children: _ch,
    ...rest
  } = props;
  return (
    <button className={classes} data-cursor="link" {...rest}>
      {children}
    </button>
  );
}
