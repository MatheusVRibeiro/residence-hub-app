import React from 'react';
import { Button, ButtonProps } from "@/components/ui/button";
import { LucideProps } from 'lucide-react';

interface ActionItem {
  label: string;
  icon: React.ElementType<LucideProps>;
  onClick?: () => void;
  variant?: ButtonProps['variant'];
}

interface ActionListProps {
  actions: ActionItem[];
}

const ActionList: React.FC<ActionListProps> = ({ actions }) => (
  <div className="space-y-2 pt-4">
    {actions.map((action, index) => {
      const Icon = action.icon;
      return (
        <Button
          key={index}
          variant={action.variant || 'outline'}
          className="w-full justify-start gap-3 text-base py-6"
          onClick={action.onClick}
        >
          <Icon className="h-5 w-5" /> {action.label}
        </Button>
      );
    })}
  </div>
);

export { ActionList };