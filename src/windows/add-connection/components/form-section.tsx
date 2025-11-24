import { cn } from "@/lib/utils";

export function FormSection({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <section className={cn("", className)}>{children}</section>;
}

export function FormSectionHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2 className={cn("text-muted-foreground text-sm", className)}>
      {children}
    </h2>
  );
}
