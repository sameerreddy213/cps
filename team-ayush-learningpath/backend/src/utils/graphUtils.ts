import { Graph, alg } from "graphlib";

/**
 * Finds the full path from start to end including all prerequisite concepts,
 * regardless of mastery.
 */
export function getFullLearningPath(
  graph: Graph,
  startId: string,
  endId: string
): string[] {
  // Ensure both nodes exist
  if (!graph.hasNode(startId) || !graph.hasNode(endId)) return [];

  // Run Dijkstra’s algorithm on full graph (no filtering)
  const result = alg.dijkstra(graph, startId);

  if (!result[endId] || result[endId].distance === Infinity) return [];

  // Reconstruct path from Dijkstra result
  const path: string[] = [];
  let current = endId;

  while (current !== startId && result[current]?.predecessor) {
    path.unshift(current);
    current = result[current].predecessor!;
  }

  path.unshift(startId); // Add the starting concept
  return path;
}
