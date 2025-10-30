'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { AccountFilter } from './AccountFilter'
import { SlidersHorizontal } from 'lucide-react'

export function MobileFilter() {
  const [open, setOpen] = useState(false)

  return (
    <div className="lg:hidden mb-4">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className="w-full">
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            フィルター
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>フィルター</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <AccountFilter onFilterApplied={() => setOpen(false)} isMobile={true} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
