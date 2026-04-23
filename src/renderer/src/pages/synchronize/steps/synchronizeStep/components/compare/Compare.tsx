import { SimpleButton } from '@components/buttons'
import { Summary } from './summary'
import { useCompare } from './useCompare'

export interface CompareProps {
  onCompareClick: () => void
}

export const Compare = ({ onCompareClick }: CompareProps): React.JSX.Element => {
  const { isIdle, sourceSummaryProps, destinationSummaryProps, buttonProps } =
    useCompare(onCompareClick)

  return (
    <div className="flex min-h-0 flex-1 flex-col w-full gap-4">
      <div className="flex flex-row items-center justify-center w-full gap-2">
        <Summary {...sourceSummaryProps} />
        <Summary {...destinationSummaryProps} />
      </div>

      {/* Start Processing Button */}
      {isIdle && (
        <div className="flex flex-col items-end justify-center w-full gap-1">
          <SimpleButton {...buttonProps} />
        </div>
      )}
    </div>
  )
}
