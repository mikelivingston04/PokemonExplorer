import { cn } from "@/lib/utils"
import styles from "./input-group.module.scss"

function InputGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-group"
      role="group"
      className={cn(styles.inputGroup, className)}
      {...props}
    />
  )
}

function InputGroupAddon({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      role="group"
      data-slot="input-group-addon"
      className={cn(styles.addon, className)}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("button")) {
          return
        }
        e.currentTarget.parentElement?.querySelector("input")?.focus()
      }}
      {...props}
    />
  )
}

export { InputGroup, InputGroupAddon }
