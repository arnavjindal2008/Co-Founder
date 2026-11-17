import { NavLink, useNavigate } from 'react-router-dom';

import {
  LayoutDashboard,
  Users,
  FolderKanban,
  UserRound,
  MessageCircle,
  Bell,
  Settings,
  LogOut,
  Rocket,
  FileText,
} from 'lucide-react';

function Sidebar() {
  const navigate = useNavigate();

  const navigation = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Discover People',
      path: '/discover-people',
      icon: Users,
    },
    {
      name: 'Discover Projects',
      path: '/discover-projects',
      icon: FolderKanban,
    },
    {
      name: 'My Profile',
      path: '/profile',
      icon: UserRound,
    },
    {
      name: 'Connections',
      path: '/connections',
      icon: Users,
    },
    {
      name: 'Applications',
      path: '/applications',
      icon: FileText,
    },
    {
      name: 'Messages',
      path: '/messages',
      icon: MessageCircle,
    },
    {
      name: 'Notifications',
      path: '/notifications',
      icon: Bell,
    },
    {
      name: 'Manage Projects',
      path: '/manage-projects',
      icon: FolderKanban
    },
  ];

  function handleLogout() {
    navigate('/login');
  }

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col border-r border-slate-200 bg-white lg:flex">

      {/* Logo */}
      <div className="flex h-20 items-center gap-3 border-b border-slate-100 px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
          <Rocket size={22} />
        </div>

        <div>
          <h1 className="text-xl font-bold text-slate-900">
            CoFounder
          </h1>
          <p className="text-xs text-slate-400">
            Build together
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Main Menu
        </p>

        <nav className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                <Icon size={19} />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        {/* Settings */}
        <p className="mb-4 mt-9 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Preferences
        </p>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
              isActive
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`
          }
        >
          <Settings size={19} />
          Settings
        </NavLink>
      </div>

      {/* User / Logout */}
      <div className="border-t border-slate-100 p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={19} />
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;