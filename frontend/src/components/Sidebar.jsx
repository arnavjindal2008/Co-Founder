import { useState } from 'react';
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
  Menu,
  X,
} from 'lucide-react';

function Sidebar() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Discover People', path: '/discover-people', icon: Users },
    { name: 'Discover Projects', path: '/discover-projects', icon: FolderKanban },
    { name: 'My Profile', path: '/profile', icon: UserRound },
    { name: 'Connections', path: '/connections', icon: Users },
    { name: 'Manage Projects', path: '/manage-projects', icon: FolderKanban },
    { name: 'Applications', path: '/applications', icon: FileText },
    { name: 'Messages', path: '/messages', icon: MessageCircle },
    { name: 'Notifications', path: '/notifications', icon: Bell },
  ];

  function handleLogout() {
    setMobileOpen(false);
    navigate('/login');
  }

  function closeMenu() {
    setMobileOpen(false);
  }

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
      isActive
        ? 'bg-indigo-50 text-indigo-600'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`;

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col border-r border-slate-200 bg-white lg:flex">
        <div className="flex h-20 items-center gap-3 border-b border-slate-100 px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
            <Rocket size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">CoFounder</h1>
            <p className="text-xs text-slate-400">Build together</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6">
          <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Main Menu
          </p>

          <nav className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink key={item.path} to={item.path} className={linkClass}>
                  <Icon size={19} />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>

          <p className="mb-4 mt-9 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Preferences
          </p>

          <NavLink to="/settings" className={linkClass}>
            <Settings size={19} />
            Settings
          </NavLink>
        </div>

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

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed bottom-5 left-5 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 lg:hidden"
        aria-label="Open navigation menu"
      >
        <Menu size={23} />
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/40 lg:hidden"
          onClick={closeMenu}
        >
          <aside
            className="flex h-full w-72 max-w-[85vw] flex-col bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex h-20 items-center justify-between border-b border-slate-100 px-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
                  <Rocket size={22} />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900">
                    CoFounder
                  </h1>
                  <p className="text-xs text-slate-400">Build together</p>
                </div>
              </div>

              <button
                onClick={closeMenu}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                aria-label="Close navigation menu"
              >
                <X size={21} />
              </button>
            </div>

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
                      onClick={closeMenu}
                      className={linkClass}
                    >
                      <Icon size={19} />
                      {item.name}
                    </NavLink>
                  );
                })}
              </nav>

              <p className="mb-4 mt-9 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Preferences
              </p>

              <NavLink
                to="/settings"
                onClick={closeMenu}
                className={linkClass}
              >
                <Settings size={19} />
                Settings
              </NavLink>
            </div>

            <div className="border-t border-slate-100 p-4">
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600"
              >
                <LogOut size={19} />
                Logout
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

export default Sidebar;