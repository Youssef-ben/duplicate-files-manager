import { LightBulbIcon } from '@heroicons/react/24/solid'

export const SelectionNotice = (): React.JSX.Element => {
  return (
    <div className="mt-4 flex flex-col items-left justify-center w-fit gap-2 h-fit bg-surface px-4 py-2 border-l-6 border-primary ">
      <div className="flex flex-row items-center justify-left gap-2">
        <LightBulbIcon className="size-5 text-primary shrink-0" />
        <span className="text-sm font-semibold text-primary">Organization Tips</span>
      </div>
      <ul className="text-xs text-on-secondary-container list-disc list-inside pl-8">
        <li>You can drag and drop a folder inside the above box or click anywhere to browse.</li>
        <li>Selecting a parent folder will automatically index all sub-directories.</li>
      </ul>
    </div>
  )
}
