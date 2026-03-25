import { FolderIcon, ServerIcon, SquaresPlusIcon } from '@heroicons/react/24/outline'
import { StepSelector, useOrganizeStore } from '@pages/organize/store/organizeStore'
import { formatDuration, humanizeSize } from '@utils/strings'
import { useMemo } from 'react'
import { InfoCard } from './infoCard'
import { ProcessDataCard } from './processDataCard'

const MB = 1024 * 1024
const FIXED_SPEED_BYTES = 60 * MB
const FIXED_SPEED_BYTES_PER_MS = FIXED_SPEED_BYTES / 1000
const PER_FILE_OVERHEAD_MS = 50 // ~50ms per file for open/stat/metadata/close

export const ConfirmPreview = (): React.JSX.Element => {
  const { getPath } = useOrganizeStore()
  const { result } = useOrganizeStore(StepSelector('duplicates'))
  const etaInMS = useMemo(() => {
    const transferMs = (result?.total_bytes ?? 0) / FIXED_SPEED_BYTES_PER_MS
    const overheadMs = (result?.scanned ?? 0) * PER_FILE_OVERHEAD_MS
    return Math.round(transferMs + overheadMs)
  }, [result?.total_bytes, result?.scanned])

  if (!result) return <></>

  return (
    <div className="flex flex-col items-start justify-start w-full h-fit gap-2 px-1">
      <div className="flex flex-row items-center justify-center w-full gap-2">
        {/** Operation Scope */}
        <div className="flex flex-2 flex-col items-start justify-center w-full h-full gap-1 py-4 px-6 bg-surface-bright shadow-card rounded-md">
          {/** Card Title */}
          <div className="flex flex-row items-end justify-between w-full gap-2">
            <span className="text-[10px] font-bold uppercase text-outline-dim">
              Operation Scope
            </span>
            <span className="text-[10px] font-semibold bg-primary text-on-primary rounded-sm px-2 ">
              Ready
            </span>
          </div>

          {/** Operation scope content */}
          <div className="flex flex-row items-baseline justify-start w-full gap-2">
            <span className="text-[42px] font-bold text-primary font-mono">
              {result.scanned.toLocaleString()}
            </span>
            <span className="text-sm text-outline-dim"> Files identified</span>
          </div>

          <ProcessDataCard
            title="Output Folder"
            icon={<FolderIcon className="size-5 stroke-1.5" />}
            value={getPath()}
          />

          {/** Target Structure */}
          <ProcessDataCard
            title="Target Structure"
            icon={<SquaresPlusIcon className="size-5 stroke-1.5" />}
            value={
              <>
                <span className="text-xs font-semibold text-outline-dim font-mono">
                  {`{year}/{month}-{MonthName}`}
                </span>
                <br />
                <span className="text-[10px] font-normal text-outline-dim">
                  (e.g. 2024/03-March)
                </span>
              </>
            }
          />

          {/** Estimated Size */}
          <ProcessDataCard
            title="Estimated Size"
            icon={<ServerIcon className="size-5 stroke-1.5" />}
            value={
              <>
                <span className="font-mono font-semibold mr-1">
                  {humanizeSize(result.total_bytes)}
                </span>
                total volume
              </>
            }
          />
        </div>

        {/** Operation Summary */}
        <div className="flex flex-1 flex-col items-center justify-start w-full h-full gap-2">
          {/** Duration */}
          <InfoCard
            title="Duration"
            value={`~${formatDuration(etaInMS)}`}
            description={
              <span className="text-[10px] font-normal text-outline-dim">
                Estimated Transfer rate is{' '}
                <span className="text-xs font-mono font-semibold">
                  {humanizeSize(FIXED_SPEED_BYTES)} per second
                </span>
              </span>
            }
          />

          {/** Conflict */}
          <InfoCard
            title="Conflict"
            value={result.duplicate_files.toLocaleString()}
            description={
              result.duplicate_files > 0 ? (
                <span className="text-[10px] font-normal text-outline-dim">
                  Auto rename will be applied.
                </span>
              ) : (
                <span className="text-[10px] font-normal text-outline-dim">No conflicts found</span>
              )
            }
          />
        </div>
      </div>
    </div>
  )
}
