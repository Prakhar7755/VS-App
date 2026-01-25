import { useState, useRef, useCallback } from "react";
import ReactFlow, { Controls, Background, MiniMap } from "reactflow";
import { useStore } from "./store";
import { shallow } from "zustand/shallow";

import { InputNode } from "./nodes/inputNode";
import { LLMNode } from "./nodes/llmNode";
import { OutputNode } from "./nodes/outputNode";
import { TextNode } from "./nodes/textNode";
import { BooleanNode } from "./nodes/BooleanNode";
import { ConcatNode } from "./nodes/ConcatNode";
import { ConditionNode } from "./nodes/ConditionNode";
import { DelayNode } from "./nodes/DelayNode";
import { NumberNode } from "./nodes/NumberNode";
import { NodeRenderGuard } from "./components/NodeRenderGuard";

import "reactflow/dist/style.css";

const gridSize = 20;
const proOptions = { hideAttribution: true };

const withErrorBoundary = (NodeComponent) => (props) => (
  <NodeRenderGuard>
    <NodeComponent {...props} />
  </NodeRenderGuard>
);

const nodeTypes = {
  customInput: withErrorBoundary(InputNode),
  text: withErrorBoundary(TextNode),
  llm: withErrorBoundary(LLMNode),
  customOutput: withErrorBoundary(OutputNode),
  boolean: withErrorBoundary(BooleanNode),
  concat: withErrorBoundary(ConcatNode),
  condition: withErrorBoundary(ConditionNode),
  delay: withErrorBoundary(DelayNode),
  number: withErrorBoundary(NumberNode),
};

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

export const PipelineUI = () => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const {
    nodes,
    edges,
    getNodeID,
    addNode,
    onNodesChange,
    onEdgesChange,
    onConnect,
  } = useStore(selector, shallow);

  const getInitNodeData = (nodeID, type) => ({
    id: nodeID,
    nodeType: type,
  });

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const rawData = event.dataTransfer.getData("application/reactflow");

      if (!rawData) return;

      const { nodeType: type } = JSON.parse(rawData);
      if (!type) return;

      const position = reactFlowInstance.project({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });

      const nodeID = getNodeID(type);

      addNode({
        id: nodeID,
        type,
        position,
        data: getInitNodeData(nodeID, type),
      });
    },
    [reactFlowInstance, addNode, getNodeID]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  return (
   <div className="
  w-full h-[70vh]
  rounded-2xl
  bg-gradient-to-br
  from-slate-950 via-indigo-950 to-slate-900
  border border-white/10
  shadow-[inset_0_0_40px_rgba(0,0,0,0.6)]
">
<div
  ref={reactFlowWrapper}
  className="
    w-full h-full
    rounded-2xl
    overflow-hidden
  "
>

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onInit={setReactFlowInstance}
          nodeTypes={nodeTypes}
          proOptions={proOptions}
          snapGrid={[gridSize, gridSize]}
          connectionLineType="smoothstep"
        >
          <Background
    gap={gridSize}
    color="#38bdf8"
  />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>
    </div>
  );
};
