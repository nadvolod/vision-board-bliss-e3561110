import React, { useMemo } from 'react';
import { FixedSizeGrid as Grid } from 'react-window';
import OptimizedGoalCard from './OptimizedGoalCard';
import { Goal } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';

interface VirtualizedGoalListProps {
  goals: Goal[];
  onGoalClick: (goal: Goal, index: number) => void;
  className?: string;
}

interface GridItemProps {
  columnIndex: number;
  rowIndex: number;
  style: React.CSSProperties;
  data: {
    goals: Goal[];
    columnsPerRow: number;
    onGoalClick: (goal: Goal, index: number) => void;
  };
}

const GridItem: React.FC<GridItemProps> = ({ columnIndex, rowIndex, style, data }) => {
  const { goals, columnsPerRow, onGoalClick } = data;
  const goalIndex = rowIndex * columnsPerRow + columnIndex;
  const goal = goals[goalIndex];

  if (!goal) {
    return <div style={style} />;
  }

  return (
    <div style={style} className="p-2">
      <OptimizedGoalCard
        goal={goal}
        index={goalIndex}
        onClick={() => onGoalClick(goal, goalIndex)}
      />
    </div>
  );
};

export const VirtualizedGoalList: React.FC<VirtualizedGoalListProps> = ({
  goals,
  onGoalClick,
  className = ''
}) => {
  const isMobile = useIsMobile();
  
  const { columnsPerRow, columnWidth, rowHeight } = useMemo(() => {
    const columns = isMobile ? 1 : 3;
    const width = isMobile ? 350 : 300;
    const height = isMobile ? 180 : 200;
    
    return {
      columnsPerRow: columns,
      columnWidth: width,
      rowHeight: height
    };
  }, [isMobile]);

  const rowCount = Math.ceil(goals.length / columnsPerRow);
  const containerHeight = Math.min(600, rowCount * rowHeight);

  const itemData = useMemo(() => ({
    goals,
    columnsPerRow,
    onGoalClick
  }), [goals, columnsPerRow, onGoalClick]);

  if (goals.length === 0) {
    return null;
  }

  return (
    <div className={`w-full ${className}`}>
      <Grid
        columnCount={columnsPerRow}
        columnWidth={columnWidth}
        height={containerHeight}
        rowCount={rowCount}
        rowHeight={rowHeight}
        itemData={itemData}
        width="100%"
        style={{ margin: '0 auto' }}
      >
        {GridItem}
      </Grid>
    </div>
  );
};