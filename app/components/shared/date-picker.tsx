import { useRef, useState } from "react"
import type { FieldConfig } from "@conform-to/react"
import { useInputEvent } from "@conform-to/react"
import { CalendarIcon } from "@radix-ui/react-icons"

import { cn } from "~/libs"
import { formatDateOnly } from "~/utils"
import { Button, Calendar, Popover, PopoverContent, PopoverTrigger } from "~/components"

export function DatePicker(config: FieldConfig<string>) {
  const defaultDate = new Date(config.defaultValue || "")

  const [date, setDate] = useState<Date>(defaultDate)

  const shadowInputRef = useRef<HTMLInputElement>(null)

  const control = useInputEvent({
    ref: shadowInputRef,
    onFocus: () => shadowInputRef.current?.focus(),
    onReset: () => setDate(defaultDate),
  })

  return (
    <div>
      <Popover>
        <input
          type="hidden"
          required={config.required}
          name={config.name}
          value={String(date)}
          onChange={event => {
            control.change(event.target.value)
            setDate(new Date(event.target.value))
          }}
        />

        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[280px] justify-start text-left font-normal",
              !date && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? formatDateOnly(date) : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate as any}
            initialFocus
            defaultMonth={date}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
