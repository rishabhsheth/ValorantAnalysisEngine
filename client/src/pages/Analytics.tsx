import React from 'react';
import { BarChart3, TrendingUp, PieChart, Activity } from 'lucide-react';

const Analytics: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <BarChart3 className="h-8 w-8 text-purple-500 mr-3" />
            <h1 className="text-4xl font-bold text-white">Advanced Analytics</h1>
          </div>
          <p className="text-gray-400 text-lg">
            Deep statistical analysis and predictive modeling for competitive Valorant
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center mb-4">
              <TrendingUp className="h-6 w-6 text-green-400 mr-3" />
              <h3 className="text-xl font-semibold text-white">Performance Trends</h3>
            </div>
            <p className="text-gray-400 mb-4">Track performance changes over time</p>
            <div className="bg-gray-700 rounded-lg p-4 h-32 flex items-center justify-center">
              <span className="text-gray-500">Chart Coming Soon</span>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center mb-4">
              <PieChart className="h-6 w-6 text-blue-400 mr-3" />
              <h3 className="text-xl font-semibold text-white">Agent Meta</h3>
            </div>
            <p className="text-gray-400 mb-4">Current agent pick rates and win rates</p>
            <div className="bg-gray-700 rounded-lg p-4 h-32 flex items-center justify-center">
              <span className="text-gray-500">Chart Coming Soon</span>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center mb-4">
              <Activity className="h-6 w-6 text-yellow-400 mr-3" />
              <h3 className="text-xl font-semibold text-white">Map Analytics</h3>
            </div>
            <p className="text-gray-400 mb-4">Map-specific statistics and strategies</p>
            <div className="bg-gray-700 rounded-lg p-4 h-32 flex items-center justify-center">
              <span className="text-gray-500">Chart Coming Soon</span>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-gray-800 rounded-xl p-8 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-6">Coming Soon</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Advanced Features</h3>
              <ul className="space-y-2 text-gray-400">
                <li>• Predictive match outcome modeling</li>
                <li>• Economy optimization analysis</li>
                <li>• Team composition effectiveness</li>
                <li>• Round-by-round breakdown</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Data Visualization</h3>
              <ul className="space-y-2 text-gray-400">
                <li>• Interactive performance charts</li>
                <li>• Heat maps for positioning</li>
                <li>• Timeline analysis</li>
                <li>• Comparative statistics</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;