import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [courseInput, setCourseInput] = useState('');
  const [graphResult, setGraphResult] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  const placeholders = [
    'Enter course name (e.g., Data Structures)',
    'Try: Calculus II, Organic Chemistry...',
    'What course are you planning to take?',
    'e.g., Physics II, Database Systems...'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [placeholders.length]);

  const generateGraph = async () => {
    const courseName = courseInput.trim();

    if (!courseName) {
      setGraphResult(`
        <h4>⚠️ Please enter a course name</h4>
        <p>We need a course name to generate the prerequisites graph!</p>
      `);
      return;
    }

    // Show loading state
    setGraphResult(`
      <h4>🔄 Generating graph for "${courseName}"...</h4>
      <p>Analyzing course dependencies and building your visualization...</p>
      <div style="margin-top: 1rem;">
        <div style="width: 100%; height: 4px; background: #e2e8f0; border-radius: 2px; overflow: hidden;">
          <div style="width: 100%; height: 100%; background: linear-gradient(45deg, #60a5fa, #a78bfa); border-radius: 2px; animation: loading 2s ease-in-out infinite;"></div>
        </div>
      </div>
    `);

    // Simulate API call to your backend
    setTimeout(() => {
      setGraphResult(`
        <h4>✅ Prerequisites Graph for "${courseName}"</h4>
        <div style="margin: 2rem 0; padding: 2rem; background: linear-gradient(135deg, #f0f9ff, #e0f2fe); border-radius: 15px; border-left: 4px solid #60a5fa;">
          <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 1rem; align-items: center;">
            <div style="padding: 1rem; background: white; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); border: 2px solid #e0f2fe;">
              <strong>Math 101</strong><br>
              <small>Prerequisite</small>
            </div>
            <div style="font-size: 2rem; color: #60a5fa;">→</div>
            <div style="padding: 1rem; background: white; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); border: 2px solid #e0f2fe;">
              <strong>Math 201</strong><br>
              <small>Prerequisite</small>
            </div>
            <div style="font-size: 2rem; color: #60a5fa;">→</div>
            <div style="padding: 1rem; background: linear-gradient(45deg, #60a5fa, #a78bfa); color: white; border-radius: 10px; box-shadow: 0 4px 15px rgba(96, 165, 250, 0.3);">
              <strong>${courseName}</strong><br>
              <small>Target Course</small>
            </div>
          </div>
        </div>
        <p style="color: #64748b; font-style: italic;">This is a demo. Connect to your backend for real prerequisites!</p>
      `);
      setCourseInput('');
    }, 2000);
  };

  const showFullApp = () => {
    alert('🎉 This would redirect to your full prerequisites graph application!');
  };

  const showSignIn = () => {
    alert('🔐 Sign In functionality would be implemented here!');
  };

  return (
    <div className="App">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <a href="#home" className="logo">CourseMap</a>
          <ul className="nav-links">
            <li><a href="#home">Home</a></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#about">About Us</a></li>
            <li><a href="#app">Try App</a></li>
            <li><a href="#" onClick={showSignIn}>Sign In</a></li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="hero-content">
          <h1>CourseMap</h1>
          <p>Visualize your academic journey with interactive course prerequisite graphs. Plan your path to success with clarity and confidence.</p>
          <div className="cta-buttons">
            <a href="#app" className="btn btn-primary">Try the App</a>
            <a href="#features" className="btn btn-secondary">Learn More</a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="section">
        <h2>Why Choose CourseMap?</h2>
        <div className="features">
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Smart Visualization</h3>
            <p>Transform complex course relationships into intuitive, interactive graphs that make academic planning effortless and clear.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Instant Generation</h3>
            <p>Get your prerequisite graph in seconds. Simply enter your target course and watch the magic happen in real-time.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔄</div>
            <h3>Interactive Experience</h3>
            <p>Explore course dependencies with dynamic, clickable nodes that reveal detailed information and alternative pathways.</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <div className="about-content">
          <h2>About CourseMap</h2>
          <p>CourseMap was born from the frustration of navigating complex academic requirements. We understand that planning your academic journey shouldn't feel like solving a puzzle blindfolded.</p>
          <p>Our team of educators and developers created this tool to empower students with clear, visual representations of their academic pathways.</p>
        </div>
      </section>

      {/* App Preview Section */}
      <section id="app" className="app-preview">
        <h2>Try CourseMap Now</h2>
        <div className="app-container">
          <div className="app-interface">
            <h3>Generate Your Course Prerequisites Graph</h3>
            <div style={{ margin: '2rem 0' }}>
              <input 
                type="text" 
                value={courseInput}
                onChange={(e) => setCourseInput(e.target.value)}
                className="course-input" 
                placeholder={placeholders[placeholderIndex]}
                onKeyPress={(e) => e.key === 'Enter' && generateGraph()}
              />
              <button onClick={generateGraph} className="generate-btn">Generate Graph</button>
            </div>
            <div 
              className="graph-placeholder"
              dangerouslySetInnerHTML={{ 
                __html: graphResult || `
                  <h4>🎯 Ready to visualize your path?</h4>
                  <p>Enter a course name above and click "Generate Graph" to see the prerequisite chain unfold before your eyes!</p>
                `
              }}
            />
            {graphResult && (
              <button onClick={showFullApp} style={{
                marginTop: '1rem', 
                padding: '0.8rem 1.5rem', 
                background: 'linear-gradient(45deg, #60a5fa, #a78bfa)', 
                color: 'white', 
                border: 'none', 
                borderRadius: '8px', 
                cursor: 'pointer', 
                fontWeight: '600'
              }}>
                🚀 Launch Full App
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2025 CourseMap. Empowering academic success through smart visualization.</p>
        <p>Built with ❤️ for students, by students</p>
      </footer>
    </div>
  );
}

export default App;
