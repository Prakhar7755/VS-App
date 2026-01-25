import axios from "axios";
import { useStore } from "./store";

export const submitPipeline = async () => {
  const { nodes, edges } = useStore.getState();

  try {
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

    alert(
      `Pipeline Parsed Successfully\n\n` +
        `Total Nodes: ${num_nodes}\n` +
        `Total Edges: ${num_edges}\n` +
        `Is DAG: ${is_dag ? "Yes" : "No"}`,
    );
  } catch (error) {
    console.error("Pipeline submit failed:", error);
    alert("Failed to submit pipeline");
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
