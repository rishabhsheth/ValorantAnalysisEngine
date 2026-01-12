import React from 'react';
import { Link } from 'react-router-dom';
import { Users, User, BarChart3, Target, TrendingUp, Shield, Trophy } from 'lucide-react';

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
      icon: Trophy,
      title: 'Events Analytics',
      description: 'Deep statistical analysis and predictive modeling',
      link: '/events',
      color: 'from-yellow-500 to-yellow-600'
    }
  ];

  const stats = [
    { label: 'Teams Tracked', value: '90+', icon: Shield },
    { label: 'Players Analyzed', value: '500+', icon: Target },
    { label: 'Events Processed', value: '100+', icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-val-blue-500 to-gray-900 py-24 px-4 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-64 h-64 bg-val-red-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="mb-10 animate-fade-in">
            <div className="relative inline-block mb-6">
              <Target className="h-20 w-20 text-val-red-400 mx-auto drop-shadow-2xl animate-scale-in" />
              <div className="absolute inset-0 blur-xl opacity-60 bg-val-red-400 rounded-full animate-glow-pulse"></div>
            </div>
            <h1 className="text-6xl md:text-7xl font-black mb-8 animate-slide-up">
              <span className="bg-gradient-to-r from-val-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent drop-shadow-lg">
                Valorant Analysis Engine
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-medium animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Advanced analytics platform for competitive Valorant. Analyze team strategies,
              player performance, and match dynamics with professional-grade insights.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link
              to="/teams"
              className="group relative bg-gradient-to-r from-val-red-500 to-val-red-600 text-white px-10 py-5 rounded-xl font-bold text-lg overflow-hidden shadow-glow-red hover:shadow-glow-red-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-val-red-400 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Users className="h-5 w-5" />
                Explore Teams
              </span>
            </Link>
            <Link
              to="/players"
              className="group relative bg-gray-800 text-white px-10 py-5 rounded-xl font-bold text-lg border-2 border-gray-700 hover:border-blue-500 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 hover:shadow-glow-blue overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 flex items-center justify-center gap-2">
                <User className="h-5 w-5" />
                Analyze Players
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-b from-gray-900 to-gray-950 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map(({ label, value, icon: Icon }, index) => (
              <div
                key={label}
                className="relative group bg-gradient-card rounded-2xl p-8 border border-gray-800 hover:border-val-red-500/50 transition-all duration-300 hover:-translate-y-2 shadow-card hover:shadow-card-hover animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-val-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                <div className="relative z-10 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl mb-6 shadow-glow-blue group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-4xl md:text-5xl font-black text-white mb-3 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">{value}</div>
                  <div className="text-gray-400 font-semibold text-lg">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-950 py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              Powerful Analytics Features
            </h2>
            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto font-medium">
              Everything you need to understand competitive Valorant at the highest level
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map(({ icon: Icon, title, description, link, color }, index) => (
              <Link
                key={title}
                to={link}
                className="group relative bg-gradient-card rounded-2xl p-8 border border-gray-800 hover:border-gray-700 transition-all duration-300 hover:-translate-y-2 shadow-card hover:shadow-card-hover overflow-hidden animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className={`bg-gradient-to-r ${color} p-4 rounded-xl w-fit mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    <Icon className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black text-white mb-4 group-hover:text-gradient-red transition-all duration-300">
                    {title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed text-lg mb-6">{description}</p>
                  <div className="flex items-center text-val-red-400 font-bold group-hover:gap-3 gap-2 transition-all duration-300">
                    <span>Learn More</span>
                    <BarChart3 className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;