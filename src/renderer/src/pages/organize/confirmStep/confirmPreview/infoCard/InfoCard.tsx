export interface InfoCardProps {
  title: string;
  value: string;
  description: string | React.JSX.Element;
}

export const InfoCard = ({ title, value, description }: InfoCardProps): React.JSX.Element => {
  return (
    <div className="flex flex-col items-start justify-start w-full gap-1 bg-surface text-on-surface rounded-md p-4 shadow-card">
      <span className="text-[10px] font-bold text-outline-dim uppercase">{title}</span>
      <span className="text-lg font-bold text-on-surface truncate font-mono">{value}</span>
      <span className="text-[10px] font-normal text-outline-dim">{description}</span>
    </div>
  );
};
