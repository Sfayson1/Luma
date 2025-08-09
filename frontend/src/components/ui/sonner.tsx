import { useTheme } from "next-themes"
import { Toaster as Sonner, toast } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-[hsl(var(--color-background))] group-[.toaster]:text-[hsl(var(--color-foreground))] group-[.toaster]:border-[hsl(var(--color-border))] group-[.toaster]:shadow-[var(--shadow-warm)]",
          description: "group-[.toast]:text-[hsl(var(--color-muted-foreground))]",
          actionButton:
            "group-[.toast]:bg-[hsl(var(--color-primary))] group-[.toast]:text-[hsl(var(--color-primary-foreground))]",
          cancelButton:
            "group-[.toast]:bg-[hsl(var(--color-muted))] group-[.toast]:text-[hsl(var(--color-muted-foreground))]",
        },
      }}
      {...props}
    />
  )
}

export { Toaster, toast }
