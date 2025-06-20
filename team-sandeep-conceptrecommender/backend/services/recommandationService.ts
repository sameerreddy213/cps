// author: Sai Lokesh, Mondi
import { Topic } from '../models/Topic';

interface Prerequisites {
  [key: string]: string[];
}

class RecommendationService {
  private static prerequisites: Prerequisites = {
    "Arrays": [],
    "Sorting": ["Arrays"],
    "Searching": ["Arrays", "Sorting"],
    "Hashing": ["Arrays", "Searching"],
    "LinkedLists": ["Arrays"],
    "Stacks": ["LinkedLists"],
    "Queues": ["LinkedLists"],
    "Recursion": ["Stacks"],
    "Backtracking": ["Recursion"],
    "Greedy": ["Sorting"],
    "DP": ["Recursion", "Backtracking", "Greedy"],
    "Trees": ["Recursion"],
    "BinaryTree": ["Trees"],
    "BST": ["BinaryTree"],
    "AVLTree": ["BST"],
    "RedBlackTree": ["BST"],
    "BTree": ["BinaryTree"],
    "BPlusTree": ["BTree"],
    "SegmentTree": ["Arrays", "Recursion"],
    "FenwickTree": ["Arrays"],
    "Heaps": ["Arrays"],
    "MinHeap": ["Heaps"],
    "MaxHeap": ["Heaps"],
    "Graphs": ["Trees", "DFS", "BFS", "DP"],
    "DFS": ["Graphs"],
    "BFS": ["Graphs"],
    "Dijkstra": ["Graphs", "Heaps"],
    "Kruskal": ["Graphs", "DisjointSet"],
    "Prim": ["Graphs", "Heaps"],
    "PriorityQueue": ["Heaps"],
    "Trie": ["Strings", "Hashing"],
    "Knapsack": ["DP"],
    "LCS": ["DP"],
    "SudokuSolver": ["Backtracking"],
    "TopologicalSort": ["Graphs", "DFS"],
    "BellmanFord": ["Graphs"],
    "FloydWarshall": ["Graphs"],
    "DisjointSet": ["Arrays"],
    "SlidingWindow": ["Arrays"],
    "TwoPointer": ["Arrays"],
    "PrefixSum": ["Arrays"],
    "NumberTheory": ["Math"],
    "GCD": ["NumberTheory"],
    "Sieve": ["NumberTheory"],
    "ModularExponentiation": ["NumberTheory"],
    "ChineseRemainderTheorem": ["NumberTheory"],
    "EulerTotient": ["NumberTheory"],
    "InclusionExclusion": ["NumberTheory"],
    "FastExponentiation": ["ModularExponentiation"],
    "BitManipulation": ["Arrays"],
    "DivideAndConquer": ["Recursion"],
    "MergeSort": ["DivideAndConquer"],
    "QuickSort": ["DivideAndConquer"],
    "BinarySearch": ["DivideAndConquer"],
    "ClosestPair": ["DivideAndConquer"],
    "StrassenMatrix": ["DivideAndConquer"],
    "Karatsuba": ["DivideAndConquer"],
    "BranchAndBound": ["Backtracking"],
    "NQueens": ["BranchAndBound"],
    "TSP": ["BranchAndBound"],
    "JobAssignment": ["BranchAndBound"],
    "Math": [],
    "Strings": ["Arrays"]
  };

  static async getNextTopics(knownTopics: string[]): Promise<string[]> {
    const nextTopics = new Set<string>();
    
    // For each known topic
    for (const topic of knownTopics) {
      // Find all topics that have this known topic as a prerequisite
      for (const [potentialNext, prereqs] of Object.entries(this.prerequisites)) {
        if (
          // The topic is not already known
          !knownTopics.includes(potentialNext) && 
          // All prerequisites are met
          prereqs.every(prereq => knownTopics.includes(prereq))
        ) {
          nextTopics.add(potentialNext);
        }
      }
    }

    return Array.from(nextTopics).sort();
  }

  static async generateRecommendations(userId: string, knownTopics: string[]) {
    try {
      // Get next possible topics based on prerequisites
      const nextTopics = await this.getNextTopics(knownTopics);
      
      // Get full topic details from database
      const topicDetails = await Topic.find({ name: { $in: nextTopics } });
      
      // Sort recommendations by difficulty
      const difficultyWeight = {
        'beginner': 1,
        'intermediate': 2,
        'advanced': 3
      };

      const recommendations = topicDetails.map(topic => ({
        topicId: topic._id,
        name: topic.name,
        description: topic.description,
        difficulty: topic.difficulty,
        estimatedTime: topic.estimatedTime,
        totalProblems: topic.totalProblems,
        prerequisites: topic.prerequisites,
        confidence: 0.8, // Base confidence score
        priority: topic.difficulty === 'beginner' ? 'high' : 
                 topic.difficulty === 'intermediate' ? 'medium' : 'low'
      }));

      // Sort by difficulty (easier topics first)
      recommendations.sort((a, b) => 
        difficultyWeight[a.difficulty as keyof typeof difficultyWeight] - 
        difficultyWeight[b.difficulty as keyof typeof difficultyWeight]
      );

      return recommendations;
    } catch (error) {
      console.error('Error generating recommendations:', error);
      throw error;
    }
  }
}

export default RecommendationService; 
