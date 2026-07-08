"use client"

import { Switch as SwitchPrimitive } from "@base-ui/react/switch"

import { cn } from "@/lib/utils"
import styles from "./switch.module.scss"

function Switch({ className, ...props }: SwitchPrimitive.Root.Props) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(styles.switch, className)}
      {...props}
    >
      <SwitchPrimitive.Thumb data-slot="switch-thumb" className={styles.thumb} />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
