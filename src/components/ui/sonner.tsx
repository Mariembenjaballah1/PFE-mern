
import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      expand={true}
      position="bottom-right"
      closeButton={true}
      richColors={true}
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-green-100 dark:group-[.toaster]:border-green-800/40 group-[.toaster]:shadow-lg group-[.toaster]:shadow-green-500/10 dark:group-[.toaster]:shadow-green-900/10 group-[.toaster]:backdrop-blur-sm",
          title: "text-sm font-semibold",
          description: "group-[.toast]:text-muted-foreground text-sm",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          success: "group-[.toaster]:border-green-200 dark:group-[.toaster]:border-green-800/40 group-[.toaster]:bg-green-50 dark:group-[.toaster]:bg-green-900/50 group-[.toaster]:text-green-700 dark:group-[.toaster]:text-green-300",
          error: "group-[.toaster]:border-red-200 dark:group-[.toaster]:border-red-800/40 group-[.toaster]:bg-red-50 dark:group-[.toaster]:bg-red-900/50 group-[.toaster]:text-red-700 dark:group-[.toaster]:text-red-300",
          warning: "group-[.toaster]:border-yellow-200 dark:group-[.toaster]:border-yellow-800/40 group-[.toaster]:bg-yellow-50 dark:group-[.toaster]:bg-yellow-900/50 group-[.toaster]:text-yellow-700 dark:group-[.toaster]:text-yellow-300",
          info: "group-[.toaster]:border-blue-200 dark:group-[.toaster]:border-blue-800/40 group-[.toaster]:bg-blue-50 dark:group-[.toaster]:bg-blue-900/50 group-[.toaster]:text-blue-700 dark:group-[.toaster]:text-blue-300",
        },
      }}
      {...props}
    />
  )
}

// Export the Toaster component and the toast function with all its variants
export { Toaster }
export { toast } from "@/hooks/use-toast"
