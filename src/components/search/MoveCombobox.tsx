import { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Button } from '@/components/ui/button'
import { useSearchIndex } from '@/lib/queries/useSearchIndex'
import { toDisplayName } from '@/lib/constants/nameOverrides'
import { XIcon, ChevronsUpDownIcon } from 'lucide-react'
import styles from './MoveCombobox.module.scss'

interface MoveComboboxProps {
  value?: string
  onChange: (moveName: string | undefined) => void
}

export function MoveCombobox({ value, onChange }: MoveComboboxProps) {
  const [open, setOpen] = useState(false)
  const { entries } = useSearchIndex()
  const moves = entries.filter((e) => e.category === 'move')

  return (
    <div className={styles.wrapper}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <Button variant="outline" className={styles.trigger}>
              <span className={styles.triggerLabel}>{value ? toDisplayName(value) : 'Any move...'}</span>
              <ChevronsUpDownIcon className={styles.chevron} />
            </Button>
          }
        />
        <PopoverContent className={styles.content} align="start">
          <Command>
            <CommandInput placeholder="Search moves..." />
            <CommandList>
              <CommandEmpty>No moves found.</CommandEmpty>
              <CommandGroup>
                {moves.map((move) => (
                  <CommandItem
                    key={move.name}
                    value={move.displayName}
                    onSelect={() => {
                      onChange(move.name)
                      setOpen(false)
                    }}
                  >
                    {move.displayName}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {value && (
        <Button variant="ghost" size="icon" onClick={() => onChange(undefined)} aria-label="Clear move filter">
          <XIcon className={styles.clearIcon} />
        </Button>
      )}
    </div>
  )
}
