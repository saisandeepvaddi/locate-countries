import PrimaryLayout from './components/Layouts/PrimaryLayout';
import { Toaster } from './components/ui/toaster';
function App() {
  return (
    <div className='h-screen w-screen p-0 m-0 overflow-hidden'>
      <PrimaryLayout />
      <Toaster />
    </div>
  );
}

export default App;
