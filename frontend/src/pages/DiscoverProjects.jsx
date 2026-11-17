import { useState } from 'react';
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Users,
  Clock,
  Briefcase,
  ArrowRight,
  Check,
  FolderKanban
} from 'lucide-react';

import Sidebar from '../components/Sidebar';
import DashboardNavbar from '../components/DashboardNavbar';

function DiscoverProjects() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [applications, setApplications] = useState([]);

  const projects = [
    {
      id: 1,
      title: 'AI Resume Analyzer',
      description: 'Building an AI-powered platform that analyzes resumes and provides personalized career improvement suggestions.',
      category: 'Technology',
      status: 'Looking for members',
      owner: 'Aarav Sharma',
      location: 'Remote',
      teamSize: 3,
      positions: 2,
      skills: ['React', 'Node.js', 'Machine Learning'],
      time: '2 days ago',
      color: 'bg-indigo-100 text-indigo-700',
      initials: 'AI'
    },
    {
      id: 2,
      title: 'Campus Connect',
      description: 'A platform that helps university students connect, collaborate and participate in campus activities.',
      category: 'Education',
      status: 'Looking for members',
      owner: 'Diya Mehta',
      location: 'Delhi, India',
      teamSize: 2,
      positions: 3,
      skills: ['UI/UX', 'React', 'PostgreSQL'],
      time: '3 days ago',
      color: 'bg-blue-100 text-blue-700',
      initials: 'CC'
    },
    {
      id: 3,
      title: 'EcoTrack',
      description: 'Creating a sustainability platform that helps individuals track and reduce their carbon footprint.',
      category: 'Environment',
      status: 'In progress',
      owner: 'Kabir Verma',
      location: 'Remote',
      teamSize: 4,
      positions: 1,
      skills: ['Python', 'Data Analysis', 'Design'],
      time: '5 days ago',
      color: 'bg-green-100 text-green-700',
      initials: 'ET'
    },
    {
      id: 4,
      title: 'StartupHub',
      description: 'A community platform connecting aspiring entrepreneurs with mentors, investors and potential co-founders.',
      category: 'Business',
      status: 'Looking for members',
      owner: 'Ananya Gupta',
      location: 'Bangalore, India',
      teamSize: 3,
      positions: 2,
      skills: ['Marketing', 'Business Strategy', 'React'],
      time: '1 week ago',
      color: 'bg-purple-100 text-purple-700',
      initials: 'SH'
    },
    {
      id: 5,
      title: 'FitLife',
      description: 'Developing a fitness application that helps users build healthy habits and track their daily progress.',
      category: 'Health',
      status: 'Looking for members',
      owner: 'Rohan Kapoor',
      location: 'Remote',
      teamSize: 2,
      positions: 2,
      skills: ['React Native', 'UI/UX', 'Node.js'],
      time: '1 week ago',
      color: 'bg-orange-100 text-orange-700',
      initials: 'FL'
    },
    {
      id: 6,
      title: 'Local Market',
      description: 'An online marketplace that helps local businesses reach more customers through digital storefronts.',
      category: 'Business',
      status: 'Completed',
      owner: 'Ishita Rao',
      location: 'Mumbai, India',
      teamSize: 5,
      positions: 0,
      skills: ['Marketing', 'E-commerce', 'Design'],
      time: '2 weeks ago',
      color: 'bg-pink-100 text-pink-700',
      initials: 'LM'
    }
  ];

  const categories = [
    'All',
    'Technology',
    'Education',
    'Business',
    'Environment',
    'Health'
  ];

  const statuses = [
    'All',
    'Looking for members',
    'In progress',
    'Completed'
  ];

  const filteredProjects = projects.filter((project) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      project.title.toLowerCase().includes(searchText) ||
      project.description.toLowerCase().includes(searchText) ||
      project.owner.toLowerCase().includes(searchText) ||
      project.skills.some((skill) =>
        skill.toLowerCase().includes(searchText)
      );

    const matchesCategory =
      selectedCategory === 'All' ||
      project.category === selectedCategory;

    const matchesStatus =
      selectedStatus === 'All' ||
      project.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  function handleApply(projectId) {
    setApplications((previous) => [...previous, projectId]);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <div className="min-h-screen md:ml-64">
        <DashboardNavbar />

        <main className="mx-auto max-w-7xl p-5 sm:p-8">

          {/* Heading */}
          <div className="mb-8">
            <p className="text-xs font-bold tracking-widest text-indigo-600">
              FIND YOUR NEXT OPPORTUNITY
            </p>

            <h1 className="mt-2 text-3xl font-extrabold text-slate-900">
              Discover Projects
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Explore exciting ideas and find projects that match your skills.
            </p>
          </div>

          {/* Search and filters */}
          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-5">

            <div className="grid gap-4 md:grid-cols-3">

              <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 md:col-span-1">
                <Search size={19} className="text-slate-400" />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search projects or skills..."
                  className="h-12 w-full text-sm outline-none"
                />
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4">
                <SlidersHorizontal size={18} className="text-slate-400" />

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="h-12 w-full bg-transparent text-sm outline-none"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category === 'All' ? 'All categories' : category}
                    </option>
                  ))}
                </select>
              </div>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-indigo-500"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status === 'All' ? 'All project statuses' : status}
                  </option>
                ))}
              </select>

            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-slate-500">
                Showing <span className="font-bold text-slate-800">{filteredProjects.length}</span> projects
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setSelectedCategory('All');
                  setSelectedStatus('All');
                }}
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Clear filters
              </button>
            </div>
          </section>

          {/* Project cards */}
          <section className="grid gap-6 lg:grid-cols-2">

            {filteredProjects.map((project) => {
              const isApplied = applications.includes(project.id);
              const isOpen = project.positions > 0;

              return (
                <article
                  key={project.id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  {/* Project heading */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`grid h-12 w-12 place-items-center rounded-xl text-sm font-extrabold ${project.color}`}>
                        {project.initials}
                      </div>

                      <div>
                        <h2 className="text-lg font-bold text-slate-900">
                          {project.title}
                        </h2>

                        <p className="mt-1 text-xs text-slate-500">
                          Created by {project.owner}
                        </p>
                      </div>
                    </div>

                    <span className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${
                      project.status === 'Completed'
                        ? 'bg-slate-100 text-slate-600'
                        : project.status === 'In progress'
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-green-50 text-green-700'
                    }`}>
                      {project.status}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="mt-5 text-sm leading-7 text-slate-600">
                    {project.description}
                  </p>

                  {/* Project details */}
                  <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 text-xs text-slate-500">
                    <span className="flex items-center gap-2">
                      <MapPin size={15} />
                      {project.location}
                    </span>

                    <span className="flex items-center gap-2">
                      <Users size={15} />
                      {project.teamSize} members
                    </span>

                    <span className="flex items-center gap-2">
                      <Clock size={15} />
                      {project.time}
                    </span>
                  </div>

                  {/* Required skills */}
                  <div className="mt-6">
                    <p className="mb-3 text-xs font-bold text-slate-700">
                      REQUIRED SKILLS
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {project.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Positions */}
                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-5">
                    <div>
                      <p className="text-xs text-slate-500">
                        Available positions
                      </p>

                      <p className="mt-1 text-sm font-bold text-slate-800">
                        {project.positions} open {project.positions === 1 ? 'position' : 'positions'}
                      </p>
                    </div>

                    {isOpen ? (
                      <button
                        type="button"
                        disabled={isApplied}
                        onClick={() => handleApply(project.id)}
                        className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition ${
                          isApplied
                            ? 'cursor-not-allowed bg-green-50 text-green-700'
                            : 'bg-indigo-600 text-white hover:bg-indigo-700'
                        }`}
                      >
                        {isApplied ? (
                          <>
                            <Check size={17} />
                            Applied
                          </>
                        ) : (
                          <>
                            Apply Now
                            <ArrowRight size={17} />
                          </>
                        )}
                      </button>
                    ) : (
                      <span className="rounded-xl bg-slate-100 px-4 py-3 text-xs font-semibold text-slate-500">
                        Not accepting applications
                      </span>
                    )}
                  </div>
                </article>
              );
            })}

          </section>

          {/* No results */}
          {filteredProjects.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
              <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-slate-100 text-slate-500">
                <FolderKanban size={25} />
              </div>

              <h3 className="font-bold text-slate-800">
                No projects found
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Try changing your search or filters.
              </p>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

export default DiscoverProjects;