import React from 'react';
import { Settings as SettingsIcon, Database, Bell, Eye, Download } from 'lucide-react';

const Settings: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <SettingsIcon className="h-8 w-8 text-gray-400 mr-3" />
            <h1 className="text-4xl font-bold text-white">Settings</h1>
          </div>
          <p className="text-gray-400 text-lg">
            Configure your analysis preferences and data sources
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center mb-4">
              <Database className="h-6 w-6 text-blue-400 mr-3" />
              <h3 className="text-xl font-semibold text-white">Data Sources</h3>
            </div>
            <p className="text-gray-400 mb-4">Connect your data sources and APIs</p>
            <div className="space-y-3">
              <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg transition-colors text-left">
                Configure Riot Games API
              </button>
              <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg transition-colors text-left">
                Import Match Data
              </button>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center mb-4">
              <Eye className="h-6 w-6 text-green-400 mr-3" />
              <h3 className="text-xl font-semibold text-white">Display Preferences</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Dark Mode</span>
                <div className="bg-blue-600 relative inline-flex h-6 w-11 items-center rounded-full">
                  <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition"></span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Show Advanced Stats</span>
                <div className="bg-blue-600 relative inline-flex h-6 w-11 items-center rounded-full">
                  <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition"></span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center mb-4">
              <Bell className="h-6 w-6 text-yellow-400 mr-3" />
              <h3 className="text-xl font-semibold text-white">Notifications</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Match Updates</span>
                <div className="bg-gray-600 relative inline-flex h-6 w-11 items-center rounded-full">
                  <span className="translate-x-1 inline-block h-4 w-4 transform rounded-full bg-white transition"></span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Weekly Reports</span>
                <div className="bg-blue-600 relative inline-flex h-6 w-11 items-center rounded-full">
                  <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition"></span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center mb-4">
              <Download className="h-6 w-6 text-purple-400 mr-3" />
              <h3 className="text-xl font-semibold text-white">Export Options</h3>
            </div>
            <p className="text-gray-400 mb-4">Download your analysis data</p>
            <div className="space-y-3">
              <button className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors">
                Export CSV Reports
              </button>
              <button className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors ml-3">
                Generate PDF Summary
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;