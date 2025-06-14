#!/usr/bin/env python3
"""
Enhanced Prerequisite Graph with Modern Visual Design
Optimized for smaller, more attractive graphs
"""

import ollama
import json
import networkx as nx
import numpy as np
import matplotlib
matplotlib.use('Agg')  # Use headless mode for servers
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch
import seaborn as sns

# Set style for better aesthetics
plt.style.use('seaborn-v0_8-whitegrid')
sns.set_palette("husl")

def generate_prerequisites_ollama(topic: str, model: str = "gemma:2b") -> dict:
    prompt = f"""
You are an expert curriculum designer.

List 4-5 realistic prerequisite topics that a student must know before learning "{topic}".
Keep prerequisites concise (1-3 words each) and order them from most basic to most advanced.

Return only a valid JSON like this (replace with real topics):

{{
    "main_topic": "{topic}",
    "prerequisites": [
        {{"name": "Prerequisite 1", "level": 1}},
        {{"name": "Prerequisite 2", "level": 2}},
        {{"name": "Prerequisite 3", "level": 3}},
        {{"name": "Prerequisite 4", "level": 4}}
    ]
}}

Make prerequisites realistic, concise, and ordered from basic to advanced.
"""

    try:
        response = ollama.chat(
            model=model,
            messages=[{'role': 'user', 'content': prompt}]
        )
        response_text = response['message']['content']
        
        start = response_text.find('{')
        end = response_text.rfind('}') + 1
        json_str = response_text[start:end]
        
        return json.loads(json_str)
        
    except Exception as e:
        print(f"Error: {e}")
        return {
            "main_topic": topic,
            "prerequisites": [
                {"name": "Basics", "level": 1},
                {"name": "Fundamentals", "level": 2},
                {"name": "Intermediate", "level": 3},
                {"name": "Advanced", "level": 4}
            ]
        }

def create_solid_line_graph(prereq_data: dict, layout_style: str = "hierarchical"):
    """Create a modern, compact, and visually appealing graph"""
    
    G = nx.DiGraph()
    main_topic = prereq_data['main_topic']
    prerequisites = prereq_data['prerequisites']
    
    # Add nodes
    G.add_node(main_topic, type='main')
    for prereq in prerequisites:
        G.add_node(prereq['name'], type='prerequisite', level=prereq['level'])
        G.add_edge(prereq['name'], main_topic)
    
    # Add sequential edges between prerequisites
    for i in range(1, len(prerequisites)):
        G.add_edge(prerequisites[i-1]['name'], prerequisites[i]['name'])
    
    # Create layout
    if layout_style == "hierarchical":
        pos = create_compact_hierarchical_layout(G, main_topic, prerequisites)
    else:
        pos = create_elegant_circular_layout(G, main_topic, prerequisites)
    
    # Create figure with optimal size
    fig, ax = plt.subplots(1, 1, figsize=(10, 7))
    fig.patch.set_facecolor('#f8fafc')
    ax.set_facecolor('#f8fafc')
    
    # Define modern color palette
    colors = {
        'main': '#6366f1',      # Indigo
        'prereq': '#3b82f6',    # Blue
        'edge': '#64748b',      # Slate
        'text': '#1e293b'       # Dark slate
    }
    
    # Draw edges with gradient effect
    prereq_nodes = [p['name'] for p in prerequisites]
    
    # Draw prerequisite sequence edges
    for i in range(len(prerequisites) - 1):
        start_node = prerequisites[i]['name']
        end_node = prerequisites[i + 1]['name']
        
        nx.draw_networkx_edges(G, pos,
                              edgelist=[(start_node, end_node)],
                              edge_color=colors['edge'],
                              arrows=True,
                              arrowsize=15,
                              arrowstyle='-|>',
                              width=2,
                              alpha=0.7,
                              connectionstyle="arc3,rad=0.1")
    
    # Draw edges from prerequisites to main topic
    main_edges = [(prereq['name'], main_topic) for prereq in prerequisites]
    nx.draw_networkx_edges(G, pos,
                          edgelist=main_edges,
                          edge_color=colors['edge'],
                          arrows=True,
                          arrowsize=18,
                          arrowstyle='-|>',
                          width=2.5,
                          alpha=0.8,
                          connectionstyle="arc3,rad=0.2")
    
    # Draw prerequisite nodes with modern styling
    nx.draw_networkx_nodes(G, pos,
                          nodelist=prereq_nodes,
                          node_color=colors['prereq'],
                          node_size=[1500 + (prereq['level'] * 100) for prereq in prerequisites],
                          edgecolors='white',
                          linewidths=2,
                          alpha=0.9)
    
    # Draw main topic node
    nx.draw_networkx_nodes(G, pos,
                          nodelist=[main_topic],
                          node_color=colors['main'],
                          node_size=2200,
                          edgecolors='white',
                          linewidths=3,
                          alpha=0.95)
    
    # Add elegant labels
    labels = {}
    for node in G.nodes():
        # Smart text wrapping for better readability
        words = node.split()
        if len(words) <= 2:
            labels[node] = node
        else:
            # Break long text into multiple lines
            mid = len(words) // 2
            labels[node] = ' '.join(words[:mid]) + '\n' + ' '.join(words[mid:])
    
    # Draw labels with better typography
    nx.draw_networkx_labels(G, pos, labels,
                           font_size=9,
                           font_weight='bold',
                           font_family='Arial',
                           font_color=colors['text'])
    
    # Add level indicators for prerequisites
    for i, prereq in enumerate(prerequisites):
        x, y = pos[prereq['name']]
        level_text = f"Level {prereq['level']}"
        ax.text(x, y - 0.3, level_text, 
               horizontalalignment='center',
               verticalalignment='center',
               fontsize=7,
               color=colors['edge'],
               alpha=0.8,
               weight='medium')
    
    # Modern title with better typography
    plt.title(f"Learning Path: {main_topic}", 
             fontsize=16, 
             fontweight='bold', 
             pad=25,
             color=colors['text'])
    
    # Add subtitle
    plt.suptitle("Prerequisites & Dependencies", 
                fontsize=11, 
                color=colors['edge'],
                y=0.02)
    
    # Create modern legend
    from matplotlib.patches import Patch
    from matplotlib.lines import Line2D
    
    legend_elements = [
        Patch(facecolor=colors['prereq'], edgecolor='white', linewidth=2, 
              label='Prerequisites'),
        Patch(facecolor=colors['main'], edgecolor='white', linewidth=2, 
              label='Target Topic'),
        Line2D([0], [0], color=colors['edge'], linewidth=2.5, 
               label='Learning Flow')
    ]
    
    plt.legend(handles=legend_elements, 
              loc='upper right', 
              fontsize=9,
              frameon=True,
              fancybox=True,
              shadow=True,
              framealpha=0.9)
    
    # Remove axes and improve layout
    ax.set_axis_off()
    plt.tight_layout()
    
    # Add subtle grid for better visual structure
    ax.grid(True, alpha=0.1, linestyle='-', linewidth=0.5)
    
    return G

