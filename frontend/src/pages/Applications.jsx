
import { useState } from 'react';
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  MapPin,
  Briefcase,
  Search,
  UserRound,
} from 'lucide-react';

import Sidebar from '../components/Sidebar';
import DashboardNavbar from '../components/DashboardNavbar';

const initialReceived = [
  {
    id: 1,
    name: 'Rahul Sharma',
    project: 'SkillBridge',
    role: 'Frontend Developer',
    location: 'Delhi, India',
    experience: 'Intermediate',
    skills: ['React', 'JavaScript', 'Tailwind CSS'],
    message:
      'I am interested in joining SkillBridge. I have experience building React applications and would love to contribute to the project.',
    date: '2 days ago',
    status: 'Pending',
    initials: 'RS',
  },
  {
    id: 2,
    name: 'Priya Mehta',
    project: 'HealthConnect',
    role: 'UI/UX Designer',
    location: 'Gurugram, India',
    experience: 'Beginner',
    skills: ['Figma', 'UI Design', 'Prototyping'],
    message:
      'I enjoy designing simple and user-friendly products. I would love to help design the HealthConnect platform.',
    date: '3 days ago',
    status: 'Pending',
    initials: 'PM',
  },
  {
    id: 3,
    name: 'Aditya Verma',
    project: 'EcoTrack',
    role: 'Backend Developer',
    location: 'Jaipur, India',
    experience: 'Intermediate',
    skills: ['Node.js', 'Express', 'PostgreSQL'],
    message:
      'I can help build the backend APIs and database structure for this project.',
    date: '5 days ago',
    status: 'Pending',
    initials: 'AV',
  },
];

const initialSent = [
  {
    id: 4,
    name: 'Aarav Sharma',
    project: 'SkillBridge',
    role: 'Frontend Developer',
    date: 'Yesterday',
    status: 'Pending',
  },
  {
    id: 5,
    name: 'Riya Kapoor',
    project: 'FinSmart',
    role: 'Full Stack Developer',
    date: '3 days ago',
    status: 'Accepted',
  },
  {
    id: 6,
    name: 'Kabir Singh',
    project: 'LocalKart',
    role: 'Marketing Member',
    date: '5 days ago',
    status: 'Rejected',
  },
];

