import { useState } from 'react';
import {
  Bell,
  Check,
  CheckCheck,
  UserPlus,
  FolderKanban,
  MessageCircle,
  FileText,
  Trash2,
} from 'lucide-react';

import Sidebar from '../components/Sidebar';
import DashboardNavbar from '../components/DashboardNavbar';

const initialNotifications = [
  {
    id: 1,
    title: 'New connection request',
    description: 'Aarav Sharma sent you a connection request.',
    time: '10 minutes ago',
    type: 'connection',
    unread: true,
  },
  {
    id: 2,
    title: 'Application received',
    description: 'Rahul applied to join your SkillBridge project.',
    time: '1 hour ago',
    type: 'application',
    unread: true,
  },
  {
    id: 3,
    title: 'New message',
    description: 'Riya sent you a message.',
    time: '3 hours ago',
    type: 'message',
    unread: true,
  },
  {
    id: 4,
    title: 'Project update',
    description: 'Your project profile was viewed by other founders.',
    time: 'Yesterday',
    type: 'project',
    unread: false,
  },
];

function Notifications() {
  const [notifications, setNotifications] = useState(
    initialNotifications
  );

  const unreadCount = notifications.filter(
    (item) => item.unread
  ).length;

  function markAllRead() {
    setNotifications((previous) =>
      previous.map((item) => ({ ...item, unread: false }))
    );
  }

  function markRead(id) {
    setNotifications((previous) =>
      previous.map((item) =>
        item.id === id ? { ...item, unread: false } : item
      )
    );
  }

  function deleteNotification(id) {
    setNotifications((previous) =>
      previous.filter((item) => item.id !== id)
    );
  }

  function getIcon(type) {
    const icons = {
      connection: UserPlus,
      application: FileText,
      message: MessageCircle,
      project: FolderKanban,
    };

    return icons[type] || Bell;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <div className="min-h-screen lg:ml-64">
        <DashboardNavbar />

        <main className="mx-auto max-w-5xl p-5 sm:p-8">
          <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Notifications
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Stay updated with your connections and projects.
              </p>
            </div>

            <button
              onClick={markAllRead}
              disabled={unreadCount === 0}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-50"
            >
              <CheckCheck size={17} />
              Mark all as read
            </button>
          </div>

          <div className="mb-5 grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-sm text-slate-500">Total Notifications</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {notifications.length}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-sm text-slate-500">Unread</p>
              <p className="mt-2 text-3xl font-bold text-indigo-600">
                {unreadCount}
              </p>
            </div>
          </div>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="border-b border-slate-100 p-5">
              <h2 className="font-bold text-slate-900">
                Recent Notifications
              </h2>
            </div>

            {notifications.length === 0 ? (
              <div className="p-12 text-center">
                <Bell size={35} className="mx-auto text-slate-300" />
                <h3 className="mt-4 font-semibold text-slate-900">
                  You're all caught up!
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  You don't have any notifications.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {notifications.map((notification) => {
                  const Icon = getIcon(notification.type);

                  return (
                    <div
                      key={notification.id}
                      className={`flex flex-col gap-4 p-5 transition sm:flex-row sm:items-center ${
                        notification.unread ? 'bg-indigo-50/40' : ''
                      }`}
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                        <Icon size={21} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-slate-900">
                            {notification.title}
                          </h3>

                          {notification.unread && (
                            <span className="h-2 w-2 rounded-full bg-indigo-600" />
                          )}
                        </div>

                        <p className="mt-1 text-sm text-slate-600">
                          {notification.description}
                        </p>

                        <p className="mt-2 text-xs text-slate-400">
                          {notification.time}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        {notification.unread && (
                          <button
                            onClick={() => markRead(notification.id)}
                            title="Mark as read"
                            className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-white hover:text-indigo-600"
                          >
                            <Check size={17} />
                          </button>
                        )}

                        <button
                          onClick={() =>
                            deleteNotification(notification.id)
                          }
                          title="Delete notification"
                          className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

export default Notifications;