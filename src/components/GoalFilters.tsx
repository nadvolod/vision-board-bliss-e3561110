
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Filter } from 'lucide-react';

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
    { value: 'all', label: 'All Goals' },
    { value: 'next30days', label: 'Next 30 Days' },
    { value: 'nextQuarter', label: 'Next Quarter (3 months)' },
    { value: 'nextHalf', label: 'Next Half (6 months)' },
    { value: 'nextYear', label: 'Next Year (12 months)' }
  ];

  return (
    <div className="flex items-center gap-3 px-4 py-2 border-b bg-background/50">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Filter className="h-4 w-4" />
        <span>Filter by deadline:</span>
      </div>
      
      <Select value={selectedPeriod} onValueChange={onPeriodChange}>
        <SelectTrigger className="w-48">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <SelectValue />
          </div>
        </SelectTrigger>
        <SelectContent>
          {filterOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <span className="text-sm text-muted-foreground">
        {goalCount} {goalCount === 1 ? 'goal' : 'goals'}
      </span>
    </div>
  );
};

export default GoalFilters;
