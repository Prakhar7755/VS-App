from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Any
from collections import defaultdict, deque

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"Ping": "Pong"}

@app.post("/pipelines/parse")
def parse_pipeline(payload: Dict[str, Any]):
    nodes = payload.get("nodes", [])
    edges = payload.get("edges", [])

    num_nodes = len(nodes)
    num_edges = len(edges)

    graph = defaultdict(list)
    indegree = defaultdict(int)

    for edge in edges:
        src = edge["source"]
        tgt = edge["target"]
        graph[src].append(tgt)
        indegree[tgt] += 1
        if src not in indegree:
            indegree[src] = 0

    queue = deque([n for n in indegree if indegree[n] == 0])
    visited = 0

    while queue:
        node = queue.popleft()
        visited += 1
        for nei in graph[node]:
            indegree[nei] -= 1
            if indegree[nei] == 0:
                queue.append(nei)

    is_dag = visited == len(indegree)

    return {
        "num_nodes": num_nodes,
        "num_edges": num_edges,
        "is_dag": is_dag,
    }
