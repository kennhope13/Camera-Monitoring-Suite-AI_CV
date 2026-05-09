interface PanelProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const Panel = ({ title, children, className = "" }: PanelProps) => (
  <div className={`glass-panel rounded-2xl p-5 ${className}`}>
    {title && (
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-dim)]">{title}</h2>
        <div className="h-[2px] w-6 bg-[var(--accent-blue)] rounded-full opacity-50" />
      </div>
    )}
    {children}
  </div>
);