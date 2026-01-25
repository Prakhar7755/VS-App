export const DraggableNode = ({ type, label }) => {
  const handleDragStart = (event, nodeType) => {
    const dragData = { nodeType };
    event.target.style.cursor = "grabbing";
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify(dragData),
    );
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div
      draggable
      onDragStart={(e) => handleDragStart(e, type)}
      onDragEnd={(e) => (e.target.style.cursor = "grab")}
      className="
        cursor-grab
        min-w-[80px] h-16
        flex flex-col items-center justify-center
        rounded-xl
        bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950
        text-white
        font-semibold text-sm
        shadow-md hover:shadow-lg
        transition-all
        hover:scale-105
      "
    >
      <span>{label}</span>
    </div>
  );
};
