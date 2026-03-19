import { Breadcrumbs } from '@components/Breadcrumbs'

export default function Organize(): React.JSX.Element {
  return (
    <div className="flex flex-col gap-4 w-full">
      <Breadcrumbs />

      <div className="flex flex-col items-center gap-2 w-full">
        <h1 className="text-xl font-semibold">Organize</h1>
        <p className="text-sm text-subtext1">Library Organizer</p>
      </div>
    </div>
  )
}
