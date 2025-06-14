import React, { useState, useMemo } from 'react';
import { Search, ArrowRight, Book, Code, Palette, Database, Globe, Shield, Zap, Users } from 'lucide-react';

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  tags: string[];
}

interface Topic {
  id: string;
  name: string;
  count: number;
  color: string;
}

interface FeatureHubProps {
  initialView?: 'home' | 'search' | 'topics';
  onBackToHome?: () => void;
}

const features: Feature[] = [
  {
    id: 'web-development',
    title: 'Web Development',
    description: 'Build modern web applications with cutting-edge technologies',
    icon: <Globe className="w-6 h-6" />,
    category: 'Development',
    tags: ['react', 'javascript', 'html', 'css']
  },
  {
    id: 'mobile-development',
    title: 'Mobile Development',
    description: 'Create native and cross-platform mobile applications',
    icon: <Code className="w-6 h-6" />,
    category: 'Development',
    tags: ['react-native', 'flutter', 'ios', 'android']
  },
  {
    id: 'ui-design',
    title: 'UI/UX Design',
    description: 'Design beautiful and intuitive user interfaces',
    icon: <Palette className="w-6 h-6" />,
    category: 'Design',
    tags: ['figma', 'sketch', 'design', 'prototyping']
  },
  {
    id: 'database-management',
    title: 'Database Management',
    description: 'Manage and optimize your data storage solutions',
    icon: <Database className="w-6 h-6" />,
    category: 'Backend',
    tags: ['sql', 'mongodb', 'postgresql', 'nosql']
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity',
    description: 'Protect your applications and data from threats',
    icon: <Shield className="w-6 h-6" />,
    category: 'Security',
    tags: ['encryption', 'security', 'penetration-testing', 'firewall']
  },
  {
    id: 'performance-optimization',
    title: 'Performance Optimization',
    description: 'Boost your application speed and efficiency',
    icon: <Zap className="w-6 h-6" />,
    category: 'Optimization',
    tags: ['performance', 'optimization', 'caching', 'cdn']
  },
  {
    id: 'team-collaboration',
    title: 'Team Collaboration',
    description: 'Tools and strategies for effective team workflows',
    icon: <Users className="w-6 h-6" />,
    category: 'Management',
    tags: ['agile', 'scrum', 'collaboration', 'project-management']
  },
  {
    id: 'documentation',
    title: 'Documentation',
    description: 'Create comprehensive technical documentation',
    icon: <Book className="w-6 h-6" />,
    category: 'Content',
    tags: ['markdown', 'documentation', 'api-docs', 'guides']
  }
];

const topics: Topic[] = [
  { id: 'development', name: 'Development', count: 45, color: 'bg-blue-100 text-blue-800' },
  { id: 'design', name: 'Design', count: 23, color: 'bg-purple-100 text-purple-800' },
  { id: 'backend', name: 'Backend', count: 31, color: 'bg-green-100 text-green-800' },
  { id: 'security', name: 'Security', count: 18, color: 'bg-red-100 text-red-800' },
  { id: 'optimization', name: 'Optimization', count: 12, color: 'bg-yellow-100 text-yellow-800' },
  { id: 'management', name: 'Management', count: 27, color: 'bg-indigo-100 text-indigo-800' },
  { id: 'content', name: 'Content', count: 15, color: 'bg-pink-100 text-pink-800' }
];

type Page = 'home' | 'feature' | 'search' | 'topic' | 'topics' | 'featured-tools';

