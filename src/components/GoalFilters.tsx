
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Filter } from 'lucide-react';

export type FilterPeriod = 'all' | 'next30days' | 'nextQuarter' | 'nextHalf' | 'nextYear';

interface GoalFiltersProps {
  selectedPeriod: FilterPeriod;
  onPeriodChange: (period: FilterPeriod) => void;
  goalCount: number;
}

const GoalFilters: React.FC<GoalFiltersProps> = ({
  selectedPeriod,
  onPeriodChange,
  goalCount
}) => {
  const filterOptions = [
    { 
      value: 'all', 
      label: 'All Goals', 
      shortLabel: 'All',
      icon: Filter,
      color: 'default' as const
    },
    { 
      value: 'next30days', 
      label: 'Next 30 Days', 
      shortLabel: '30 Days',
      icon: Clock,
      color: 'destructive' as const
    },
    { 
      value: 'nextQuarter', 
      label: 'Next Quarter', 
      shortLabel: '3 Months',
      icon: Calendar,
      color: 'secondary' as const
    },
    { 
      value: 'nextHalf', 
      label: 'Next 6 Months', 
      shortLabel: '6 Months',
      icon: Calendar,
      color: 'outline' as const
    },
    { 
      value: 'nextYear', 
      label: 'Next Year', 
      shortLabel: '12 Months',
      icon: Calendar,
      color: 'outline' as const
    }
  ];

  return (
    <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b">
      <div className="flex flex-col gap-3 px-4 py-3">
        {/* Filter chips */}
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = selectedPeriod === option.value;
            
            return (
              <Button
                key={option.value}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                onClick={() => onPeriodChange(option.value as FilterPeriod)}
                className={`flex items-center gap-2 transition-all duration-200 ${
                  isSelected 
                    ? 'bg-primary text-primary-foreground shadow-sm' 
                    : 'hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{option.label}</span>
                <span className="sm:hidden">{option.shortLabel}</span>
              </Button>
            );
          })}
        </div>
        
        {/* Results counter */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="secondary" className="font-normal">
              {goalCount} {goalCount === 1 ? 'goal' : 'goals'}
            </Badge>
            {selectedPeriod !== 'all' && (
              <span>
                in {filterOptions.find(opt => opt.value === selectedPeriod)?.label.toLowerCase()}
              </span>
            )}
          </div>
          
          {selectedPeriod !== 'all' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPeriodChange('all')}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Clear filter
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoalFilters;
