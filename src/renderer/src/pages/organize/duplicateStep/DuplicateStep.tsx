import { SimpleButton } from '@components/buttons'
import { StepProgress } from '@components/stepProgress'
import { DuplicateCompleted } from './duplicateCompleted'
import { DuplicateHeader } from './duplicateHeader'
import { DuplicatePreview } from './duplicatePreview'
import { useDuplicateStep } from './useDuplicateStep'

export const DuplicateStep = (): React.JSX.Element => {
  const { result, isRunning, isCompleted, startedAtMs, progress, run, handleStartProcess } =
    useDuplicateStep()

  return (
    <div className="flex flex-1 flex-col w-full h-full gap-4 overflow-hidden">
      <DuplicateHeader onReRunClick={handleStartProcess} result={result} />

      {!isCompleted && <DuplicatePreview />}

      {/* Start Processing Button */}
      {!isRunning && !isCompleted && (
        <div className="flex flex-col items-end justify-center w-full gap-1">
          <SimpleButton variant="outline" label="Find Duplicates" onClick={handleStartProcess} />
        </div>
      )}

      {isRunning && progress && startedAtMs && (
        <StepProgress startedAtMs={startedAtMs} progress={progress} />
      )}

      {isCompleted && <DuplicateCompleted onDeleteClick={run} onReRunClick={handleStartProcess} />}
    </div>
  )
}
