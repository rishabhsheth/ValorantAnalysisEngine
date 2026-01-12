import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Target, Users, User, BarChart3, Home, Trophy } from 'lucide-react';

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);

  const menuItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/teams', label: 'Teams', icon: Users },
    { path: '/players', label: 'Players', icon: User },
    { path: '/events', label: 'Events', icon: Trophy },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-gray-900/95 backdrop-blur-md border-b border-gray-800 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2 group">
              <Target className="h-8 w-8 text-val-red-400 group-hover:text-val-red-300 transition-colors duration-300" />
              <span className="text-xl font-bold bg-gradient-to-r from-val-red-400 via-red-400 to-orange-400 bg-clip-text text-transparent group-hover:from-val-red-300 group-hover:via-red-300 group-hover:to-orange-300 transition-all duration-300">
                Valorant Analysis Engine
              </span>
            </Link>

            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-all duration-300"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            <div className="hidden md:flex items-center space-x-2">
              {menuItems.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 relative overflow-hidden group ${
                    location.pathname === path
                      ? 'text-white bg-gradient-to-r from-val-red-500 to-val-red-600'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  {location.pathname !== path && (
                    <div className="absolute inset-0 bg-gradient-to-r from-val-red-500/10 to-val-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  )}
                  <Icon className="h-4 w-4 relative z-10" />
                  <span className="relative z-10">{label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={toggleMenu} />
        <div className={`absolute top-16 left-0 right-0 bg-gray-900 border-b border-gray-800 shadow-2xl transform transition-transform duration-300 ${isOpen ? 'translate-y-0' : '-translate-y-full'}`}>
          <div className="px-4 py-3 space-y-2">
            {menuItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-semibold transition-all duration-300 ${
                  location.pathname === path
                    ? 'text-white bg-gradient-to-r from-val-red-500 to-val-red-600'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;
