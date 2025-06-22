
import * as React from "react";
import { format, addDays, addWeeks, addMonths, addYears, startOfToday, startOfWeek, startOfMonth, startOfYear, subWeeks, subMonths, subYears } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
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

    const quickOptions = [
      { label: "Today", getValue: () => today },
      { label: "Yesterday", getValue: () => addDays(today, -1) },
      { label: "This week", getValue: () => startOfWeek(today, { weekStartsOn: 1 }) },
      { label: "Last week", getValue: () => startOfWeek(addWeeks(today, -1), { weekStartsOn: 1 }) },
      { label: "This month", getValue: () => startOfMonth(today) },
      { label: "Last month", getValue: () => startOfMonth(subMonths(today, 1)) },
      { label: "This year", getValue: () => startOfYear(today) },
      { label: "Last year", getValue: () => startOfYear(subYears(today, 1)) },
    ];

    const handleQuickSelect = (getValue: () => Date) => {
      const selectedDate = getValue();
      onSelect?.(selectedDate);
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
            {date ? format(date, "MMM d, yyyy") : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-auto p-0" 
          align="start"
          side="bottom"
          sideOffset={8}
          style={{ zIndex: 70 }}
        >
          <div className="flex">
            {/* Sidebar with quick options */}
            <div className="w-32 border-r bg-gray-50/50 p-2">
              <div className="space-y-1">
                {quickOptions.map((option) => (
                  <Button
                    key={option.label}
                    variant="ghost"
                    size="sm"
                    className="w-full h-8 text-xs justify-start font-normal text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    onClick={() => handleQuickSelect(option.getValue)}
                  >
                    {option.label}
                  </Button>
                ))}
                <div className="border-t border-gray-200 my-1"></div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full h-8 text-xs justify-start font-normal text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  onClick={() => {
                    setIsOpen(false);
                  }}
                >
                  All time
                </Button>
              </div>
            </div>
            
            {/* Calendar section - simplified without dropdown controls */}
            <div className="p-3">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleCalendarSelect}
                initialFocus
                fromYear={2000}
                toYear={2100}
                className="p-0"
                classNames={{
                  months: "flex flex-col space-y-2",
                  month: "space-y-2",
                  caption: "flex justify-center pt-1 relative items-center mb-2",
                  caption_label: "text-sm font-medium",
                  nav: "space-x-1 flex items-center",
                  nav_button: cn(
                    "h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100 hover:bg-gray-100 rounded-md"
                  ),
                  nav_button_previous: "absolute left-1",
                  nav_button_next: "absolute right-1",
                  table: "w-full border-collapse space-y-1",
                  head_row: "flex mb-1",
                  head_cell: "text-gray-500 rounded-md w-8 font-normal text-xs text-center",
                  row: "flex w-full mt-1",
                  cell: "h-8 w-8 text-center text-sm relative p-0 rounded-md focus-within:relative focus-within:z-20",
                  day: cn(
                    "h-8 w-8 p-0 font-normal text-sm hover:bg-gray-100 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  ),
                  day_selected: "bg-blue-600 text-white hover:bg-blue-700 focus:bg-blue-700",
                  day_today: "bg-gray-100 text-gray-900 font-medium",
                  day_outside: "text-gray-400 opacity-50",
                  day_disabled: "text-gray-300 opacity-50",
                  day_range_middle: "aria-selected:bg-blue-100 aria-selected:text-blue-900",
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
