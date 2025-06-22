
import * as React from "react";
import { format, addDays, addWeeks, addMonths, addYears, startOfToday } from "date-fns";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  date?: Date;
  onSelect?: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const DatePicker = React.forwardRef<HTMLButtonElement, DatePickerProps>(
  ({ date, onSelect, placeholder = "Pick a date", className, disabled }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const today = startOfToday();

    const quickPresets = [
      { label: "Today", value: today },
      { label: "Tomorrow", value: addDays(today, 1) },
      { label: "Next Week", value: addWeeks(today, 1) },
      { label: "Next Month", value: addMonths(today, 1) },
      { label: "Next Year", value: addYears(today, 1) },
    ];

    const handlePresetSelect = (presetDate: Date) => {
      onSelect?.(presetDate);
      setIsOpen(false);
    };

    const handleCalendarSelect = (selectedDate: Date | undefined) => {
      onSelect?.(selectedDate);
      setIsOpen(false);
    };

    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal h-10",
              !date && "text-muted-foreground",
              className
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-auto p-0" 
          align="start"
          side="bottom"
          sideOffset={8}
          style={{ zIndex: 70 }}
        >
          <div className="p-3 space-y-3">
            {/* Quick Presets */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                <Clock className="h-3.5 w-3.5" />
                Quick Select
              </div>
              <div className="grid grid-cols-2 gap-1">
                {quickPresets.map((preset) => (
                  <Button
                    key={preset.label}
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs justify-start"
                    onClick={() => handlePresetSelect(preset.value)}
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Separator */}
            <div className="border-t border-border" />
            
            {/* Compact Calendar */}
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-2">
                Custom Date
              </div>
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleCalendarSelect}
                initialFocus
                captionLayout="dropdown-buttons"
                fromYear={2000}
                toYear={2100}
                className="p-0"
                classNames={{
                  months: "flex flex-col space-y-2",
                  month: "space-y-2",
                  caption: "flex justify-center pt-1 relative items-center",
                  caption_label: "text-sm font-medium",
                  nav: "space-x-1 flex items-center",
                  nav_button: cn(
                    "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
                  ),
                  nav_button_previous: "absolute left-1",
                  nav_button_next: "absolute right-1",
                  table: "w-full border-collapse space-y-1",
                  head_row: "flex",
                  head_cell: "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
                  row: "flex w-full mt-1",
                  cell: "h-8 w-8 text-center text-sm relative p-0 rounded-md focus-within:relative focus-within:z-20",
                  day: cn(
                    "h-8 w-8 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground rounded-md"
                  ),
                  day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                  day_today: "bg-accent text-accent-foreground",
                  day_outside: "text-muted-foreground opacity-50",
                  day_disabled: "text-muted-foreground opacity-50",
                  day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                  day_hidden: "invisible",
                }}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
  }
);

DatePicker.displayName = "DatePicker";

export { DatePicker };
