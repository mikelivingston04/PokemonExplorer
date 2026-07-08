import { cn } from "@/lib/utils"
import styles from "./badge.module.scss"

export type BadgeVariant = "default" | "secondary" | "destructive" | "outline"

interface BadgeProps extends React.ComponentProps<"span"> {
  variant?: BadgeVariant
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      data-slot="badge"
      className={cn(styles.badge, styles[variant], className)}
      {...props}
    />
  )
}

export { Badge }
