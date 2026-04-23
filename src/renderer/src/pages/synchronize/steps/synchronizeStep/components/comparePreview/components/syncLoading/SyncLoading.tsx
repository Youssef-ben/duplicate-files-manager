import { LoadingDots } from '@components/loadingDots'

export interface SyncLoadingProps {
  isSynchronizing: boolean
}

export const SyncLoading = ({ isSynchronizing }: SyncLoadingProps): React.JSX.Element => {
  if (!isSynchronizing) return <></>

  return (
    <div className="w-full h-full absolute inset-0 bg-black/60 z-10 flex items-center justify-center gap-2 p-2 cursor-not-allowed rounded-md">
      <span className="text-lg text-white font-semibold font-mono uppercase">
        Synchronizing files
      </span>
      <LoadingDots dotClassName="size-1! bg-white" />
    </div>
  )
}
