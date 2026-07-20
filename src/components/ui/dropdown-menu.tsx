"use client"

import { Menu as MenuPrimitive } from "@base-ui/react/menu"

import { cn } from "@/lib/utils"
import styles from "./dropdown-menu.module.scss"

function DropdownMenu({ ...props }: MenuPrimitive.Root.Props) {
  return <MenuPrimitive.Root data-slot="dropdown-menu" {...props} />
}

function DropdownMenuTrigger({ ...props }: MenuPrimitive.Trigger.Props) {
  return <MenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />
}

function DropdownMenuContent({
  className,
  align = "start",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 4,
  ...props
}: MenuPrimitive.Popup.Props &
  Pick<MenuPrimitive.Positioner.Props, "align" | "alignOffset" | "side" | "sideOffset">) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className={styles.positioner}
      >
        <MenuPrimitive.Popup data-slot="dropdown-menu-content" className={cn(styles.content, className)} {...props} />
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  )
}

function DropdownMenuItem({ className, ...props }: MenuPrimitive.Item.Props) {
  return <MenuPrimitive.Item data-slot="dropdown-menu-item" className={cn(styles.item, className)} {...props} />
}

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem }
