# VectorShift Frontend Assessment — My Implementation

This repository contains my implementation for the **VectorShift Frontend Technical Assessment**. I focused on creating a **modular, maintainable node system**, a **dynamic text node experience**, and **seamless frontend-backend integration**, all while giving the interface a modern and visually appealing look.

I completed all four parts of the assignment and used this as an opportunity to showcase **scalable React patterns, creative UI design, and robust state management**.

---

## Overview

The project is a **visual pipeline editor** built with **React** and **React Flow**. Users can:

* Drag and drop nodes to construct pipelines
* Connect nodes using handles
* Define variables in Text nodes using `{{variable}}` syntax
* Submit pipelines to a FastAPI backend for validation

The backend responds with the **total number of nodes, edges**, and whether the pipeline forms a **Directed Acyclic Graph (DAG)**. The frontend displays these results in a user-friendly alert.

---

## Part 1: Node Abstraction

To reduce duplication and make the node system scalable, I created a **BaseNode component** that standardizes:

* Node layout and spacing
* Header and body structure
* Handle placement and styling
* Variant-based coloring for different node types

Using this abstraction, I built the core nodes (Input, Output, LLM, Text) **on top of BaseNode**, eliminating repeated code.

Additionally, I created **five extra nodes** to demonstrate flexibility:

* NumberNode
* BooleanNode
* DelayNode
* ConcatNode
* ConditionNode

These nodes are simple examples, but they show how quickly new node types can be added using the BaseNode abstraction.

**Why I did this:** By using composition instead of copy-pasting, I ensured that all nodes are consistent and easy to maintain or extend in the future.

---

## Part 2: Styling

The original files had minimal styling, so I built a **unified design system** from the ground up:

* Dark, gradient backgrounds for nodes and toolbar
* Neon-style accent colors for different node variants
* Clear header/body separation in nodes
* Responsive layout and hover effects
* Auto-resizing text areas for better user experience

I used **Tailwind CSS** to make the styling modular, reusable, and easy to tweak globally. The UI now has a modern, interactive feel, with subtle animations on hover and drag events.

---

## Part 3: Text Node Logic

The Text node now supports:

### Auto-Resizing

* The text area expands automatically as the user types, so content is always visible.

### Dynamic Variables

* Users can define variables in `{{variable}}` format.
* Each valid variable creates a **handle on the left** of the Text node.
* Duplicate variables do not create duplicate handles.
* Removing a variable removes the corresponding handle (unless connected to an edge).

### Variable Suggestions

* Typing `{{` opens a dropdown of available input nodes.
* Typing `.` after a node name shows output fields.
* Users can navigate suggestions with **arrow keys** and select with **Enter**.

### Stability

* Dynamic handles and edges are synchronized with React Flow internals.
* Node updates and edge cleanup are carefully managed to prevent invalid connections.

---

## Part 4: Backend Integration

I integrated the frontend with the **provided FastAPI backend**:

* **Endpoint:** `/pipelines/parse`

* Calculates:

  * Number of nodes
  * Number of edges
  * Whether the pipeline forms a DAG (`is_dag`)

* **Frontend workflow:**

  * Clicking the **Submit Pipeline** button sends nodes and edges to the backend
  * The backend response is displayed in a **user-friendly alert**
  * Users immediately see total nodes, total edges, and DAG status

This allows users to build a pipeline, submit it, and get instant validation feedback.

---

## Error Handling

* I implemented a **NodeRenderGuard** (error boundary) around all nodes.
* If a node fails to render:

  * The rest of the editor continues to function
  * Only the problematic node shows an error
* This ensures robustness in a dynamic, user-generated environment.

---

## Performance Considerations

* Heavy computations are memoized using `useMemo` to avoid unnecessary re-renders
* Side effects are scoped with `useEffect` to prevent instability
* Dynamic updates to handles and edges are efficient, avoiding render loops

---

## Future Improvements

Some enhancements I would consider adding next:

* Persist pipelines to a backend database
* Undo/redo functionality
* Inline variable validation and autocomplete across all nodes
* A more advanced visual style for the canvas (neon edges, animations)

