import { useState, useRef, useEffect, useMemo } from "react";
import { BaseNode } from "./BaseNode";
import { useStore } from "../store";
import { useUpdateNodeInternals } from "reactflow";

/**
 * Detect suggestion mode for text templating
 */
export const analyzeSuggestion = (text, cursor) => {
  const before = text.slice(0, cursor);
  const fieldMatch = before.match(/{{\s*([\w]+)\.\s*([\w]*)$/);
  if (fieldMatch) return { mode: "field", activeNode: fieldMatch[1] };
  const nodeMatch = before.match(/{{\s*([\w]*)$/);
  if (nodeMatch) return { mode: "node", activeNode: null };
  return null;
};

export const TextNode = ({ id, data }) => {
  const updateNodeInternals = useUpdateNodeInternals();
  const textareaRef = useRef(null);

  const [content, setContent] = useState(data?.text || "");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mode, setMode] = useState("node");
  const [activeNode, setActiveNode] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const nodes = useStore((s) => s.nodes);
  const edges = useStore((s) => s.edges);
  const setEdges = useStore.setState;

  // AUTO RESIZE
  useEffect(() => {
    if (!textareaRef.current) return;
    const el = textareaRef.current;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  }, [content]);

  const variables = useMemo(() => {
    const matches = [...content.matchAll(/{{\s*([a-zA-Z_$][\w$]*)\s*}}/g)];
    const unique = [...new Set(matches.map((m) => m[1]))];
    return unique;
  }, [content]);

  const variableHandles = useMemo(
    () =>
      variables.map((v, i) => ({
        type: "target",
        position: "left",
        id: `${id}-${v}`,
        style: { top: 40 + i * 24 },
        label: v,
      })),
    [variables, id],
  );

  // update reactflow internals whenever variables change
  useEffect(() => {
    updateNodeInternals(id);
  }, [id, variables, updateNodeInternals]);

  const handleChange = (e) => {
    const value = e.target.value;
    setContent(value);
    data.text = value;

    const detected = analyzeSuggestion(value, e.target.selectionStart);
    if (detected) {
      setMode(detected.mode);
      setActiveNode(detected.activeNode);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
      setActiveNode(null);
    }
  };

  const insertAtCursor = (insertValue) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const cursor = textarea.selectionStart;
    const before = content.slice(0, cursor).replace(/{{\s*[\w.]*$/, "");
    const after = content.slice(cursor);

    const nextText = before + insertValue + after;
    setContent(nextText);
    data.text = nextText;

    requestAnimationFrame(() => {
      textarea.focus();
      const pos = before.length + insertValue.length;
      textarea.selectionStart = textarea.selectionEnd = pos;
    });
  };

  const suggestions = useMemo(() => {
    if (!showSuggestions) return [];
    if (mode === "node")
      return variables.map((name) => ({
        label: name,
        value: `{{${name}`,
      }));
    if (mode === "field" && activeNode)
      return [{ label: "text", value: `{{${activeNode}.text` }];
    return [];
  }, [showSuggestions, mode, variables, activeNode]);

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => (i + 1) % suggestions.length);
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => (i === 0 ? suggestions.length - 1 : i - 1));
    }

    if (e.key === "Enter") {
      e.preventDefault();
      insertAtCursor(suggestions[selectedIndex].value);
      setShowSuggestions(false);
    }

    if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    if (showSuggestions) setSelectedIndex(0);
  }, [showSuggestions, mode]);

  return (
    <BaseNode
      title="Text"
      variant="text"
      handles={[
        ...variableHandles,
        { type: "source", position: "right", id: `${id}-output` },
      ]}
    >
      <textarea
        ref={textareaRef}
        value={content}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Type text… use {{ }}"
        className="w-full rounded-md bg-black/20 border border-gray-700 text-gray-100 px-2 py-1.5 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-cyan-400"
      />

      {showSuggestions && (
        <div className="variable-suggestions bg-gray-800/90 border border-gray-600 rounded-md shadow-lg mt-1">
          {suggestions.map((s, i) => (
            <div
              key={s.label}
              className={`variable-suggestion px-2 py-1 text-sm cursor-pointer ${
                i === selectedIndex
                  ? "bg-cyan-600 text-white"
                  : "text-gray-100 hover:bg-gray-700"
              }`}
              onMouseEnter={() => setSelectedIndex(i)}
              onClick={() => {
                insertAtCursor(s.value);
                setShowSuggestions(false);
              }}
            >
              {s.label}
            </div>
          ))}
        </div>
      )}
    </BaseNode>
  );
};
