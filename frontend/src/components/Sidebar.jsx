import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  UserRound,
  MessageCircle,
  Bell,
  Settings,
  LogOut,
  Rocket
} from 'lucide-react';

function Sidebar() {
  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Discover People', path: '/discover-people', icon: Users },
    { name: 'Discover Projects', path: '/discover-projects', icon: FolderKanban },
    { name: 'My Profile', path: '/profile', icon: UserRound },
    { name: 'Connections', path: '/connections', icon: Users },
    { name: 'Messages', path: '/messages', icon: MessageCircle },
    { name: 'Notifications', path: '/notifications', icon: Bell }
  ];

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-slate-200 bg-white px-4 py-6">

      <Link to="/" className="mb-10 flex items-center gap-2 px-3 text-xl font-extrabold text-indigo-600">
        <Rocket size={25} />
        CoFounder
      </Link>

      <p className="mb-3 px-3 text-xs font-bold tracking-wider text-slate-400">
        WORKSPACE
      </p>

      <nav className="flex flex-col gap-1">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'
                }`
              }
            >
              <Icon size={19} />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-slate-100 pt-5">
        <NavLink
          to="/settings"
          className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-600 hover:bg-slate-50"
        >
          <Settings size={19} />
          Settings
        </NavLink>

        <Link
          to="/login"
          className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-600 hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={19} />
          Logout
        </Link>
      </div>
    </aside>
  );
}

export default Sidebar;