import { Toaster } from 'sonner';
import { Navigation, SidebarNavigation } from './navigation';

function App(): React.JSX.Element {
  return (
    <div className="flex h-screen w-screen bg-surface text-on-surface">
      <SidebarNavigation />

      <Navigation />
      <Toaster closeButton richColors position="bottom-center" />
    </div>
  );
}

export default App;