def create_compact_hierarchical_layout(G, main_topic, prerequisites):
    """Create a compact hierarchical layout optimized for readability"""
    pos = {}
    max_level = len(prerequisites)
    
    # Arrange prerequisites in a more compact hierarchy
    for i, prereq in enumerate(prerequisites):
        level = prereq['level']
        # Reduce horizontal spacing for compactness
        x = (level - (max_level + 1) / 2) * 1.5
        # Adjust vertical spacing
        y = level * 1.2
        pos[prereq['name']] = (x, y)
    
    # Position main topic at the top
    pos[main_topic] = (0, max_level * 1.2 + 1.5)
    
    return pos

def create_elegant_circular_layout(G, main_topic, prerequisites):
    """Create an elegant circular layout with the main topic at center"""
    pos = {}
    n = len(prerequisites)
    
    # Arrange prerequisites in a circle
    for i, prereq in enumerate(prerequisites):
        angle = 2 * np.pi * i / n - np.pi/2  # Start from top
        radius = 2.5  # Reduced radius for compactness
        x = radius * np.cos(angle)
        y = radius * np.sin(angle)
        pos[prereq['name']] = (x, y)
    
    # Main topic at center
    pos[main_topic] = (0, 0)
    
    return pos

def main():
    """Main function for testing"""
    print("=== 🎓 Enhanced Prerequisite Graph Generator ===\n")
    
    topic = input("Enter a topic/subject: ").strip()
    if not topic:
        topic = "Machine Learning"
        print(f"Using default: {topic}")
    
    model = input("Ollama model (default: gemma:2b): ").strip() or "gemma:2b"
    layout = input("Layout style (hierarchical/circular, default: hierarchical): ").strip() or "hierarchical"
    
    print(f"\nGenerating prerequisites for '{topic}' using {model}...")
    prereq_data = generate_prerequisites_ollama(topic, model)
    
    print(f"\nPrerequisites for: {prereq_data['main_topic']}")
    print("-" * 50)
    for i, prereq in enumerate(prereq_data['prerequisites'], 1):
        print(f"{i}. {prereq['name']} (Level {prereq['level']})")
    
    print(f"\nCreating {layout} graph...")
    G = create_modern_graph(prereq_data, layout)
    
    # Save data
    filename = f"{topic.replace(' ', '_').lower()}_prerequisites.json"
    with open(filename, 'w') as f:
        json.dump(prereq_data, f, indent=2)
    
    print(f"\n✅ Graph created and data saved to: {filename}")
    plt.show()

if __name__ == "__main__":
    main()
