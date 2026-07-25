export interface ProcessDataCardProps {
  title: string;
  value: string | React.JSX.Element;
  icon: React.ReactNode;
}

export const ProcessDataCard = ({
  title,
  value,
  icon
}: ProcessDataCardProps): React.JSX.Element => {
  return (
    <div className="flex flex-row items-start justify-start w-full gap-2 text-primary mt-4 px-1">
      {icon}
      <div className="flex flex-col items-start justify-center w-full">
        <span className="text-sm font-medium">{title}</span>
        <span className="text-xs font-normal text-outline-dim ">{value}</span>
      </div>
    </div>
  );
};
