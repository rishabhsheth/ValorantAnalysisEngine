import React from 'react';
import { Link } from 'react-router-dom';
import { Users, User, BarChart3, Target, TrendingUp, Shield } from 'lucide-react';

const Home: React.FC = () => {
  const features = [
    {
      icon: Users,
      title: 'Team Analytics',
      description: 'Comprehensive team performance analysis and statistics',
      link: '/teams',
      color: 'from-red-500 to-red-600'
    },
    {
      icon: User,
      title: 'Player Insights',
      description: 'Individual player performance metrics and comparisons',
      link: '/players',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Deep statistical analysis and predictive modeling',
      link: '/analytics',
      color: 'from-purple-500 to-purple-600'
    }
  ];

  const stats = [
    { label: 'Teams Tracked', value: '150+', icon: Shield },
    { label: 'Players Analyzed', value: '800+', icon: Target },
    { label: 'Matches Processed', value: '10K+', icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <Target className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-red-500 via-red-400 to-blue-400 bg-clip-text text-transparent">
                Valorant Analysis Engine
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Advanced analytics platform for competitive Valorant. Analyze team strategies, 
              player performance, and match dynamics with professional-grade insights.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/teams"
              className="bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition-all transform hover:scale-105"
            >
              Explore Teams
            </Link>
            <Link
              to="/players"
              className="bg-gray-700 text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-600 transition-all transform hover:scale-105 border border-gray-600"
            >
              Analyze Players
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-800 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map(({ label, value, icon: Icon }) => (
              <div key={label} className="text-center">
                <Icon className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <div className="text-3xl font-bold text-white mb-2">{value}</div>
                <div className="text-gray-400">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-900 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Powerful Analytics Features</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Everything you need to understand competitive Valorant at the highest level
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map(({ icon: Icon, title, description, link, color }) => (
              <Link
                key={title}
                to={link}
                className="group bg-gray-800 rounded-xl p-8 hover:bg-gray-750 transition-all transform hover:scale-105 border border-gray-700 hover:border-gray-600"
              >
                <div className={`bg-gradient-to-r ${color} p-3 rounded-lg w-fit mb-6`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-red-400 transition-colors">
                  {title}
                </h3>
                <p className="text-gray-400 leading-relaxed">{description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;