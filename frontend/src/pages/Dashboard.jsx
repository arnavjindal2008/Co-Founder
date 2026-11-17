import { Link } from 'react-router-dom';
import {
  Users,
  FolderKanban,
  MessageCircle,
  UserRound,
  ArrowRight,
  Plus,
  CheckCircle,
  Search
} from 'lucide-react';

import Sidebar from '../components/Sidebar';
import DashboardNavbar from '../components/DashboardNavbar';

function Dashboard() {
  const stats = [
    {
      title: 'Connections',
      value: '12',
      description: 'People in your network',
      icon: Users,
      color: 'bg-indigo-100 text-indigo-600'
    },
    {
      title: 'My Projects',
      value: '3',
      description: 'Projects you are working on',
      icon: FolderKanban,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Unread Messages',
      value: '5',
      description: 'Messages waiting for you',
      icon: MessageCircle,
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Profile Completion',
      value: '65%',
      description: 'Complete your profile',
      icon: UserRound,
      color: 'bg-orange-100 text-orange-600'
    }
  ];

  const actions = [
    {
      title: 'Find co-founders',
      description: 'Discover people with complementary skills',
      icon: Users,
      path: '/discover-people',
      color: 'bg-indigo-100 text-indigo-600'
    },
    {
      title: 'Explore projects',
      description: 'Find projects looking for team members',
      icon: FolderKanban,
      path: '/discover-projects',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Create a project',
      description: 'Share your idea and build a team',
      icon: Plus,
      path: '/create-project',
      color: 'bg-green-100 text-green-600'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">

      <Sidebar />

      <div className="min-h-screen md:ml-64">
        <DashboardNavbar />

        <main className="mx-auto max-w-7xl p-5 sm:p-8">

          {/* Welcome section */}
          <section className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <p className="mb-2 text-xs font-bold tracking-widest text-indigo-600">
                YOUR WORKSPACE
              </p>

              <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
                Welcome back! 👋
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Let's find the right people to build your next big idea.
              </p>
            </div>

            <Link
              to="/create-project"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700"
            >
              <Plus size={18} />
              Create Project
            </Link>
          </section>

          {/* Statistics */}
          <section className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.title}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className={`mb-5 grid h-11 w-11 place-items-center rounded-xl ${stat.color}`}>
                    <Icon size={22} />
                  </div>

                  <p className="text-sm text-slate-500">{stat.title}</p>
                  <h2 className="mt-1 text-3xl font-extrabold text-slate-900">
                    {stat.value}
                  </h2>
                  <p className="mt-2 text-xs text-slate-400">
                    {stat.description}
                  </p>
                </div>
              );
            })}
          </section>

          {/* Profile and quick actions */}
          <section className="mb-8 grid gap-6 lg:grid-cols-2">

            {/* Profile completion */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Complete your profile
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Help others understand what you bring to a team.
                  </p>
                </div>

                <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                  <UserRound size={23} />
                </div>
              </div>

              <div className="mt-7 flex items-center justify-between text-sm">
                <span className="text-slate-500">Profile progress</span>
                <span className="font-bold text-indigo-600">65%</span>
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-indigo-50">
                <div className="h-full w-[65%] rounded-full bg-indigo-600"></div>
              </div>

              <div className="mt-6 space-y-4 text-sm">
                <p className="flex items-center gap-3 text-slate-600">
                  <CheckCircle size={18} className="text-green-500" />
                  Basic information added
                </p>

                <p className="flex items-center gap-3 text-slate-600">
                  <CheckCircle size={18} className="text-green-500" />
                  Email address added
                </p>

                <p className="flex items-center gap-3 text-slate-500">
                  <span className="h-4 w-4 rounded-full border-2 border-slate-300"></span>
                  Add your skills
                </p>

                <p className="flex items-center gap-3 text-slate-500">
                  <span className="h-4 w-4 rounded-full border-2 border-slate-300"></span>
                  Add your interests
                </p>

                <p className="flex items-center gap-3 text-slate-500">
                  <span className="h-4 w-4 rounded-full border-2 border-slate-300"></span>
                  Write your introduction
                </p>
              </div>

              <Link
                to="/profile"
                className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700"
              >
                Complete profile <ArrowRight size={17} />
              </Link>
            </div>

            {/* Quick actions */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-lg font-bold text-slate-900">
                Quick actions
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                What would you like to do today?
              </p>

              <div className="mt-5 space-y-2">
                {actions.map((action) => {
                  const Icon = action.icon;

                  return (
                    <Link
                      key={action.title}
                      to={action.path}
                      className="flex items-center gap-4 rounded-xl p-3 transition hover:bg-slate-50"
                    >
                      <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${action.color}`}>
                        <Icon size={21} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-bold text-slate-800">
                          {action.title}
                        </h3>

                        <p className="mt-1 text-xs text-slate-500">
                          {action.description}
                        </p>
                      </div>

                      <ArrowRight size={18} className="shrink-0 text-slate-400" />
                    </Link>
                  );
                })}
              </div>
            </div>

          </section>

          {/* Recent activity */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-bold text-slate-900">
              Recent activity
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Your latest updates will appear here.
            </p>

            <div className="flex min-h-44 flex-col items-center justify-center text-center">
              <div className="mb-3 rounded-full bg-indigo-50 p-4 text-indigo-600">
                <Search size={25} />
              </div>

              <p className="text-sm font-semibold text-slate-700">
                No recent activity yet
              </p>

              <p className="mt-2 text-xs text-slate-400">
                Start connecting with people to see updates here.
              </p>
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}

export default Dashboard;