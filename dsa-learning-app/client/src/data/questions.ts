export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  language: string;
  difficulty: string;
}


export const questions: Question[] = [
  // Easy C++ Questions
  {
    id: 1,
    question: "What is the time complexity of accessing an element in an array by index?",
    options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
    correctAnswer: 0,
    explanation: "Array access by index is constant time O(1) as we can directly calculate the memory address.",
    language: "C++",
    difficulty: "easy"
  },
  {
    id: 2,
    question: "Which data structure follows LIFO (Last In First Out) principle?",
    options: ["Queue", "Stack", "Array", "Linked List"],
    correctAnswer: 1,
    explanation: "Stack follows LIFO principle where the last element added is the first one to be removed.",
    language: "C++",
    difficulty: "easy"
  },
{
id:3,
question:"What is the correct file extension for C++ source files?",
options:[".cp",".cpp",".c++",".ccp"],
correctAnswer:2,
explanation:"cpp is the standard extension for C++ files",
language:"C++",
difficulty:"easy"},
{
    id: 4,
    question: "Which operator is used to access members of a class using a pointer?",
    options: [".", "->", "::", "&"],
    correctAnswer: 1,
    explanation: "'->' is used to access members of a class or struct via a pointer.",
    language: "C++",
    difficulty: "easy"
  },
  {
    id: 5,
    question: "Which of the following is used to output data to the console in C++?",
    options: ["cout <<", "print()", "echo", "Console.WriteLine()"],
    correctAnswer: 0,
    explanation: "'cout <<' is used with the iostream library to display output.",
    language: "C++",
    difficulty: "easy"
  },

  // Intermediate C++ Questions
  {
    id: 6,
    question: "What is the output of: `sizeof(char)` on most systems?",
    options: ["1", "2", "4", "8"],
    correctAnswer: 0,
    explanation: "The size of a char is 1 byte on almost all platforms.",
    language: "C++",
    difficulty: "intermediate"
  },
  {
    id: 7,
    question: "Which of the following best describes a constructor?",
    options: [
      "A function that destroys an object",
      "A function that initializes an object",
      "A function that copies objects",
      "A static method"
    ],
    correctAnswer: 1,
    explanation: "Constructors initialize new objects when they are created.",
    language: "C++",
    difficulty: "intermediate"
  },
  {
    id: 8,
    question: "What is the difference between `++i` and `i++`?",
    options: [
      "`++i` returns the new value, `i++` returns the original value",
      "They are always the same",
      "`++i` is slower",
      "`i++` modifies `i`, `++i` does not"
    ],
    correctAnswer: 0,
    explanation: "`++i` increments before returning, `i++` returns then increments.",
    language: "C++",
    difficulty: "intermediate"
  },
  {
    id: 9,
    question: "Which STL container provides fast search, insert and delete operations?",
    options: ["vector", "set", "list", "queue"],
    correctAnswer: 1,
    explanation: "`set` in C++ is usually implemented as a balanced BST (like red-black tree).",
    language: "C++",
    difficulty: "intermediate"
  },
  {
    id: 10,
    question: "What does the 'new' keyword do in C++?",
    options: [
      "Defines a variable",
      "Deletes memory",
      "Dynamically allocates memory",
      "Initializes a function"
    ],
    correctAnswer: 2,
    explanation: "`new` dynamically allocates memory for an object or variable.",
    language: "C++",
    difficulty: "intermediate"
  },

  // Hard C++ Questions
  {
    id: 11,
    question: "Which feature of C++ allows the same function to behave differently based on input?",
    options: ["Inheritance", "Polymorphism", "Encapsulation", "Abstraction"],
    correctAnswer: 1,
    explanation: "Polymorphism enables different behavior for functions depending on the input types.",
    language: "C++",
    difficulty: "difficult"
  },
  {
    id: 12,
    question: "What is a virtual function in C++?",
    options: [
      "A function declared in a base class that can be overridden",
      "A function that runs in the background",
      "A function without a body",
      "A static method"
    ],
    correctAnswer: 0,
    explanation: "Virtual functions support runtime polymorphism and can be overridden in derived classes.",
    language: "C++",
    difficulty: "difficult"
  },
  {
    id: 13,
    question: "Which C++ feature allows you to use the same operator on different types?",
    options: ["Function overloading", "Operator overloading", "Templates", "Inheritance"],
    correctAnswer: 1,
    explanation: "Operator overloading allows operators to work with user-defined types.",
    language: "C++",
    difficulty: "difficult"
  },
  {
    id: 14,
    question: "What is the purpose of `std::move` in C++?",
    options: [
      "To delete an object",
      "To copy an object",
      "To perform a deep copy",
      "To enable move semantics"
    ],
    correctAnswer: 3,
    explanation: "`std::move` allows efficient transfer of resources from one object to another.",
    language: "C++",
    difficulty: "difficult"
  },
  {
    id: 15,
    question: "Which smart pointer releases the managed object when it goes out of scope?",
    options: ["shared_ptr", "auto_ptr", "unique_ptr", "raw pointer"],
    correctAnswer: 2,
    explanation: "`unique_ptr` ensures a single owner and automatically releases memory when out of scope.",
    language: "C++",
    difficulty: "difficult"
  },
   // Easy Java Questions
  {
    id: 16,
    question: "Which keyword is used to define a class in Java?",
    options: ["class", "Class", "struct", "define"],
    correctAnswer: 0,
    explanation: "In Java, the `class` keyword is used to define a class.",
    language: "Java",
    difficulty: "easy"
  },
  {
    id: 17,
    question: "Which of the following is the correct way to start the main method in Java?",
    options: [
      "public static void main(String[] args)",
      "public void main(String[] args)",
      "static void main(String args)",
      "void main()"
    ],
    correctAnswer: 0,
    explanation: "`public static void main(String[] args)` is the standard Java entry point.",
    language: "Java",
    difficulty: "easy"
  },
  {
    id: 18,
    question: "Which data type is used to store true or false values in Java?",
    options: ["bit", "bool", "boolean", "truth"],
    correctAnswer: 2,
    explanation: "The `boolean` type is used to store true or false values in Java.",
    language: "Java",
    difficulty: "easy"
  },
  {
    id: 19,
    question: "How do you declare a constant in Java?",
    options: ["const int x = 10;", "final int x = 10;", "int const x = 10;", "int x := 10;"],
    correctAnswer: 1,
    explanation: "`final` is used in Java to declare constants.",
    language: "Java",
    difficulty: "easy"
  },
  {
    id: 20,
    question: "Which symbol is used to import a package in Java?",
    options: ["import", "include", "#import", "use"],
    correctAnswer: 0,
    explanation: "The `import` keyword is used to include packages in Java.",
    language: "Java",
    difficulty: "easy"
  },

  // Intermediate Java Questions
  {
    id: 21,
    question: "What is the size of an `int` in Java?",
    options: ["2 bytes", "4 bytes", "8 bytes", "Depends on system"],
    correctAnswer: 1,
    explanation: "In Java, an `int` is always 4 bytes regardless of platform.",
    language: "Java",
    difficulty: "intermediate"
  },
  {
    id: 22,
    question: "Which Java keyword is used to inherit a class?",
    options: ["inherits", "extends", "implements", "derives"],
    correctAnswer: 1,
    explanation: "The `extends` keyword is used to inherit from a superclass in Java.",
    language: "Java",
    difficulty: "intermediate"
  },
  {
    id: 23,
    question: "Which collection allows unique elements and maintains insertion order?",
    options: ["ArrayList", "HashSet", "LinkedHashSet", "TreeSet"],
    correctAnswer: 2,
    explanation: "`LinkedHashSet` maintains insertion order and does not allow duplicates.",
    language: "Java",
    difficulty: "intermediate"
  },
  {
    id: 24,
    question: "What is method overloading in Java?",
    options: [
      "Defining multiple methods with the same name but different parameters",
      "Using the same method in multiple classes",
      "Overriding a method in a subclass",
      "Calling a method from another class"
    ],
    correctAnswer: 0,
    explanation: "Method overloading allows defining multiple methods with the same name but different signatures.",
    language: "Java",
    difficulty: "intermediate"
  },
  {
    id: 25,
    question: "What is the default value of a boolean variable in Java?",
    options: ["true", "false", "0", "null"],
    correctAnswer: 1,
    explanation: "Boolean instance variables default to `false` in Java.",
    language: "Java",
    difficulty: "intermediate"
  },

  // Hard Java Questions
  {
    id: 26,
    question: "Which of the following is not a valid Java memory area?",
    options: ["Heap", "Stack", "Code", "RAM"],
    correctAnswer: 3,
    explanation: "`RAM` is hardware, not a JVM memory area like Heap, Stack, or Code.",
    language: "Java",
    difficulty: "difficult"
  },
  {
    id: 27,
    question: "What does the `finalize()` method do in Java?",
    options: [
      "Manually frees memory",
      "Used to define constants",
      "Is called before garbage collection",
      "Initializes an object"
    ],
    correctAnswer: 2,
    explanation: "`finalize()` is called by the garbage collector before destroying an object.",
    language: "Java",
    difficulty: "difficult"
  },
  {
    id: 28,
    question: "Which feature in Java allows multiple methods with the same name in a class hierarchy?",
    options: ["Inheritance", "Method overloading", "Method overriding", "Encapsulation"],
    correctAnswer: 2,
    explanation: "Method overriding enables a subclass to provide a specific implementation of a method.",
    language: "Java",
    difficulty: "difficult"
  },
  {
    id: 29,
    question: "Which exception is thrown when dividing an integer by zero in Java?",
    options: ["ArithmeticException", "NumberFormatException", "IllegalArgumentException", "NullPointerException"],
    correctAnswer: 0,
    explanation: "`ArithmeticException` is thrown for divide-by-zero errors with integers.",
    language: "Java",
    difficulty: "difficult"
  },
  {
    id: 30,
    question: "Which interface must be implemented to create a custom thread in Java?",
    options: ["Runnable", "Callable", "Threadable", "Executor"],
    correctAnswer: 0,
    explanation: "To create a custom thread, implement the `Runnable` interface and define `run()`.",
    language: "Java",
    difficulty: "difficult"
  },

    
  // Easy JavaScript Questions
  {
    id: 31,
    question: "Which keyword is used to declare a variable in JavaScript?",
    options: ["var", "let", "const", "All of the above"],
    correctAnswer: 3,
    explanation: "`var`, `let`, and `const` are all used to declare variables in JavaScript.",
    language: "JavaScript",
    difficulty: "easy"
  },
  {
    id: 32,
    question: "What is the output of `typeof null` in JavaScript?",
    options: ["null", "object", "undefined", "string"],
    correctAnswer: 1,
    explanation: "`typeof null` returns 'object' due to a legacy bug in JavaScript.",
    language: "JavaScript",
    difficulty: "easy"
  },
  {
    id: 33,
    question: "Which symbol is used for single-line comments in JavaScript?",
    options: ["//", "/*", "#", "--"],
    correctAnswer: 0,
    explanation: "`//` is used to create single-line comments in JavaScript.",
    language: "JavaScript",
    difficulty: "easy"
  },
  {
    id: 34,
    question: "Which method converts a JSON string into a JavaScript object?",
    options: ["JSON.stringify()", "JSON.parse()", "parseJSON()", "toObject()"],
    correctAnswer: 1,
    explanation: "`JSON.parse()` is used to parse a JSON string into an object.",
    language: "JavaScript",
    difficulty: "easy"
  },
  {
    id: 35,
    question: "Which of the following is a primitive data type in JavaScript?",
    options: ["Object", "Function", "Boolean", "Array"],
    correctAnswer: 2,
    explanation: "`Boolean` is a primitive data type in JavaScript.",
    language: "JavaScript",
    difficulty: "easy"
  },

  // Intermediate JavaScript Questions
  {
    id: 36,
    question: "What is a closure in JavaScript?",
    options: [
      "A function inside an object",
      "An object inside a function",
      "A function having access to its outer function scope",
      "A function with private variables"
    ],
    correctAnswer: 2,
    explanation: "A closure gives a function access to variables from an enclosing scope.",
    language: "JavaScript",
    difficulty: "intermediate"
  },
  {
    id: 37,
    question: "What is the purpose of the `bind()` method in JavaScript?",
    options: [
      "To execute a function",
      "To create a new function with a specific `this` value",
      "To copy an object",
      "To delay a function"
    ],
    correctAnswer: 1,
    explanation: "`bind()` creates a new function with a specified `this` value.",
    language: "JavaScript",
    difficulty: "intermediate"
  },
  {
    id: 38,
    question: "Which of the following is true about `==` and `===`?",
    options: [
      "`==` compares value and type, `===` compares only value",
      "`==` compares only value, `===` compares value and type",
      "They are interchangeable",
      "Both are strict equality"
    ],
    correctAnswer: 1,
    explanation: "`==` allows type coercion, while `===` checks for both type and value.",
    language: "JavaScript",
    difficulty: "intermediate"
  },
  {
    id: 39,
    question: "What is the result of `[1,2,3] + [4,5,6]` in JavaScript?",
    options: ["[1,2,3,4,5,6]", "Error", "NaN", "1,2,34,5,6"],
    correctAnswer: 3,
    explanation: "Array addition coerces both arrays to strings, resulting in `'1,2,34,5,6'`.",
    language: "JavaScript",
    difficulty: "intermediate"
  },
  {
    id: 40,
    question: "What will `console.log(typeof NaN)` output?",
    options: ["number", "NaN", "undefined", "object"],
    correctAnswer: 0,
    explanation: "`NaN` stands for Not-a-Number, but its type is still `number` in JavaScript.",
    language: "JavaScript",
    difficulty: "intermediate"
  },

  // Hard JavaScript Questions
  {
    id: 41,
    question: "Which of the following best describes the event loop in JavaScript?",
    options: [
      "A function that handles events",
      "A queue of event handlers",
      "A concurrency model handling asynchronous tasks via the call stack and task queue",
      "A loop that repeats user events"
    ],
    correctAnswer: 2,
    explanation: "The event loop allows non-blocking asynchronous operations by using the call stack and queue.",
    language: "JavaScript",
    difficulty: "difficult"
  },
  {
    id: 42,
    question: "What is the output of `let a = (1, 2, 3); console.log(a);`?",
    options: ["1", "2", "3", "undefined"],
    correctAnswer: 2,
    explanation: "The comma operator evaluates all expressions and returns the last one, so `a = 3`.",
    language: "JavaScript",
    difficulty: "difficult"
  },
  {
    id: 43,
    question: "What does the `Object.freeze()` method do?",
    options: [
      "Makes an object immutable",
      "Freezes the properties temporarily",
      "Allows shallow copy",
      "Disables function calls"
    ],
    correctAnswer: 0,
    explanation: "`Object.freeze()` prevents modification of existing properties and addition of new ones.",
    language: "JavaScript",
    difficulty: "difficult"
  },
  {
    id: 44,
    question: "Which of the following is NOT a valid way to create an object in JavaScript?",
    options: [
      "`Object.create(null)`",
      "`{}`",
      "`new Object()`",
      "`Object()`"
    ],
    correctAnswer: 3,
    explanation: "`Object()` as a standalone function is valid but not a constructor for object creation.",
    language: "JavaScript",
    difficulty: "difficult"
  },
  {
    id: 45,
    question: "How are promises executed in the JavaScript event loop?",
    options: [
      "In the call stack",
      "In the task queue",
      "In the microtask queue after the current stack",
      "In parallel with the stack"
    ],
    correctAnswer: 2,
    explanation: "Promises are handled in the microtask queue which runs after the current call stack is empty.",
    language: "JavaScript",
    difficulty: "difficult"
  },

 
  // Easy Python Questions
  {
    id: 46,
    question: "Which of the following is the correct way to define a function in Python?",
    options: ["function myFunc():", "def myFunc():", "define myFunc():", "func myFunc():"],
    correctAnswer: 1,
    explanation: "In Python, functions are defined using the `def` keyword.",
    language: "Python",
    difficulty: "easy"
  },
  {
    id: 47,
    question: "What is the output of `len([1, 2, 3])`?",
    options: ["2", "3", "0", "None"],
    correctAnswer: 1,
    explanation: "The `len()` function returns the number of items in the list, which is 3.",
    language: "Python",
    difficulty: "easy"
  },
  {
    id: 48,
    question: "Which of these is a valid Python variable name?",
    options: ["2nd_value", "_value", "value-name", "class"],
    correctAnswer: 1,
    explanation: "Variable names can start with an underscore but not with a digit or reserved keyword.",
    language: "Python",
    difficulty: "easy"
  },
  {
    id: 49,
    question: "How do you write a comment in Python?",
    options: ["// comment", "/* comment */", "# comment", "-- comment"],
    correctAnswer: 2,
    explanation: "In Python, comments start with a `#` symbol.",
    language: "Python",
    difficulty: "easy"
  },
  {
    id: 50,
    question: "What is the output of `type(5.0)`?",
    options: ["<class 'float'>", "<class 'int'>", "<class 'double'>", "<class 'number'>"],
    correctAnswer: 0,
    explanation: "`5.0` is a floating-point number, so its type is `<class 'float'>`.",
    language: "Python",
    difficulty: "easy"
  },

  // Intermediate Python Questions
  {
    id: 51,
    question: "Which collection type does not allow duplicate elements?",
    options: ["List", "Tuple", "Set", "Dictionary"],
    correctAnswer: 2,
    explanation: "Sets in Python automatically eliminate duplicates.",
    language: "Python",
    difficulty: "intermediate"
  },
  {
    id: 52,
    question: "What will `print(''.join(['a', 'b', 'c']))` output?",
    options: ["a b c", "abc", "['a','b','c']", "None"],
    correctAnswer: 1,
    explanation: "`join()` concatenates a list of strings into a single string.",
    language: "Python",
    difficulty: "intermediate"
  },
  {
    id: 53,
    question: "What is the result of `bool([])` in Python?",
    options: ["True", "False", "Error", "None"],
    correctAnswer: 1,
    explanation: "Empty collections like `[]`, `{}`, `''` return `False` in boolean context.",
    language: "Python",
    difficulty: "intermediate"
  },
  {
    id: 54,
    question: "How do you catch exceptions in Python?",
    options: ["try/catch", "try/except", "try/catch/finally", "try/handle"],
    correctAnswer: 1,
    explanation: "`try/except` is the correct syntax for handling exceptions in Python.",
    language: "Python",
    difficulty: "intermediate"
  },
  {
    id: 55,
    question: "Which method is used to add an item to a list?",
    options: [".add()", ".insert()", ".append()", ".extend()"],
    correctAnswer: 2,
    explanation: "`append()` adds a single element to the end of a list.",
    language: "Python",
    difficulty: "intermediate"
  },

  // Hard Python Questions
  {
    id: 56,
    question: "What will be the output of the following code?\n\n```python\nx = [1, 2, 3]\ny = x\nx.append(4)\nprint(y)\n```",
    options: ["[1, 2, 3]", "[1, 2, 3, 4]", "[4]", "Error"],
    correctAnswer: 1,
    explanation: "`x` and `y` point to the same list, so modifying `x` also affects `y`.",
    language: "Python",
    difficulty: "difficult"
  },
  {
    id: 57,
    question: "What is the output of `bool('False')`?",
    options: ["False", "True", "None", "Error"],
    correctAnswer: 1,
    explanation: "Non-empty strings evaluate to `True` regardless of content.",
    language: "Python",
    difficulty: "difficult"
  },
  {
    id: 58,
    question: "What is a Python decorator?",
    options: [
      "A type of loop",
      "A design pattern for UI",
      "A function that modifies another function",
      "A comment style"
    ],
    correctAnswer: 2,
    explanation: "A decorator is a function that takes another function and extends its behavior.",
    language: "Python",
    difficulty: "difficult"
  },
  {
    id: 59,
    question: "Which of the following best describes Python's GIL (Global Interpreter Lock)?",
    options: [
      "Prevents race conditions in multi-threaded code",
      "Allows true parallel threading",
      "Only applies to Python 2",
      "Locks global variables during execution"
    ],
    correctAnswer: 0,
    explanation: "GIL prevents true multi-threading by allowing only one thread at a time in the interpreter.",
    language: "Python",
    difficulty: "difficult"
  },
  {
    id: 60,
    question: "Which of the following is a correct way to create a generator?",
    options: [
      "`yield` inside a function",
      "`return` a list",
      "Using list comprehension",
      "Calling `iter()` on a function"
    ],
    correctAnswer: 0,
    explanation: "Generators are created using the `yield` keyword inside functions.",
    language: "Python",
    difficulty: "difficult"
  }
];

export const getQuestionsByLanguageAndDifficulty = (language: string, difficulty: string): Question[] => {
  return questions.filter(q => 
    q.language.toLowerCase() === language.toLowerCase() && 
    q.difficulty.toLowerCase() === difficulty.toLowerCase()
  );};