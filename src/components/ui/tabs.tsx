import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"

import { cn } from "@/lib/utils"
import styles from "./tabs.module.scss"

function Tabs({ className, ...props }: TabsPrimitive.Root.Props) {
  return <TabsPrimitive.Root data-slot="tabs" className={cn(styles.tabs, className)} {...props} />
}

function TabsList({ className, ...props }: TabsPrimitive.List.Props) {
  return <TabsPrimitive.List data-slot="tabs-list" className={cn(styles.list, className)} {...props} />
}

function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
  return <TabsPrimitive.Tab data-slot="tabs-trigger" className={cn(styles.trigger, className)} {...props} />
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return <TabsPrimitive.Panel data-slot="tabs-content" className={cn(styles.content, className)} {...props} />
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
