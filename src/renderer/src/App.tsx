import Home from './pages/Home'

import { NavButton } from '@components/navButton'
import {
  ArrowPathIcon,
  Cog6ToothIcon,
  FolderIcon,
  Squares2X2Icon
} from '@heroicons/react/24/outline'

function App(): React.JSX.Element {
  return (
    <div className="flex h-screen w-screen bg-mantle text-text">
      <div className="flex w-45 flex-col justify-between gap-4 py-2">
        <nav className="flex items-start flex-col gap-1 px-2 text-sm">
          <NavButton icon={<FolderIcon className="h-5 w-5" />} label="Organize" />
          <NavButton icon={<Squares2X2Icon className="h-5 w-5" />} label="Duplicate" />
          <NavButton icon={<ArrowPathIcon className="h-5 w-5" />} label="Synchronize" />
        </nav>

        <div className="flex items-center justify-center gap-2 px-2">
          <NavButton icon={<Cog6ToothIcon className="h-5 w-5" />} label="Settings" />
        </div>
      </div>

      <div className="flex flex-1 p-2 pl-0">
        <div className="flex rounded-md flex-col items-center gap-4 bg-base shadow-md w-full">
          <Home />
        </div>
      </div>
    </div>
  )
}

export default App
