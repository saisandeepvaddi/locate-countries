import PrimaryLayout from "./components/Layouts/PrimaryLayout";
import { Toaster } from "./components/ui/toaster";
function App() {
  return (
    <div className="h-dvh w-dvw">
      <PrimaryLayout />
      <Toaster />
    </div>
  );
}

export default App;
