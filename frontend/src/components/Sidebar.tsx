import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/matches', label: 'Pertandingan', icon: '⚽' },
    { path: '/kas', label: 'Kas Grup', icon: '💰' },
    { path: '/members', label: 'Anggota', icon: '👥' },
  ];

  return (
    <div className="w-64 bg-primary-700 text-white h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-primary-600">
        <h1 className="text-2xl font-display font-bold">Match Sport</h1>
        <p className="text-primary-200 text-sm">Bot Management</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-primary-600 text-white'
                    : 'text-primary-100 hover:bg-primary-600'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-primary-600">
        <button className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors">
          🚪 Logout
        </button>
        <p className="text-primary-300 text-xs mt-4 text-center">v1.0.0</p>
      </div>
    </div>
  );
}
