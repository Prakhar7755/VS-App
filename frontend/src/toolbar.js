import { DraggableNode } from "./draggableNode";
import { nodeLibrary } from "./nodeConfig";

export const PipelineToolbar = () => {
  return (
    <div className="p-4 bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900 rounded-2xl shadow-inner">
      <h3 className="text-gray-100 font-semibold mb-3 text-sm tracking-wide">
        Node Library
      </h3>
      <div className="flex flex-wrap gap-3">
        {nodeLibrary.map((node) => (
          <div
            key={node.type}
            className="
              p-2.5 
              rounded-lg 
              bg-gray-800/80 
              backdrop-blur-sm 
              text-gray-100 
              hover:bg-gray-700/80 
              cursor-grab 
              transition
              shadow-md hover:shadow-lg
              text-xs font-medium
              flex items-center justify-center
              min-w-[60px]
            "
          >
            <DraggableNode type={node.type} label={node.label} />
          </div>
        ))}
      </div>
    </div>
  );
};
