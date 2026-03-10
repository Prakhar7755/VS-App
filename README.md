# VectorShift Frontend Assessment — My Implementation

This repository contains my implementation for the **VectorShift Frontend Technical Assessment**. I focused on creating a **modular, maintainable node system**, a **dynamic text node experience**, and **seamless frontend-backend integration**, all while giving the interface a modern and visually appealing look.

I completed all four parts of the assignment and used this as an opportunity to showcase **scalable React patterns, creative UI design, and robust architectural decisions**.

---

## Overview

The project is a **visual pipeline editor** built with **React** and **React Flow**. Users can:

- Drag and drop nodes to construct pipelines
- Connect nodes using handles
- Define variables in Text nodes using `{{variable}}` syntax
- Submit pipelines to a FastAPI backend for validation

The backend responds with the **total number of nodes, edges**, and whether the pipeline forms a **Directed Acyclic Graph (DAG)**. The frontend displays these results in a non-blocking toast notification.

---

## Part 1: Node Abstraction

To reduce duplication and make the node system scalable, I created a **BaseNode component** that standardizes:

- Node layout and spacing
- Header and body structure
- Handle placement and styling
- Variant-based coloring for different node types

Using this abstraction, I built the core nodes (Input, Output, LLM, Text) **on top of BaseNode**, eliminating repeated code.

Additionally, I created **five extra nodes** to demonstrate flexibility:

- NumberNode
- BooleanNode
- DelayNode
- ConcatNode
- ConditionNode

These nodes are simple examples, but they show how quickly new node types can be added using the BaseNode abstraction.

**Why I did this:** By using composition, I ensured that all nodes are consistent and easy to maintain or extend in the future.

---

## Part 2: Styling

The original files had minimal styling, so I built a **unified design system** from the ground up:

- Dark, gradient backgrounds for nodes and toolbar
- Neon-style accent colors for different node variants
- Clear header/body separation in nodes
- Responsive layout and hover effects
- Auto-resizing text areas for better user experience

I used **Tailwind CSS** to make the styling modular, reusable, and easy to tweak globally. The UI now has a modern, interactive feel, with subtle animations on hover and drag events.

---

## Part 3: Text Node Logic

The Text node now supports:

### Auto-Resizing

- The text area expands automatically as the user types, so content is always visible.

### Dynamic Variables

- Users can define variables in `{{variable}}` format.
- Each valid variable creates a **handle on the left** of the Text node.
- Duplicate variables do not create duplicate handles.
- Removing a variable removes the corresponding handle (unless connected to an edge).

### Variable Suggestions

- Typing `{{` opens a dropdown of available input nodes.
- Typing `.` after a node name shows output fields.
- Users can navigate suggestions with **arrow keys** and select with **Enter**.

### Stability

- Dynamic handles and edges are synchronized with React Flow internals.
- Node updates and edge cleanup are carefully managed to prevent invalid connections.

---

## Part 4: Backend Integration

I integrated the frontend with the **provided FastAPI backend**:

- **Endpoint:** `/pipelines/parse`

- Calculates:
  - Number of nodes
  - Number of edges
  - Whether the pipeline forms a DAG (`is_dag`)

- **Frontend workflow:**
  - Clicking the **Submit Pipeline** button sends nodes and edges to the backend
  - The backend response is displayed in a **non-blocking toast notification** using `react-hot-toast`.
  - Users immediately see the results (total nodes, total edges, and DAG status) without their workflow being interrupted.

This allows users to build a pipeline, submit it, and get instant validation feedback.

---

## Architecture & Robustness

Beyond the core features, I implemented several patterns to ensure the application is scalable, stable, and performant.

- **Decoupled Configuration:** The list of available nodes is not hardcoded in the UI. It's sourced from a central `nodeConfig.js` file, decoupling configuration from presentation. This makes adding or modifying nodes a trivial task without touching component logic.

- **Resilient State & IDs:** Each new node is assigned a **universally unique ID** via the `uuid` library, preventing ID collisions and bugs that can arise from simple counters. This makes the state management more robust for future features like copy/paste.

- **Error Boundaries:** A `NodeRenderGuard` wraps every node. If one node fails to render, it won't crash the entire application. The rest of the pipeline remains interactive, with only the faulty node showing an error.

- **Non-Blocking UX:** Instead of using blocking browser `alert()`s, feedback from the backend is delivered via `react-hot-toast`. This provides a modern, seamless UX that doesn't interrupt the user's workflow.

- **Performant Rendering:** Heavy computations are memoized with `useMemo`, and state management with Zustand uses `shallow` selectors to prevent unnecessary component re-renders, ensuring the UI remains smooth and responsive.

---

## Future Improvements

Some enhancements I would consider adding next:

- Persist pipelines to a backend database
- Undo/redo functionality
- Inline variable validation and autocomplete across all nodes
- A more advanced visual style for the canvas (neon edges, animations)
