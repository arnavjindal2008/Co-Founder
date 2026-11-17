import { useState } from 'react';
import {
  Search,
  MapPin,
  Briefcase,
  Users,
  SlidersHorizontal,
  UserPlus,
  Check,
  X
} from 'lucide-react';

import Sidebar from '../components/Sidebar';
import DashboardNavbar from '../components/DashboardNavbar';

function DiscoverPeople() {
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [requests, setRequests] = useState([]);

  const people = [
    {
      id: 1,
      name: 'Aarav Sharma',
      role: 'Software Developer',
      location: 'Delhi, India',
      experience: '2 years experience',
      skills: ['React', 'Node.js', 'PostgreSQL'],
      interests: ['Startups', 'Technology'],
      initials: 'AS',
      color: 'bg-indigo-100 text-indigo-700'
    },
    {
      id: 2,
      name: 'Diya Mehta',
      role: 'UI/UX Designer',
      location: 'Mumbai, India',
      experience: '1 year experience',
      skills: ['Figma', 'UI Design', 'Prototyping'],
      interests: ['Design', 'Startups'],
      initials: 'DM',
      color: 'bg-pink-100 text-pink-700'
    },
    {
      id: 3,
      name: 'Kabir Verma',
      role: 'Marketing Specialist',
      location: 'Bangalore, India',
      experience: '3 years experience',
      skills: ['SEO', 'Marketing', 'Content'],
      interests: ['Business', 'Growth'],
      initials: 'KV',
      color: 'bg-green-100 text-green-700'
    },
    {
      id: 4,
      name: 'Ananya Gupta',
      role: 'Software Developer',
      location: 'Pune, India',
      experience: '2 years experience',
      skills: ['Python', 'JavaScript', 'MongoDB'],
      interests: ['AI', 'Technology'],
      initials: 'AG',
      color: 'bg-purple-100 text-purple-700'
    },
    {
      id: 5,
      name: 'Rohan Kapoor',
      role: 'Business Strategist',
      location: 'Gurugram, India',
      experience: '4 years experience',
      skills: ['Business Strategy', 'Planning', 'Research'],
      interests: ['Entrepreneurship', 'Startups'],
      initials: 'RK',
      color: 'bg-orange-100 text-orange-700'
    },
    {
      id: 6,
      name: 'Ishita Rao',
      role: 'Product Manager',
      location: 'Hyderabad, India',
      experience: '2 years experience',
      skills: ['Product Strategy', 'Agile', 'Research'],
      interests: ['Product Development', 'Technology'],
      initials: 'IR',
      color: 'bg-blue-100 text-blue-700'
    }
  ];

  const roles = [
    'All',
    'Software Developer',
    'UI/UX Designer',
    'Marketing Specialist',
    'Business Strategist',
    'Product Manager'
  ];

  const filteredPeople = people.filter((person) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      person.name.toLowerCase().includes(searchText) ||
      person.role.toLowerCase().includes(searchText) ||
      person.skills.some((skill) =>
        skill.toLowerCase().includes(searchText)
      ) ||
      person.interests.some((interest) =>
        interest.toLowerCase().includes(searchText)
      );

    const matchesRole =
      selectedRole === 'All' || person.role === selectedRole;

    return matchesSearch && matchesRole;
  });

  function handleConnect(personId) {
    setRequests((previous) => [...previous, personId]);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <div className="min-h-screen md:ml-64">
        <DashboardNavbar />

        <main className="mx-auto max-w-7xl p-5 sm:p-8">

          {/* Page heading */}
          <div className="mb-8">
            <p className="text-xs font-bold tracking-widest text-indigo-600">
              BUILD YOUR NETWORK
            </p>

            <h1 className="mt-2 text-3xl font-extrabold text-slate-900">
              Discover People
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Find talented people who can help turn your ideas into reality.
            </p>
          </div>

          {/* Search and filters */}
          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-5">

            <div className="flex flex-col gap-4 md:flex-row">
              <div className="flex flex-1 items-center gap-3 rounded-xl border border-slate-200 px-4">
                <Search size={19} className="text-slate-400" />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, skills or interests..."
                  className="h-12 w-full text-sm outline-none"
                />
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 md:w-72">
                <SlidersHorizontal size={18} className="text-slate-400" />

                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="h-12 w-full bg-transparent text-sm outline-none"
                >
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role === 'All' ? 'All professional roles' : role}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-slate-500">
                Showing <span className="font-bold text-slate-800">{filteredPeople.length}</span> people
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setSelectedRole('All');
                }}
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Clear filters
              </button>
            </div>
          </section>

          {/* People cards */}
          <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">

            {filteredPeople.map((person) => {
              const isRequested = requests.includes(person.id);

              return (
                <article
                  key={person.id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex items-start justify-between">
                    <div className={`grid h-14 w-14 place-items-center rounded-2xl text-lg font-extrabold ${person.color}`}>
                      {person.initials}
                    </div>

                    <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                      Open to connect
                    </span>
                  </div>

                  <h2 className="mt-5 text-lg font-bold text-slate-900">
                    {person.name}
                  </h2>

                  <p className="mt-1 text-sm font-medium text-indigo-600">
                    {person.role}
                  </p>

                  <div className="mt-4 space-y-2 text-xs text-slate-500">
                    <p className="flex items-center gap-2">
                      <MapPin size={15} />
                      {person.location}
                    </p>

                    <p className="flex items-center gap-2">
                      <Briefcase size={15} />
                      {person.experience}
                    </p>
                  </div>

                  <div className="mt-5">
                    <p className="mb-3 text-xs font-bold text-slate-700">
                      SKILLS
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {person.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5">
                    <p className="mb-3 text-xs font-bold text-slate-700">
                      INTERESTS
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {person.interests.map((interest) => (
                        <span
                          key={interest}
                          className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs text-slate-600"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={isRequested}
                    onClick={() => handleConnect(person.id)}
                    className={`mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition ${
                      isRequested
                        ? 'cursor-not-allowed bg-green-50 text-green-700'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  >
                    {isRequested ? (
                      <>
                        <Check size={17} />
                        Request Sent
                      </>
                    ) : (
                      <>
                        <UserPlus size={17} />
                        Connect
                      </>
                    )}
                  </button>
                </article>
              );
            })}

          </section>

          {/* Empty search result */}
          {filteredPeople.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
              <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-slate-100 text-slate-500">
                <Users size={25} />
              </div>

              <h3 className="font-bold text-slate-800">
                No people found
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Try searching with a different name, skill or role.
              </p>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

export default DiscoverPeople;