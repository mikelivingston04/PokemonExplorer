import { clsx, type ClassValue } from "clsx"

// Joins CSS module classes (and the occasional plain utility like "sr-only")
// conditionally — e.g. cn(styles.badge, active && styles.active, className).
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}
