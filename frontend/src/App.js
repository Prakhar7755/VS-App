import { PipelineToolbar } from "./toolbar";
import { PipelineUI } from "./ui";
import { SubmitButton } from "./submit";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900 text-gray-100 flex flex-col items-center p-6 pb-1 gap-1">
      <Toaster position="top-center" toastOptions={{ style: { background: '#334155', color: '#fff' } }} />
      <PipelineToolbar />

      <PipelineUI />

      <SubmitButton />
    </div>
  );
}

export default App;
