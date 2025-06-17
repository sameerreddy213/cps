#Developed by Arka Mukherjee

import tkinter as tk
from tkinter import ttk, scrolledtext, messagebox, filedialog
import pandas as pd
import lmstudio as lms
import ast
import threading
from datetime import datetime

class PrerequisiteDetectorGUI:
    def __init__(self, root):
        self.root = root
        self.root.title("LLM-Based Prerequisite Detector")
        self.root.geometry("1200x800")
        
        # Initialize variables
        self.df = None
        self.client = None
        self.model = None
        self.current_index = 0
        self.results = {}  # Store results by question_id
        self.available_models = []
        self.is_evaluating = False
        
        # Create GUI elements
        self.create_widgets()
        self.load_models()
        
    def create_widgets(self):
        # Main frame
        main_frame = ttk.Frame(self.root, padding="10")
        main_frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # Configure grid weights for responsiveness
        self.root.columnconfigure(0, weight=1)
        self.root.rowconfigure(0, weight=1)
        main_frame.columnconfigure(1, weight=1)
        
        # Title
        title_label = ttk.Label(main_frame, text="LLM-Based Prerequisite Detector", 
                               font=("Arial", 16, "bold"))
        title_label.grid(row=0, column=0, columnspan=3, pady=(0, 20))
        
        # File selection frame
        file_frame = ttk.LabelFrame(main_frame, text="Dataset", padding="10")
        file_frame.grid(row=1, column=0, columnspan=3, sticky=(tk.W, tk.E), pady=(0, 10))
        file_frame.columnconfigure(1, weight=1)
        
        ttk.Label(file_frame, text="CSV File:").grid(row=0, column=0, sticky=tk.W)
        self.file_path_var = tk.StringVar(value="D:\\eduvlm-bench\\cps\\team-arka-eduvlmbench\\gsm8k_wrong_answers_with_missing_prerequisites.csv")
        self.file_entry = ttk.Entry(file_frame, textvariable=self.file_path_var, width=80)
        self.file_entry.grid(row=0, column=1, sticky=(tk.W, tk.E), padx=(5, 5))
        ttk.Button(file_frame, text="Browse", command=self.browse_file).grid(row=0, column=2)
        ttk.Button(file_frame, text="Load Dataset", command=self.load_dataset).grid(row=0, column=3)
        
        # Model selection frame
        model_frame = ttk.LabelFrame(main_frame, text="Model Selection", padding="10")
        model_frame.grid(row=2, column=0, columnspan=3, sticky=(tk.W, tk.E), pady=(0, 10))
        model_frame.columnconfigure(1, weight=1)
        
        ttk.Label(model_frame, text="Select Model:").grid(row=0, column=0, sticky=tk.W)
        self.model_var = tk.StringVar()
        self.model_combo = ttk.Combobox(model_frame, textvariable=self.model_var, 
                                       values=self.available_models, state="readonly", width=50)
        self.model_combo.grid(row=0, column=1, sticky=(tk.W, tk.E), padx=(5, 5))
        ttk.Button(model_frame, text="Load Model", command=self.load_selected_model).grid(row=0, column=2)
        
        # Status frame
        status_frame = ttk.Frame(main_frame)
        status_frame.grid(row=3, column=0, columnspan=3, sticky=(tk.W, tk.E), pady=(0, 10))
        status_frame.columnconfigure(1, weight=1)
        
        self.status_var = tk.StringVar(value="Ready")
        self.status_label = ttk.Label(status_frame, textvariable=self.status_var)
        self.status_label.grid(row=0, column=0, sticky=tk.W)
        
        self.progress = ttk.Progressbar(status_frame, mode='determinate')
        self.progress.grid(row=0, column=1, sticky=(tk.W, tk.E), padx=(10, 0))
        
        # Control frame
        control_frame = ttk.Frame(main_frame)
        control_frame.grid(row=4, column=0, columnspan=3, sticky=(tk.W, tk.E), pady=(0, 10))
        
        ttk.Button(control_frame, text="Previous Question", command=self.prev_question).grid(row=0, column=0, padx=(0, 5))
        ttk.Button(control_frame, text="Next Question", command=self.next_question).grid(row=0, column=1, padx=(0, 5))
        self.evaluate_btn = ttk.Button(control_frame, text="Evaluate Current Question", command=self.evaluate_current_question)
        self.evaluate_btn.grid(row=0, column=2, padx=(0, 5))
        ttk.Button(control_frame, text="Save Results", command=self.save_results).grid(row=0, column=3, padx=(0, 5))
        
        # Current question info
        info_frame = ttk.LabelFrame(main_frame, text="Current Question Info", padding="10")
        info_frame.grid(row=5, column=0, columnspan=3, sticky=(tk.W, tk.E), pady=(0, 10))
        info_frame.columnconfigure(1, weight=1)
        
        ttk.Label(info_frame, text="Question ID:").grid(row=0, column=0, sticky=tk.W)
        self.question_id_var = tk.StringVar()
        ttk.Label(info_frame, textvariable=self.question_id_var).grid(row=0, column=1, sticky=tk.W, padx=(5, 0))
        
        ttk.Label(info_frame, text="Ground Truth Missing Prerequisite:").grid(row=1, column=0, sticky=tk.W)
        self.ground_truth_var = tk.StringVar()
        ttk.Label(info_frame, textvariable=self.ground_truth_var, foreground="blue").grid(row=1, column=1, sticky=tk.W, padx=(5, 0))
        
        # Main content frame with three columns
        content_frame = ttk.Frame(main_frame)
        content_frame.grid(row=6, column=0, columnspan=3, sticky=(tk.W, tk.E, tk.N, tk.S), pady=(0, 10))
        content_frame.columnconfigure(0, weight=1)
        content_frame.columnconfigure(1, weight=1)
        content_frame.columnconfigure(2, weight=1)
        content_frame.rowconfigure(0, weight=1)
        main_frame.rowconfigure(6, weight=1)
        
        # Question column
        question_frame = ttk.LabelFrame(content_frame, text="Question", padding="10")
        question_frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S), padx=(0, 5))
        question_frame.columnconfigure(0, weight=1)
        question_frame.rowconfigure(0, weight=1)
        
        self.question_text = scrolledtext.ScrolledText(question_frame, wrap=tk.WORD, width=30, height=15)
        self.question_text.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # Wrong answer column
        wrong_answer_frame = ttk.LabelFrame(content_frame, text="Wrong Answer", padding="10")
        wrong_answer_frame.grid(row=0, column=1, sticky=(tk.W, tk.E, tk.N, tk.S), padx=(2.5, 2.5))
        wrong_answer_frame.columnconfigure(0, weight=1)
        wrong_answer_frame.rowconfigure(0, weight=1)
        
        self.wrong_answer_text = scrolledtext.ScrolledText(wrong_answer_frame, wrap=tk.WORD, width=30, height=15)
        self.wrong_answer_text.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # Results column
        results_frame = ttk.LabelFrame(content_frame, text="Evaluation Results", padding="10")
        results_frame.grid(row=0, column=2, sticky=(tk.W, tk.E, tk.N, tk.S), padx=(5, 0))
        results_frame.columnconfigure(0, weight=1)
        results_frame.rowconfigure(1, weight=1)
        
        # Ground truth display
        ground_truth_frame = ttk.Frame(results_frame)
        ground_truth_frame.grid(row=0, column=0, sticky=(tk.W, tk.E), pady=(0, 10))
        ground_truth_frame.columnconfigure(1, weight=1)
        
        ttk.Label(ground_truth_frame, text="Ground Truth:", font=("Arial", 10, "bold")).grid(row=0, column=0, sticky=tk.W)
        self.ground_truth_display = tk.Text(ground_truth_frame, height=3, wrap=tk.WORD, 
                                          bg="#e8f4f8", relief="flat", font=("Arial", 9))
        self.ground_truth_display.grid(row=1, column=0, columnspan=2, sticky=(tk.W, tk.E), pady=(5, 0))
        
        # LLM prediction display
        prediction_frame = ttk.Frame(results_frame)
        prediction_frame.grid(row=1, column=0, sticky=(tk.W, tk.E, tk.N, tk.S), pady=(10, 0))
        prediction_frame.columnconfigure(0, weight=1)
        prediction_frame.rowconfigure(1, weight=1)
        
        ttk.Label(prediction_frame, text="LLM Prediction:", font=("Arial", 10, "bold")).grid(row=0, column=0, sticky=tk.W)
        self.prediction_display = scrolledtext.ScrolledText(prediction_frame, wrap=tk.WORD, height=8,
                                                          bg="#f8f8f8", font=("Arial", 9))
        self.prediction_display.grid(row=1, column=0, sticky=(tk.W, tk.E, tk.N, tk.S), pady=(5, 0))
        
        # Evaluation result
        eval_result_frame = ttk.Frame(results_frame)
        eval_result_frame.grid(row=2, column=0, sticky=(tk.W, tk.E), pady=(10, 0))
        
        self.eval_result_var = tk.StringVar(value="Click 'Evaluate Current Question' to see prediction")
        self.eval_result_label = ttk.Label(eval_result_frame, textvariable=self.eval_result_var, 
                                         font=("Arial", 10, "bold"))
        self.eval_result_label.grid(row=0, column=0, sticky=tk.W)
        
        # Summary frame
        summary_frame = ttk.LabelFrame(main_frame, text="Evaluation Summary", padding="10")
        summary_frame.grid(row=7, column=0, columnspan=3, sticky=(tk.W, tk.E), pady=(10, 0))
        
        self.summary_var = tk.StringVar(value="No evaluation started yet")
        self.summary_label = ttk.Label(summary_frame, textvariable=self.summary_var)
        self.summary_label.grid(row=0, column=0, sticky=tk.W)
    
    def load_models(self):
        """Load available models from LM Studio"""
        try:
            self.client = lms.get_default_client()
            downloaded = lms.list_downloaded_models("llm")
            self.available_models = [model.model_key for model in downloaded]
            self.model_combo['values'] = self.available_models
            self.status_var.set(f"Found {len(self.available_models)} available models")
        except Exception as e:
            messagebox.showerror("Error", f"Failed to load models: {str(e)}")
            self.status_var.set("Error loading models")
    
    def browse_file(self):
        """Browse for CSV file"""
        filename = filedialog.askopenfilename(
            title="Select CSV file",
            filetypes=[("CSV files", "*.csv"), ("All files", "*.*")]
        )
        if filename:
            self.file_path_var.set(filename)
    
    def load_dataset(self):
        """Load the CSV dataset"""
        try:
            file_path = self.file_path_var.get()
            self.df = pd.read_csv(file_path)
            
            # Verify required columns exist
            required_columns = ['question_id', 'question', 'missing_prerequisite', 'wrong_answer']
            missing_columns = [col for col in required_columns if col not in self.df.columns]
            
            if missing_columns:
                messagebox.showerror("Error", f"Missing required columns: {missing_columns}")
                return
            
            self.current_index = 0
            self.results = {}  # Reset results dictionary
            self.status_var.set(f"Loaded dataset with {len(self.df)} questions")
            self.progress['maximum'] = len(self.df)
            self.progress['value'] = 1
            self.display_current_question()
            self.update_summary()
            
        except Exception as e:
            messagebox.showerror("Error", f"Failed to load dataset: {str(e)}")
    
    def load_selected_model(self):
        """Load the selected model"""
        if not self.model_var.get():
            messagebox.showwarning("Warning", "Please select a model first")
            return
        
        try:
            self.status_var.set("Loading model...")
            self.root.update()
            
            # Run model loading in a separate thread to prevent GUI freezing
            def load_model_thread():
                try:
                    self.model = self.client.llm.load_new_instance(self.model_var.get())
                    self.root.after(0, lambda: self.status_var.set(f"Model {self.model_var.get()} loaded successfully"))
                except Exception as e:
                    self.root.after(0, lambda: messagebox.showerror("Error", f"Failed to load model: {str(e)}"))
                    self.root.after(0, lambda: self.status_var.set("Error loading model"))
            
            threading.Thread(target=load_model_thread).start()
            
        except Exception as e:
            messagebox.showerror("Error", f"Failed to load model: {str(e)}")
    
    def display_current_question(self):
        """Display the current question and related information"""
        if self.df is None or self.current_index >= len(self.df):
            return
        
        row = self.df.iloc[self.current_index]
        
        # Update question info
        self.question_id_var.set(str(row['question_id']))
        self.ground_truth_var.set(str(row['missing_prerequisite']))
        
        # Update text areas
        self.question_text.delete(1.0, tk.END)
        self.question_text.insert(1.0, str(row['question']))
        
        self.wrong_answer_text.delete(1.0, tk.END)
        self.wrong_answer_text.insert(1.0, str(row['wrong_answer']))
        
        # Update ground truth display
        self.ground_truth_display.config(state='normal')  # Enable editing first
        self.ground_truth_display.delete(1.0, tk.END)
        self.ground_truth_display.insert(1.0, str(row['missing_prerequisite']))
        self.ground_truth_display.config(state='disabled')  # Disable after updating
        
        # Clear prediction display
        self.prediction_display.delete(1.0, tk.END)
        
        # Check if this question has been evaluated
        question_id = str(row['question_id'])
        if question_id in self.results:
            self.display_stored_result(self.results[question_id])
        else:
            self.eval_result_var.set("Click 'Evaluate Current Question' to see prediction")
            self.eval_result_label.config(foreground="black")
        
        # Update progress
        self.progress['value'] = self.current_index + 1
        self.status_var.set(f"Question {self.current_index + 1} of {len(self.df)}")
    
    def display_stored_result(self, result):
        """Display a previously computed result"""
        # Show prediction
        self.prediction_display.delete(1.0, tk.END)
        self.prediction_display.insert(1.0, result['predicted'])
        
        # Show evaluation result
        if result['is_correct']:
            self.eval_result_var.set(f"✓ CORRECT - {result['match_type']}")
            self.eval_result_label.config(foreground="green")
        else:
            self.eval_result_var.set(f"✗ INCORRECT - {result['match_type']}")
            self.eval_result_label.config(foreground="red")
    
    def create_prompt(self, question, wrong_answer, all_prerequisites):
        """Create the prompt for the LLM"""
        prompt = f"""You are an educational assessment expert. Your task is to analyze a student's wrong answer to a math word problem and identify which mathematical prerequisite skill is missing.

QUESTION:
{question}

WRONG ANSWER:
{wrong_answer}

AVAILABLE PREREQUISITES:
{all_prerequisites}

Based on the student's wrong answer, identify the ONE most critical missing prerequisite skill that led to this error. Look for:
1. Computational errors (wrong operations, calculation mistakes)
2. Conceptual misunderstandings (misinterpreting the problem)
3. Procedural errors (wrong steps or sequence)

Respond with ONLY the name of the missing prerequisite from the available list, exactly as it appears in the list. Do not provide explanations or additional text.

Missing Prerequisite:"""
        return prompt
    
    def predict_missing_prerequisite(self, question, wrong_answer, all_prerequisites):
        """Get LLM prediction for missing prerequisite"""
        if self.model is None:
            raise Exception("No model loaded")
        
        prompt = self.create_prompt(question, wrong_answer, all_prerequisites)
        
        chat = lms.Chat()
        chat.add_user_message(prompt)
        prediction = self.model.respond(chat)
        
        # Clean up the prediction
        predicted_prerequisite = prediction.content.strip()
        
        # Remove any prefixes like "Missing Prerequisite:" if present
        if ":" in predicted_prerequisite:
            predicted_prerequisite = predicted_prerequisite.split(":")[-1].strip()
        
        return predicted_prerequisite
    
    def evaluate_prediction(self, predicted, ground_truth):
        """Evaluate if the prediction matches ground truth"""
        # Normalize for comparison
        predicted_clean = predicted.lower().strip()
        ground_truth_clean = ground_truth.lower().strip()
        
        # Exact match
        if predicted_clean == ground_truth_clean:
            return True, "Exact Match"
        
        # Partial match (check if one contains the other)
        if predicted_clean in ground_truth_clean or ground_truth_clean in predicted_clean:
            return True, "Partial Match"
        
        return False, "No Match"
    
    def evaluate_current_question(self):
        """Evaluate the current question only"""
        if self.df is None:
            messagebox.showwarning("Warning", "Please load a dataset first")
            return
        
        if self.model is None:
            messagebox.showwarning("Warning", "Please load a model first")
            return
        
        if self.is_evaluating:
            messagebox.showinfo("Info", "Evaluation in progress, please wait...")
            return
        
        # Disable evaluate button and show progress
        self.evaluate_btn.config(state='disabled')
        self.is_evaluating = True
        self.status_var.set("Evaluating current question...")
        self.eval_result_var.set("Evaluating... Please wait")
        self.eval_result_label.config(foreground="orange")
        
        # Run evaluation in a separate thread
        threading.Thread(target=self.run_single_evaluation).start()
    
    def run_single_evaluation(self):
        """Run evaluation on the current question"""
        try:
            row = self.df.iloc[self.current_index]
            question_id = str(row['question_id'])
            
            # Parse all_prerequisites if it's a string representation of a list
            all_prereq = row['all_prerequisites']
            if isinstance(all_prereq, str) and all_prereq.startswith('['):
                all_prereq = ast.literal_eval(all_prereq)
            
            # Get prediction
            predicted = self.predict_missing_prerequisite(
                row['question'], 
                row['wrong_answer'], 
                all_prereq
            )
            
            # Evaluate prediction
            is_correct, match_type = self.evaluate_prediction(
                predicted, 
                row['missing_prerequisite']
            )
            
            # Store result
            result = {
                'question_id': question_id,
                'ground_truth': row['missing_prerequisite'],
                'predicted': predicted,
                'is_correct': is_correct,
                'match_type': match_type,
                'timestamp': datetime.now().isoformat()
            }
            
            self.results[question_id] = result
            
            # Update GUI in main thread
            self.root.after(0, lambda: self.single_evaluation_complete(result))
            
        except Exception as e:
            # Handle prediction errors
            error_result = {
                'question_id': str(row['question_id']),
                'ground_truth': row['missing_prerequisite'],
                'predicted': f"ERROR: {str(e)}",
                'is_correct': False,
                'match_type': "Error",
                'timestamp': datetime.now().isoformat()
            }
            
            self.results[str(row['question_id'])] = error_result
            self.root.after(0, lambda: self.single_evaluation_complete(error_result))
    
    def single_evaluation_complete(self, result):
        """Handle completion of single question evaluation"""
        self.is_evaluating = False
        self.evaluate_btn.config(state='normal')
        
        # Display the result
        self.prediction_display.delete(1.0, tk.END)
        self.prediction_display.insert(1.0, result['predicted'])
        
        # Update evaluation result
        if result['is_correct']:
            self.eval_result_var.set(f"✓ CORRECT - {result['match_type']}")
            self.eval_result_label.config(foreground="green")
        else:
            self.eval_result_var.set(f"✗ INCORRECT - {result['match_type']}")
            self.eval_result_label.config(foreground="red")
        
        # Update status
        self.status_var.set(f"Question {self.current_index + 1} evaluated - {result['match_type']}")
        
        # Update summary
        self.update_summary()
    
    def update_summary(self):
        """Update the evaluation summary"""
        if not self.results:
            self.summary_var.set("No evaluations completed yet")
            return
        
        total = len(self.results)
        correct = sum(1 for r in self.results.values() if r['is_correct'])
        accuracy = correct / total * 100 if total > 0 else 0
        
        exact_matches = sum(1 for r in self.results.values() if r['match_type'] == 'Exact Match')
        partial_matches = sum(1 for r in self.results.values() if r['match_type'] == 'Partial Match')
        errors = sum(1 for r in self.results.values() if r['match_type'] == 'Error')
        
        summary = f"Evaluated: {total}/{len(self.df)} | "
        summary += f"Accuracy: {accuracy:.1f}% ({correct}/{total}) | "
        summary += f"Exact: {exact_matches} | Partial: {partial_matches} | Errors: {errors}"
        
        self.summary_var.set(summary)
    
    def next_question(self):
        """Navigate to next question"""
        if self.df is not None and self.current_index < len(self.df) - 1:
            self.current_index += 1
            self.display_current_question()
    
    def prev_question(self):
        """Navigate to previous question"""
        if self.current_index > 0:
            self.current_index -= 1
            self.display_current_question()
    
    def save_results(self):
        """Save evaluation results to file"""
        if not self.results:
            messagebox.showwarning("Warning", "No results to save")
            return
        
        try:
            filename = filedialog.asksaveasfilename(
                title="Save Results",
                defaultextension=".csv",
                filetypes=[("CSV files", "*.csv"), ("All files", "*.*")]
            )
            
            if filename:
                results_df = pd.DataFrame.from_dict(self.results, orient='index')
                results_df.to_csv(filename, index=False)
                messagebox.showinfo("Success", f"Results saved to {filename}")
        
        except Exception as e:
            messagebox.showerror("Error", f"Failed to save results: {str(e)}")

def main():
    root = tk.Tk()
    app = PrerequisiteDetectorGUI(root)
    root.mainloop()

if __name__ == "__main__":
    main()