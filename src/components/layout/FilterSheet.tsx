import { useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { FilterPanelContent } from '@/components/layout/FilterPanelContent'
import type { FilterState } from '@/lib/filterEngine/types'
import { isFilterActive } from '@/lib/filterEngine/types'
import { SlidersHorizontalIcon } from 'lucide-react'

interface FilterSheetProps {
  filters: FilterState
  onChange: (next: FilterState) => void
}

export function FilterSheet({ filters, onChange }: FilterSheetProps) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="outline" className="gap-2 lg:hidden">
            <SlidersHorizontalIcon className="size-4" />
            Filters
            {isFilterActive(filters) && (
              <span className="ml-1 size-1.5 rounded-full bg-primary" />
            )}
          </Button>
        }
      />
      <SheetContent side="left" className="w-80 overflow-y-auto p-4">
        <SheetHeader className="p-0">
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        <div className="mt-4">
          <FilterPanelContent filters={filters} onChange={onChange} />
        </div>
      </SheetContent>
    </Sheet>
  )
}
