import { Navigation, SidebarNavigation } from '@renderer/Navigation'

function App(): React.JSX.Element {
  return (
    <div className="flex h-screen w-screen bg-mantle text-text">
      <SidebarNavigation />

      <Navigation />
    </div>
  )
}

export default App
