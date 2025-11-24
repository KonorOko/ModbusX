import { cn } from "@/lib/utils";
import React from "react";

interface SettingSectionProps extends React.HTMLProps<HTMLDivElement> {
  children: React.ReactNode;
}

interface SettingsItemProps extends React.HTMLProps<HTMLDivElement> {
  children: React.ReactNode;
}

interface SettingsSectionTitleProps extends React.HTMLProps<HTMLDivElement> {
  children: React.ReactNode;
}

interface SettingsContentProps extends React.HTMLProps<HTMLDivElement> {
  children: React.ReactNode;
}

interface SettingsTitleProps extends React.HTMLProps<HTMLDivElement> {
  children: React.ReactNode;
}

interface SettingsDescriptionProps extends React.HTMLProps<HTMLDivElement> {
  children: React.ReactNode;
}

const SettingsSection = React.forwardRef<HTMLElement, SettingSectionProps>(
  ({ className, ...props }, ref) => (
    <section ref={ref} className={cn("space-y-0", className)} {...props} />
  ),
);
const SettingsItem = React.forwardRef<HTMLElement, SettingsItemProps>(
  ({ className, ...props }, ref) => (
    <article
      ref={ref}
      className={cn(
        "border-border grid grid-cols-3 items-center border-b px-3 py-4 last:border-b-0 [&>*:last-child]:justify-self-end",
        className,
      )}
      {...props}
    />
  ),
);

const SettingsSectionTitle = React.forwardRef<
  HTMLDivElement,
  SettingsSectionTitleProps
>(({ className, ...props }, ref) => {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2
        ref={ref}
        className={cn(
          "text-foreground font-mono text-xs tracking-wide",
          className,
        )}
        {...props}
      />
      <span className="bg-accent h-0.5 flex-1 rounded-full" />
    </div>
  );
});

const SettingsContent = React.forwardRef<HTMLDivElement, SettingsContentProps>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("col-span-2", className)} {...props} />;
  },
);

const SettingsTitle = React.forwardRef<HTMLDivElement, SettingsTitleProps>(
  ({ className, ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={cn("text-foreground text-sm font-semibold", className)}
        {...props}
      />
    );
  },
);

const SettingsDescription = React.forwardRef<
  HTMLDivElement,
  SettingsDescriptionProps
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn("text-muted-foreground text-xs", className)}
      {...props}
    />
  );
});

export {
  SettingsContent,
  SettingsDescription,
  SettingsItem,
  SettingsSection,
  SettingsSectionTitle,
  SettingsTitle,
};
