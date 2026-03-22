interface ProgressBarProps {
  percentage: number
}

export const ProgressBar = ({ percentage }: ProgressBarProps): React.JSX.Element => {
  return (
    <div className="flex flex-col items-left justify-center w-full">
      {/* Progress bar */}
      <div className="h-2 rounded-full bg-surface-variant overflow-hidden mb-1">
        <div
          className="h-2 rounded-full bg-primary smooth-progress-bar"
          style={{
            width: `${percentage}%`
          }}
        />
      </div>
    </div>
  )
}
