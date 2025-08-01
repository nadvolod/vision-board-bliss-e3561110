import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import React from 'react';
import { useOptimizedGoalContext } from '@/context/OptimizedGoalContext';
import { useToast } from '@/components/ui/use-toast';

const ExportGoalsButton: React.FC = () => {
  const { goals } = useOptimizedGoalContext();
  const { toast } = useToast();

  const exportGoals = () => {
    try {
      const exportData = {
        exportDate: new Date().toISOString(),
        totalGoals: goals.length,
        achievedGoals: goals.filter(goal => goal.achieved).length,
        pendingGoals: goals.filter(goal => !goal.achieved).length,
        goals: goals.map(goal => ({
          id: goal.id,
          description: goal.description,
          why: goal.why,
          deadline: goal.deadline,
          createdAt: goal.createdAt,
          achieved: goal.achieved,
          achievedAt: goal.achievedAt,
          imageUrl: goal.image
        }))
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `vision-board-goals-${new Date().toISOString().split('T')[0]}.json`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);

      toast({
        title: "Goals exported successfully",
        description: `Downloaded ${goals.length} goals to your device`,
      });
    } catch (error) {
      console.error('Error exporting goals:', error);
      toast({
        title: "Export failed",
        description: "There was an error exporting your goals",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      onClick={exportGoals}
      variant="outline"
      size="sm"
      className="flex items-center gap-2"
    >
      <Download className="h-4 w-4" />
      <span className="hidden sm:inline">Export Goals</span>
    </Button>
  );
};

export default ExportGoalsButton;