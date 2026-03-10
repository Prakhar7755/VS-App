import { useState, useEffect } from "react";
import { BaseNode } from "./BaseNode";

export const InputNode = ({ id, data }) => {
  const [name, setName] = useState(
    data?.name || `input_${id.split('-')[0]}`,
  );

  const [inputType, setInputType] = useState(data?.inputType || "text");

  // KEEP the node DATa in synch
  useEffect(() => {
    if (data) {
      data.name = name;
      data.inputType = inputType;
    }
  }, [name, inputType, data]);

  return (
    <BaseNode
      title="Input"
      variant="input"
      handles={[
        {
          type: "source",
          position: "right",
          id: `${id}-output`,
        },
      ]}
    >
      {/* INPUT  */}
      <label>
        Name
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="input0"
        />
      </label>

      {/* selec */}
      <label>
        Type
        <select
          value={inputType}
          onChange={(e) => setInputType(e.target.value)}
        >
          <option value="text">Text</option>
          <option value="file">File</option>
        </select>
      </label>
    </BaseNode>
  );
};
