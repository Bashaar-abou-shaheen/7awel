'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Star, Gift, Heart } from 'lucide-react';

const navItems = [
  { href: '/promotions', label: 'Promotions', icon: Gift },
  { href: '/favorites', label: 'Favorites', icon: Heart },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-screen w-64 bg-gray-50 border-r border-gray-200 flex flex-col shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-200">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-md">
          <Star className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="font-semibold text-gray-800 text-sm">7awel Rewards</div>
          <div className="text-gray-400 text-xs">Demo Dashboard</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                active
                  ? 'bg-indigo-100 text-indigo-700 font-medium shadow-inner'
                  : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'
              }`}
            >
              <Icon className={`w-5 h-5 ${active ? 'text-indigo-700' : 'text-gray-500'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-gray-200 text-xs text-gray-400">
        Built with Next.js & NestJS
      </div>
    </aside>
  );
}
