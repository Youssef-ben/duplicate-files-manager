import { Breadcrumbs } from '@components/Breadcrumbs'

export default function Duplicate(): React.JSX.Element {
  return (
    <div className="flex flex-col gap-4 w-full">
      <Breadcrumbs />

      <div className="flex flex-col items-center gap-2 w-full">
        <h1 className="text-xl font-semibold">Duplicate</h1>
        <p className="text-sm text-subtext1">Duplicate file tools will appear here.</p>
      </div>
    </div>
  )
}
