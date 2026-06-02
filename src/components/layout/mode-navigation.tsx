'use client';

import { AppMode } from '@/lib/types';
// Framer Motion temporarily disabled for debugging
// import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

type ModeConfig = Record<AppMode, {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
}>;

interface ModeNavigationProps {
  currentMode: AppMode;
  onModeChange: (mode: AppMode) => void;
  modeConfig: ModeConfig;
}

export default function ModeNavigation({
  currentMode,
  onModeChange,
  modeConfig
}: ModeNavigationProps) {
  const modes: AppMode[] = ['learning', 'building', 'facilitating', 'presenting'];

  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8 overflow-x-auto">
          {modes.map((mode) => {
            const config = modeConfig[mode];
            const isActive = currentMode === mode;
            const Icon = config.icon;

            return (
              <button
                key={mode}
                onClick={() => onModeChange(mode)}
                className={`relative flex items-center space-x-2 px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                <span>{config.title}</span>

                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}