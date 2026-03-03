import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

interface Props {
  title: string;
  icon?: LucideIcon;
  iconColor?: string;
  badge?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function SectionCard({ title, icon: Icon, iconColor = 'text-duetto-blue', badge, action, children, className = '' }: Props) {
  return (
    <div className={`card ${className}`}>
      <div className="card-header flex items-center justify-between">
        <div className="flex items-center gap-2">
          {Icon && <Icon size={15} className={iconColor} />}
          <h3 className="font-semibold text-duetto-navy text-sm">{title}</h3>
          {badge}
        </div>
        {action}
      </div>
      <div className="card-body">{children}</div>
    </div>
  );
}
