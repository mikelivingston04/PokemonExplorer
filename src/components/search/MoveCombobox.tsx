import { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Button } from '@/components/ui/button'
import { useSearchIndex } from '@/lib/queries/useSearchIndex'
import { toDisplayName } from '@/lib/constants/nameOverrides'
import { XIcon, ChevronsUpDownIcon } from 'lucide-react'

interface MoveComboboxProps {
  value?: string
  onChange: (moveName: string | undefined) => void
}

export function MoveCombobox({ value, onChange }: MoveComboboxProps) {
  const [open, setOpen] = useState(false)
  const { entries } = useSearchIndex()
  const moves = entries.filter((e) => e.category === 'move')

  return (
    <div className="flex items-center gap-1">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <Button variant="outline" className="w-full justify-between font-normal">
              <span className="truncate">{value ? toDisplayName(value) : 'Any move...'}</span>
              <ChevronsUpDownIcon className="size-4 shrink-0 opacity-50" />
            </Button>
          }
        />
        <PopoverContent className="w-64 p-0" align="start">
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
          <XIcon className="size-4" />
        </Button>
      )}
    </div>
  )
}