function Applications() {
  const [activeTab, setActiveTab] = useState('received');
  const [received, setReceived] = useState(initialReceived);
  const [sent, setSent] = useState(initialSent);
  const [search, setSearch] = useState('');

  function updateReceivedStatus(id, status) {
    setReceived((previous) =>
      previous.map((application) =>
        application.id === id
          ? { ...application, status }
          : application
      )
    );
  }

  function withdrawApplication(id) {
    setSent((previous) =>
      previous.filter((application) => application.id !== id)
    );
  }

  const currentApplications =
    activeTab === 'received' ? received : sent;

  const filteredApplications = currentApplications.filter((application) => {
    const value = search.toLowerCase();

    return (
      application.name.toLowerCase().includes(value) ||
      application.project.toLowerCase().includes(value) ||
      application.role.toLowerCase().includes(value)
    );
  });

  const pendingReceived = received.filter(
    (application) => application.status === 'Pending'
  ).length;

  const acceptedSent = sent.filter(
    (application) => application.status === 'Accepted'
  ).length;

  function getStatusStyle(status) {
    if (status === 'Accepted') {
      return 'bg-green-50 text-green-700';
    }

    if (status === 'Rejected') {
      return 'bg-red-50 text-red-700';
    }

    return 'bg-amber-50 text-amber-700';
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <div className="min-h-screen lg:ml-64">
        <DashboardNavbar />

        <main className="mx-auto max-w-7xl p-5 sm:p-8">
          {/* Heading */}
          <div className="mb-7">
            <h1 className="text-2xl font-bold text-slate-900">
              Applications
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage project applications and track your opportunities.
            </p>
          </div>

          {/* Statistics */}
          <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">
                  Received Applications
                </p>
                <FileText className="text-indigo-600" size={21} />
              </div>
              <p className="mt-3 text-3xl font-bold text-slate-900">
                {received.length}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">
                  Pending Review
                </p>
                <Clock className="text-amber-600" size={21} />
              </div>
              <p className="mt-3 text-3xl font-bold text-slate-900">
                {pendingReceived}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">
                  Accepted Applications
                </p>
                <CheckCircle className="text-green-600" size={21} />
              </div>
              <p className="mt-3 text-3xl font-bold text-slate-900">
                {acceptedSent}
              </p>
            </div>
          </div>

          {/* Tabs and search */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="flex flex-col gap-4 border-b border-slate-200 p-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveTab('received')}
                  className={`rounded-xl px-4 py-2.5 text-sm font-semibold ${
                    activeTab === 'received'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Received ({received.length})
                </button>

                <button
                  onClick={() => setActiveTab('sent')}
                  className={`rounded-xl px-4 py-2.5 text-sm font-semibold ${
                    activeTab === 'sent'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  My Applications ({sent.length})
                </button>
              </div>

              <div className="relative w-full lg:max-w-xs">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search applications..."
                  className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Applications list */}
            <div className="divide-y divide-slate-100">
              {filteredApplications.length === 0 ? (
                <div className="p-12 text-center">
                  <FileText
                    size={35}
                    className="mx-auto text-slate-300"
                  />
                  <h3 className="mt-4 font-semibold text-slate-900">
                    No applications found
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Try another search or check back later.
                  </p>
                </div>
              ) : (
                filteredApplications.map((application) => (
                  <div key={application.id} className="p-5 sm:p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                      {/* Applicant avatar */}
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700">
                        {application.initials ||
                          application.name
                            .split(' ')
                            .map((part) => part[0])
                            .join('')
                            .slice(0, 2)}
                      </div>

                      {/* Application information */}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-bold text-slate-900">
                            {application.name}
                          </h3>

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(application.status)}`}
                          >
                            {application.status}
                          </span>
                        </div>

                        <p className="mt-1 text-sm text-slate-600">
                          {activeTab === 'received'
                            ? `Applied for ${application.role}`
                            : `Your application for ${application.role}`}
                        </p>

                        <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Briefcase size={14} />
                            {application.project}
                          </span>

                          {application.location && (
                            <span className="flex items-center gap-1">
                              <MapPin size={14} />
                              {application.location}
                            </span>
                          )}

                          <span className="flex items-center gap-1">
                            <Clock size={14} />
                            {application.date}
                          </span>
                        </div>

                        {activeTab === 'received' && (
                          <>
                            <p className="mt-4 text-sm leading-6 text-slate-600">
                              {application.message}
                            </p>

                            <div className="mt-3 flex flex-wrap gap-2">
                              {application.skills.map((skill) => (
                                <span
                                  key={skill}
                                  className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>

                            <p className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                              <UserRound size={14} />
                              Experience: {application.experience}
                            </p>
                          </>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex shrink-0 flex-wrap gap-2">
                        {activeTab === 'received' &&
                          application.status === 'Pending' && (
                            <>
                              <button
                                onClick={() =>
                                  updateReceivedStatus(
                                    application.id,
                                    'Accepted'
                                  )
                                }
                                className="flex items-center gap-1.5 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700"
                              >
                                <CheckCircle size={16} />
                                Accept
                              </button>

                              <button
                                onClick={() =>
                                  updateReceivedStatus(
                                    application.id,
                                    'Rejected'
                                  )
                                }
                                className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-red-50 hover:text-red-600"
                              >
                                <XCircle size={16} />
                                Reject
                              </button>
                            </>
                          )}

                        {activeTab === 'sent' &&
                          application.status === 'Pending' && (
                            <button
                              onClick={() =>
                                withdrawApplication(application.id)
                              }
                              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-red-50 hover:text-red-600"
                            >
                              Withdraw
                            </button>
                          )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default Applications;
