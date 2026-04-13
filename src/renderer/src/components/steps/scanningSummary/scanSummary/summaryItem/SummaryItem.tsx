export interface SummaryItemProps {
  label: string
  value: string
}

export const SummaryItem = ({ label, value }: SummaryItemProps): React.JSX.Element => {
  return (
    <div className="flex w-full min-w-0 flex-row items-center justify-between gap-2">
      <span className="text-xs text-on-surface-variant capitalize">{label}</span>
      <span className="text-xs font-semibold text-primary uppercase font-mono">{value}</span>
    </div>
  )
}
