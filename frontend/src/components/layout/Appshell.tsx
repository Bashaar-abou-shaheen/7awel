'use client';

import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex bg-gradient-to-b from-indigo-50 to-white text-gray-800">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 min-h-screen overflow-y-auto">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Wrapper to standardize spacing and card styles */}
          <div className="space-y-8">{children}</div>
        </div>
      </main>
    </div>
  );
}
