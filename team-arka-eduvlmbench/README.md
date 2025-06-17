# EduVLM-Bench: A Multimodal Benchmark for Educational Concept Learning

## 🎯 Project Overview

**EduVLM-Bench** is a comprehensive benchmark designed to evaluate Vision-Language Models (VLMs) on educational concept prerequisite identification. The core problem we're addressing is: *When a student fails to answer a question correctly, how can we identify the missing prerequisites that will help bridge the gap from confusion to correct understanding?*

### Key Innovation
Rather than just evaluating whether models can solve problems, we focus on **diagnostic capability** - can models identify what knowledge is missing when learning breaks down?

## 🎓 Research Vision

This project aims to create a framework that can:
- **Identify Missing Prerequisites**: Given a student's wrong answer, pinpoint specific knowledge gaps
- **Generate Learning Paths**: Provide structured pathways from current understanding to mastery
- **Reduce Annotation Burden**: Use AI-generated concept taxonomies to streamline human annotation
- **Benchmark VLM Performance**: Evaluate models across different scales (2B, 4B, 7B) and architectures

## 📊 Current Progress

### ✅ Phase 1: Concept Taxonomy Building (COMPLETED)
We've successfully extracted prerequisite concepts from the first 200 questions of GSM-8K using **Gemini 1.5 Flash**.

#### Current Statistics
- **Dataset**: GSM-8K first 200 questions
- **Model Used**: Gemini 1.5 Flash
- **Output**: Comprehensive CSV of unique mathematical concepts
- **Processing**: 200/200 questions completed
- **Concepts Identified**: 171 unique mathematical concepts

#### Sample Concepts Extracted
```
Addition
Addition And Subtraction Of Integers
Addition And Subtraction Of Time
Addition Of Fractions
Addition Of Fractions With Different Denominators
Application Of Arithmetic Operations In Real-World Scenarios
Converting Units (Minutes To Hours)
Fractions (Specifically Halves)
Multi-Step Problem Solving
Multiplication
Times As Old As
Twice As Old As
```

### ✅ Phase 2: Error-Prerequisite Mapping (COMPLETED)
**Completed Task**: Generated wrong answers with targeted prerequisite gaps using Gemma-3-4B

#### Implementation Details
- **Two-Stage Process**: First identify prerequisites, then generate wrong answers by simulating missing knowledge
- **Student Simulation**: Gemma-3-4B generates realistic student errors reflecting specific conceptual gaps
- **Data Storage**: Comprehensive CSV with question_id, correct_answer, wrong_answer, missing_prerequisite mappings
- **Quality Control**: Pedagogically meaningful errors that reflect authentic student confusion patterns

#### Sample Output Structure
| question_id | question | correct_answer | all_prerequisites | missing_prerequisite | wrong_answer |
|-------------|----------|----------------|-------------------|---------------------|--------------|
| 0 | Natalia sold clips to 48 friends... | 72 clips | Addition, Multiplication, Fractions | Multiplication | Incorrect solution showing addition error |

### ✅ Phase 3: Human-in-the-Loop Validation System (COMPLETED)
**Built**: GUI-based annotation tool for systematic human evaluation

#### Features Implemented
- **Role-Based Access**: Administrator (config) and 4 annotators (arka, abhisekh, nilam, sriram)
- **Question Bank Assignment**: 50-question banks (1-50, 51-100, 101-150, 151-200)
- **Secure Authentication**: Encrypted password storage with SHA-256 hashing
- **Real-time Progress Tracking**: Individual annotation progress monitoring
- **Agreement Metrics**: Jaccard similarity, exact match, precision, recall, F1-score
- **CSV Export**: Individual and merged annotation files for analysis

### ✅ Phase 4: LLM Evaluation Framework (COMPLETED)
**Built**: End-to-end prerequisite detection evaluation system

#### System Capabilities
- **Local Model Integration**: Support for loading different LLM architectures
- **Accuracy Tracking**: Real-time performance monitoring across different models
- **Manual Vetting Interface**: GUI for expert review of model predictions
- **Comparative Analysis**: Side-by-side evaluation of human vs. machine annotations

### 🔄 Current Status: Data Collection Phase (IN PROGRESS)
**Active Task**: Collecting human annotations from 4-person annotation team

#### Deployment Details
- **Distribution Method**: Standalone executable (323MB) deployed to 4 machines
- **Security**: Encrypted configuration files, role-based access control
- **File Collection**: Manual transfer via WhatsApp to administrator
- **Merge Capability**: Automated CSV consolidation for final analysis
