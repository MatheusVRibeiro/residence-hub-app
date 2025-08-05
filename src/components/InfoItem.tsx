import React from 'react';
import { LucideProps } from 'lucide-react';

interface InfoItemProps {
  icon: React.ElementType<LucideProps>;
  value: string;
}

const InfoItem: React.FC<InfoItemProps> = ({ icon: Icon, value }) => (
  <div className="flex items-center gap-3 text-sm p-3 rounded-lg bg-background border border-border">
    <Icon className="h-4 w-4 text-muted-foreground" />
    <span className="text-foreground">{value}</span>
  </div>
);

export { InfoItem };