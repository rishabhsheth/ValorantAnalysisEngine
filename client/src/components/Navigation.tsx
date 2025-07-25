import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Target, Users, User, BarChart3, Settings } from 'lucide-react';

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);

  const menuItems = [
    { path: '/', label: 'Home', icon: Target },
    { path: '/teams', label: 'Teams', icon: Users },
    { path: '/players', label: 'Players', icon: User },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-gray-800/95 backdrop-blur-sm border-b border-gray-700 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <Target className="h-8 w-8 text-red-500" />
              <span className="text-xl font-bold bg-gradient-to-r from-red-500 to-blue-400 bg-clip-text text-transparent">
                Valorant Analysis Engine
              </span>
            </Link>
            
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            <div className="hidden md:flex items-center space-x-8">
              {menuItems.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === path
                      ? 'text-red-400 bg-gray-700'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        <div className="absolute inset-0 bg-black/50" onClick={toggleMenu} />
        <div className={`absolute top-16 left-0 right-0 bg-gray-800 border-b border-gray-700 transform transition-transform duration-300 ${isOpen ? 'translate-y-0' : '-translate-y-full'}`}>
          <div className="px-4 py-2 space-y-1">
            {menuItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium transition-colors ${
                  location.pathname === path
                    ? 'text-red-400 bg-gray-700'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
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