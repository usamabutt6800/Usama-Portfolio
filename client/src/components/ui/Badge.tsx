// src/components/ui/Badge.tsx
import { cn } from '@/utils';
import { TECH_COLORS } from '@/constants';

interface BadgeProps {
  label: string;
  color?: string;
  size?: 'sm' | 'md';
}

export const Badge = ({ label, color, size = 'sm' }: BadgeProps) => {
  const techColor = color || TECH_COLORS[label] || '#00f5ff';
  return (
    <span
      className={cn(
        'inline-flex items-center font-mono rounded-full border',
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      )}
      style={{
        borderColor: `${techColor}40`,
        color: techColor,
        backgroundColor: `${techColor}10`,
      }}
    >
      {label}
    </span>
  );
};

// Category badge with solid bg
export const CategoryBadge = ({ label }: { label: string }) => (
  <span className="px-3 py-1 rounded-full bg-cyan/10 border border-cyan/20 text-cyan text-xs font-mono uppercase tracking-wider">
    {label}
  </span>
);
