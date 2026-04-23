import { MediaPreview } from '@components/mediaPreview'

interface GroupPreviewProps {
  filePath: string
}

export const GroupPreview = ({ filePath }: GroupPreviewProps): React.JSX.Element => {
  return (
    <div className="flex shrink-0 items-center justify-center px-0 pt-0 w-full min-h-0">
      <div className="w-[230px] h-[230px] xl:w-[350px] xl:h-[350px] aspect-square min-w-0">
        <MediaPreview filePath={filePath} />
      </div>
    </div>
  )
}
