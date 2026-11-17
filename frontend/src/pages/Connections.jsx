import { useState } from 'react';
import {
  Users,
  UserCheck,
  Clock,
  Check,
  X,
  MessageCircle,
  Search,
  MapPin,
  Briefcase,
} from 'lucide-react';

import Sidebar from '../components/Sidebar';
import DashboardNavbar from '../components/DashboardNavbar';

const initialReceived = [
  {
    id: 1,
    name: 'Aarav Sharma',
    role: 'Full Stack Developer',
    location: 'Delhi, India',
    skills: ['React', 'Node.js', 'PostgreSQL'],
    about: 'Interested in building SaaS products and early-stage startups.',
    initials: 'AS',
  },
  {
    id: 2,
    name: 'Riya Mehta',
    role: 'UI/UX Designer',
    location: 'Gurugram, India',
    skills: ['Figma', 'UI Design', 'Prototyping'],
    about: 'Looking to collaborate with founders on meaningful products.',
    initials: 'RM',
  },
  {
    id: 3,
    name: 'Kabir Verma',
    role: 'Marketing Enthusiast',
    location: 'Jaipur, India',
    skills: ['Marketing', 'Growth', 'Branding'],
    about: 'Passionate about startup growth and building communities.',
    initials: 'KV',
  },
];

const initialSent = [
  {
    id: 4,
    name: 'Ananya Singh',
    role: 'Product Designer',
    location: 'Bengaluru, India',
    skills: ['Figma', 'Product Design'],
    initials: 'AS',
  },
  {
    id: 5,
    name: 'Dev Malhotra',
    role: 'Backend Developer',
    location: 'Noida, India',
    skills: ['Node.js', 'Express', 'SQL'],
    initials: 'DM',
  },
];

const initialConnections = [
  {
    id: 6,
    name: 'Ishita Kapoor',
    role: 'Frontend Developer',
    location: 'Delhi, India',
    skills: ['React', 'JavaScript', 'Tailwind CSS'],
    initials: 'IK',
  },
  {
    id: 7,
    name: 'Reyansh Gupta',
    role: 'Startup Founder',
    location: 'Mumbai, India',
    skills: ['Leadership', 'Strategy', 'Business'],
    initials: 'RG',
  },
];

function Connections() {
  const [activeTab, setActiveTab] = useState('received');
  const [received, setReceived] = useState(initialReceived);
  const [sent, setSent] = useState(initialSent);
  const [connections, setConnections] = useState(initialConnections);
  const [search, setSearch] = useState('');

  function acceptRequest(person) {
    setReceived((previous) =>
      previous.filter((item) => item.id !== person.id)
    );

    setConnections((previous) => [person, ...previous]);
  }

  function declineRequest(id) {
    setReceived((previous) =>
      previous.filter((person) => person.id !== id)
    );
  }

  function cancelRequest(id) {
    setSent((previous) =>
      previous.filter((person) => person.id !== id)
    );
  }

  function removeConnection(id) {
    setConnections((previous) =>
      previous.filter((person) => person.id !== id)
    );
  }

  const currentList =
    activeTab === 'received'
      ? received
      : activeTab === 'sent'
        ? sent
        : connections;

  const filteredList = currentList.filter((person) => {
    const value = search.toLowerCase();

    return (
      person.name.toLowerCase().includes(value) ||
      person.role.toLowerCase().includes(value) ||
      person.skills.some((skill) => skill.toLowerCase().includes(value))
    );
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <div className="min-h-screen lg:ml-64">
        <DashboardNavbar />

        <main className="mx-auto max-w-7xl p-5 sm:p-8">
          {/* Heading */}
          <div className="mb-7">
            <h1 className="text-2xl font-bold text-slate-900">
              My Connections
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage your network and connect with people who share your vision.
            </p>
          </div>

          {/* Statistics */}
          <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">
                  Total Connections
                </p>
                <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                  <Users size={20} />
                </div>
              </div>
              <p className="mt-3 text-3xl font-bold text-slate-900">
                {connections.length}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">
                  Received Requests
                </p>
                <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                  <Clock size={20} />
                </div>
              </div>
              <p className="mt-3 text-3xl font-bold text-slate-900">
                {received.length}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">
                  Sent Requests
                </p>
                <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
                  <UserCheck size={20} />
                </div>
              </div>
              <p className="mt-3 text-3xl font-bold text-slate-900">
                {sent.length}
              </p>
            </div>
          </div>

          {/* Tabs and search */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="flex flex-col gap-4 border-b border-slate-200 p-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveTab('received')}
                  className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                    activeTab === 'received'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Received ({received.length})
                </button>

                <button
                  onClick={() => setActiveTab('sent')}
                  className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                    activeTab === 'sent'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Sent ({sent.length})
                </button>

                <button
                  onClick={() => setActiveTab('connections')}
                  className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                    activeTab === 'connections'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Connected ({connections.length})
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
                  placeholder="Search people..."
                  className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* People list */}
            <div className="divide-y divide-slate-100">
              {filteredList.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                    <Users size={25} />
                  </div>

                  <h3 className="mt-4 font-semibold text-slate-900">
                    No people found
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {search
                      ? 'Try searching with a different name or skill.'
                      : 'There are no people in this section yet.'}
                  </p>
                </div>
              ) : (
                filteredList.map((person) => (
                  <div
                    key={person.id}
                    className="flex flex-col gap-4 p-5 transition hover:bg-slate-50 sm:flex-row sm:items-center"
                  >
                    {/* Avatar */}
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-lg font-bold text-indigo-700">
                      {person.initials}
                    </div>

                    {/* Details */}
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-slate-900">
                        {person.name}
                      </h3>

                      <p className="mt-1 text-sm text-slate-600">
                        {person.role}
                      </p>

                      <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <MapPin size={13} />
                          {person.location}
                        </span>

                        <span className="flex items-center gap-1">
                          <Briefcase size={13} />
                          {person.skills.slice(0, 2).join(', ')}
                        </span>
                      </div>

                      {person.about && (
                        <p className="mt-2 text-sm text-slate-500">
                          {person.about}
                        </p>
                      )}

                      <div className="mt-3 flex flex-wrap gap-2">
                        {person.skills.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-md bg-slate-100 px-2.5 py-1 text-xs text-slate-600"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex shrink-0 flex-wrap gap-2">
                      {activeTab === 'received' && (
                        <>
                          <button
                            onClick={() => acceptRequest(person)}
                            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
                          >
                            <Check size={16} />
                            Accept
                          </button>

                          <button
                            onClick={() => declineRequest(person.id)}
                            className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100"
                          >
                            <X size={16} />
                            Decline
                          </button>
                        </>
                      )}

                      {activeTab === 'sent' && (
                        <button
                          onClick={() => cancelRequest(person.id)}
                          className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100"
                        >
                          Cancel Request
                        </button>
                      )}

                      {activeTab === 'connections' && (
                        <>
                          <button
                            onClick={() =>
                              window.location.assign('/messages')
                            }
                            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
                          >
                            <MessageCircle size={16} />
                            Message
                          </button>

                          <button
                            onClick={() => removeConnection(person.id)}
                            className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-red-50 hover:text-red-600"
                          >
                            Remove
                          </button>
                        </>
                      )}
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

export default Connections;