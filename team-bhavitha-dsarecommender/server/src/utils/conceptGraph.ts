import fs from "fs";
import path from "path";

type Graph = {
  nodes: { id: string }[];
  links: { source: string; target: string }[];
};

const graph: Graph = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../data/concept_graph_full.json"), "utf-8")
);

// Build reverse adjacency list (target ➝ [sources])
const prereqMap: Record<string, string[]> = {};

for (const { source, target } of graph.links) {
  if (!prereqMap[target]) prereqMap[target] = [];
  prereqMap[target].push(source);
}

// Recursive DFS to collect all prerequisites
export function getAllPrerequisites(concept: string): string[] {
  const visited = new Set<string>();
  const result: string[] = [];

  function dfs(node: string) {
    if (visited.has(node)) return;
    visited.add(node);

    const prereqs = prereqMap[node] || [];
    for (const pre of prereqs) {
      dfs(pre);
      result.push(pre); // Add only after children → post-order
    }
  }

  dfs(concept);

  // Remove duplicates and reverse for earlier concepts first
  return [...new Set(result.reverse())];
}
