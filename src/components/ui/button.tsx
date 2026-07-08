import { Button as ButtonPrimitive } from "@base-ui/react/button"

import { cn } from "@/lib/utils"
import styles from "./button.module.scss"

export type ButtonVariant = "default" | "outline" | "secondary" | "ghost" | "destructive" | "link"
export type ButtonSize = "default" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg"

const SIZE_CLASS: Record<ButtonSize, string | undefined> = {
  default: undefined,
  xs: styles.sizeXs,
  sm: styles.sizeSm,
  lg: styles.sizeLg,
  icon: styles.sizeIcon,
  "icon-xs": styles.sizeIconXs,
  "icon-sm": styles.sizeIconSm,
  "icon-lg": styles.sizeIconLg,
}

interface ButtonProps extends ButtonPrimitive.Props {
  variant?: ButtonVariant
  size?: ButtonSize
}

function Button({ className, variant = "default", size = "default", ...props }: ButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(styles.button, styles[variant], SIZE_CLASS[size], className)}
      {...props}
    />
  )
}

export { Button }
