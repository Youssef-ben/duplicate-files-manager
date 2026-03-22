export const SelectionHeader = (): React.JSX.Element => {
  return (
    <div className="flex flex-col items-left justify-center w-full gap-1">
      <span className="text-xl font-semibold text-primary">Start Organizing</span>
      <p className="text-sm text-outline-dim">
        Choose a root directory to begin the automated cleanup and organization process.
      </p>
    </div>
  )
}