const FeatureHub: React.FC<FeatureHubProps> = ({ initialView = 'home', onBackToHome }) => {
  const [currentPage, setCurrentPage] = useState<Page>(() => {
    if (initialView === 'topics') return 'topics';
    if (initialView === 'search') return 'featured-tools';
    return 'home';
  });
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(features.map(f => f.category)))];

  const filteredFeatures = useMemo(() => {
    return features.filter(feature => {
      const matchesSearch = feature.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          feature.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          feature.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || 
                            feature.category.toLowerCase() === selectedCategory.toLowerCase();
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const handleFeatureClick = (feature: Feature) => {
    setSelectedFeature(feature);
    setCurrentPage('feature');
  };

  const handleTopicClick = (topic: Topic) => {
    setSelectedTopic(topic);
    setSelectedCategory(topic.name);
    setCurrentPage('topic');
  };

  const handleSearchClick = () => {
    setCurrentPage('search');
  };

  const handleBackToFeatureHub = () => {
    setCurrentPage('home');
    setSelectedFeature(null);
    setSelectedTopic(null);
    setSearchQuery('');
    setSelectedCategory('all');
  };

  const handleBackToHome = () => {
    if (onBackToHome) {
      onBackToHome();
    } else {
      handleBackToFeatureHub();
    }
  };

  // Component definitions inside the main component
  const FeatureCard: React.FC<{ feature: Feature }> = ({ feature }) => (
    <div 
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
      onClick={() => handleFeatureClick(feature)}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
            {feature.icon}
          </div>
          <ArrowRight className="w-5 h-5 text-gray-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
        <p className="text-gray-600 mb-4">{feature.description}</p>
        <div className="flex flex-wrap gap-2">
          {feature.tags.slice(0, 3).map(tag => (
            <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-4">
          <span className="text-sm text-blue-600 font-medium">{feature.category}</span>
        </div>
      </div>
    </div>
  );

  const TopicCard: React.FC<{ topic: Topic }> = ({ topic }) => (
    <div 
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer p-4"
      onClick={() => handleTopicClick(topic)}
    >
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-gray-900">{topic.name}</h4>
          <p className="text-gray-600 text-sm">{topic.count} items</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${topic.color}`}>
          {topic.count}
        </span>
      </div>
    </div>
  );

  const HomePage = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {onBackToHome && (
                <button
                  onClick={handleBackToHome}
                  className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800"
                >
                  <ArrowRight className="w-4 h-4 rotate-180" />
                  Back to Home
                </button>
              )}
              <h1 className="text-3xl font-bold text-gray-900">Feature Hub</h1>
            </div>
            <button
              onClick={handleSearchClick}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Search className="w-4 h-4" />
              Search Features
            </button>
          </div>
          <p className="mt-2 text-gray-600">Discover amazing features and tools for your projects</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Topics Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Topic</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {topics.map(topic => (
              <TopicCard key={topic.id} topic={topic} />
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {features.map(feature => (
              <FeatureCard key={feature.id} feature={feature} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );

  // Browse by Topics Page (Personalized Learning)
  const TopicsPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={handleBackToHome}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 mb-4"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Back to Home
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Personalized Learning Topics</h1>
          <p className="mt-2 text-gray-600">Choose topics that match your interests and goals</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Topic</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map(topic => (
              <TopicCard key={topic.id} topic={topic} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );

  // Featured Tools Page (Advanced Search)
  const FeaturedToolsPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={handleBackToHome}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 mb-4"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Back to Home
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Advanced Search & Featured Tools</h1>
          <p className="mt-2 text-gray-600">Find exactly what you need with our comprehensive tools</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <section className="mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Advanced Search</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search features, tags, or descriptions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
            {searchQuery && (
              <p className="mt-4 text-gray-600">
                Found {filteredFeatures.length} result{filteredFeatures.length !== 1 ? 's' : ''} for "{searchQuery}"
              </p>
            )}
          </div>
        </section>

        {/* Featured Tools Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {(searchQuery ? filteredFeatures : features).map(feature => (
              <FeatureCard key={feature.id} feature={feature} />
            ))}
          </div>
          
          {searchQuery && filteredFeatures.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600">Try adjusting your search terms or filters</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );

  const FeaturePage = () => (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={handleBackToFeatureHub}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Back to Features
          </button>
          <div className="flex items-center gap-4">
            <div className="p-4 bg-blue-100 rounded-xl text-blue-600">
              {selectedFeature?.icon}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{selectedFeature?.title}</h1>
              <p className="text-gray-600 mt-1">{selectedFeature?.description}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About {selectedFeature?.title}</h2>
            <p className="text-gray-600 leading-relaxed">
              This is a detailed view of the {selectedFeature?.title} feature. Here you can find comprehensive 
              information, tutorials, documentation, and resources related to this topic.
            </p>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Category</h3>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {selectedFeature?.category}
            </span>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Related Tags</h3>
            <div className="flex flex-wrap gap-2">
              {selectedFeature?.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const SearchPage = () => (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={handleBackToFeatureHub}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Back to Home
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Search Features</h1>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search features, tags, or descriptions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <p className="text-gray-600">
            Found {filteredFeatures.length} result{filteredFeatures.length !== 1 ? 's' : ''}
            {searchQuery && ` for "${searchQuery}"`}
            {selectedCategory !== 'all' && ` in ${selectedCategory}`}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFeatures.map(feature => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </div>

        {filteredFeatures.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600">Try adjusting your search terms or filters</p>
          </div>
        )}
      </div>
    </div>
  );

  const TopicPage = () => (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={handleBackToFeatureHub}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Back to Topics
          </button>
          <div className="flex items-center gap-4">
            <span className={`px-4 py-2 rounded-full text-lg font-semibold ${selectedTopic?.color}`}>
              {selectedTopic?.name}
            </span>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{selectedTopic?.name} Features</h1>
              <p className="text-gray-600">{selectedTopic?.count} features in this category</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFeatures.map(feature => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </div>
      </div>
    </div>
  );

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'feature':
        return <FeaturePage />;
      case 'search':
        return <SearchPage />;
      case 'topic':
        return <TopicPage />;
      case 'topics':
        return <TopicsPage />;
      case 'featured-tools':
        return <FeaturedToolsPage />;
      default:
        return <HomePage />;
    }
  };

  return renderCurrentPage();
};

export default FeatureHub;