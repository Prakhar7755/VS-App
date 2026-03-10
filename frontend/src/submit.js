import axios from "axios";
import { useStore } from "./store";
import toast from "react-hot-toast";

export const submitPipeline = async () => {
  const { nodes, edges } = useStore.getState();

  try {
    if (nodes.length === 0) {
      toast.error("Pipeline is empty. Add some nodes first!");
      return;
    }
    const response = await axios.post(
      "http://localhost:8000/pipelines/parse",
      {
        nodes: nodes.map((node) => ({ id: node.id })),
        edges: edges.map((edge) => ({
          source: edge.source,
          target: edge.target,
        })),
      },
      {
        headers: { "Content-Type": "application/json" },
      },
    );

    const { num_nodes, num_edges, is_dag } = response.data;

    toast.success((t) => (
      <div className="flex flex-col gap-1 text-sm">
        <p className="font-semibold">Pipeline Parsed Successfully!</p>
        <p>Total Nodes: {num_nodes}</p>
        <p>Total Edges: {num_edges}</p>
        <p>Is DAG: {is_dag ? "Yes ✅" : "No ❌"}</p>
      </div>
    ));
  } catch (error) {
    console.error("Pipeline submit failed:", error);
    const errorMessage =
      error.response?.data?.detail || "Failed to submit pipeline";
    toast.error(errorMessage);
  }
};

export const SubmitButton = () => {
  return (
    <button
      onClick={submitPipeline}
      className="
    mx-auto mt-5 block
    px-6 py-2.5
    rounded-xl
    bg-gradient-to-r from-cyan-500/80 to-indigo-500/80
    text-sm font-semibold text-white
    shadow-lg
    hover:from-cyan-400 hover:to-indigo-400
    hover:shadow-cyan-500/30
    active:scale-95
    transition-all
  "
    >
      Submit Pipeline
    </button>
  );
};
