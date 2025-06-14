import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 sm:grid-cols-4 gap-8 text-sm">
        <div>
          <h3 className="text-white font-semibold mb-3">Product</h3>
          <ul className="space-y-2">
            <li><Link to="/features">Features</Link></li>
            <li><Link to="/quiz-select">Take Quiz</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-3">Support</h3>
          <ul className="space-y-2">
            <li><Link to="/faq">FAQ</Link></li>
            <li><Link to="/guides">Guides</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-3">Company</h3>
          <ul className="space-y-2">
            <li><Link to="/about">About</Link></li>
            <li><Link to="/blog">Blog</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-3">Legal</h3>
          <ul className="space-y-2">
            <li><Link to="/privacy">Privacy</Link></li>
            <li><Link to="/terms">Terms</Link></li>
          </ul>
        </div>
      </div>
      <div className="text-center py-4 border-t border-gray-800 text-xs">
        © 2025 LearnFlow. All rights reserved.
      </div>
    </footer>
  );
};
export default Footer;