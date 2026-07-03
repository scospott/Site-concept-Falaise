import type { ReactNode } from "react";

export default function SectionTitle({
  children,
  className,
  as: Tag = "h2",
}: {
  children: ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <Tag className={`display-l text-ecru${className ? ` ${className}` : ""}`}>
      {children}
    </Tag>
  );
}
