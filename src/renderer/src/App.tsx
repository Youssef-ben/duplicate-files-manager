import { Navigation, SidebarNavigation } from './navigation'

function App(): React.JSX.Element {
  return (
    <div className="flex h-screen w-screen bg-surface text-on-surface">
      <SidebarNavigation />

      <Navigation />
    </div>
  )
}

export default App
