import { useState } from 'react';
import {
  Search,
  Plus,
  Users,
  MapPin,
  Clock,
  ArrowRight,
  FolderKanban,
} from 'lucide-react';
import { Link } from 'react-router-dom';

import Sidebar from '../components/Sidebar';
import DashboardNavbar from '../components/DashboardNavbar';

const initialProjects = [
  {
    id: 1,
    title: 'SkillBridge',
    category: 'Education Technology',
    description:
      'A platform connecting students with mentors and real-world learning opportunities.',
    owner: 'Aarav Sharma',
    location: 'Delhi, India',
    teamSize: 3,
    stage: 'MVP',
    commitment: 'Part-time',
    skills: ['React', 'Node.js', 'PostgreSQL'],
    status: 'Open',
  },
  {
    id: 2,
    title: 'HealthConnect',
    category: 'Healthcare',
    description:
      'Making healthcare more accessible through digital health services.',
    owner: 'Riya Mehta',
    location: 'Gurugram, India',
    teamSize: 2,
    stage: 'Idea',
    commitment: 'Full-time',
    skills: ['UI/UX', 'React', 'Marketing'],
    status: 'Open',
  },
  {
    id: 3,
    title: 'EcoTrack',
    category: 'Social Impact',
    description:
      'Helping individuals track their carbon footprint and make sustainable choices.',
    owner: 'Kabir Verma',
    location: 'Mumbai, India',
    teamSize: 4,
    stage: 'Prototype',
    commitment: 'Part-time',
    skills: ['JavaScript', 'Python', 'Design'],
    status: 'Open',
  },
  {
    id: 4,
    title: 'FinSmart',
    category: 'Finance',
    description:
      'A simple financial planning platform designed for college students.',
    owner: 'Ananya Singh',
    location: 'Bengaluru, India',
    teamSize: 2,
    stage: 'Research',
    commitment: 'Flexible',
    skills: ['Finance', 'React', 'Node.js'],
    status: 'Open',
  },
  {
    id: 5,
    title: 'AI Resume Builder',
    category: 'Technology',
    description:
      'A tool that helps students create professional resumes and improve their job applications.',
    owner: 'Dev Malhotra',
    location: 'Noida, India',
    teamSize: 3,
    stage: 'MVP',
    commitment: 'Part-time',
    skills: ['AI', 'Python', 'React'],
    status: 'Open',
  },
  {
    id: 6,
    title: 'LocalKart',
    category: 'E-commerce',
    description:
      'Connecting local shop owners with customers through a simple online marketplace.',
    owner: 'Ishita Kapoor',
    location: 'Jaipur, India',
    teamSize: 5,
    stage: 'Launched',
    commitment: 'Full-time',
    skills: ['Marketing', 'Node.js', 'Business'],
    status: 'Open',
  },
];

function DiscoverProjects() {
  const [projects, setProjects] = useState(initialProjects);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All Categories');
  const [status, setStatus] = useState('All');
  const [appliedProjects, setAppliedProjects] = useState([]);

  function handleApply(id) {
    setAppliedProjects((previous) =>
      previous.includes(id) ? previous : [...previous, id]
    );
  }

  function clearFilters() {
    setSearch('');
    setCategory('All Categories');
    setStatus('All');
  }

  const filteredProjects = projects.filter((project) => {
    const searchValue = search.toLowerCase();

    const matchesSearch =
      project.title.toLowerCase().includes(searchValue) ||
      project.description.toLowerCase().includes(searchValue) ||
      project.owner.toLowerCase().includes(searchValue) ||
      project.skills.some((skill) =>
        skill.toLowerCase().includes(searchValue)
      );

    const matchesCategory =
      category === 'All Categories' || project.category === category;

    const matchesStatus =
      status === 'All' || project.status === status;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <div className="min-h-screen lg:ml-64">
        <DashboardNavbar />

        <main className="mx-auto max-w-7xl p-5 sm:p-8">

          {/* Page Heading */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Discover Projects
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Find exciting startup ideas and build something meaningful.
              </p>
            </div>

            <Link
              to="/create-project"
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              <Plus size={18} />
              Create Project
            </Link>
          </div>

          {/* Search and Filters */}
          <section className="mb-7 rounded-2xl border border-slate-200 bg-white p-5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

              <div className="relative md:col-span-1">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search projects, skills..."
                  className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-indigo-500"
                />
              </div>

              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500"
              >
                <option>All Categories</option>
                <option>Technology</option>
                <option>Education Technology</option>
                <option>Healthcare</option>
                <option>Finance</option>
                <option>E-commerce</option>
                <option>Social Impact</option>
                <option>Artificial Intelligence</option>
              </select>

              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500"
              >
                <option value="All">All Status</option>
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-slate-500">
                Showing {filteredProjects.length} projects
              </p>

              <button
                onClick={clearFilters}
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Clear Filters
              </button>
            </div>
          </section>

          {/* Project Cards */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

            {filteredProjects.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center lg:col-span-2">
                <FolderKanban
                  size={36}
                  className="mx-auto text-slate-400"
                />

                <h3 className="mt-4 font-bold text-slate-900">
                  No projects found
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Try changing your search or filters.
                </p>

                <button
                  onClick={clearFilters}
                  className="mt-4 text-sm font-semibold text-indigo-600"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg"
                >
                  {/* Card Heading */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                        <FolderKanban size={23} />
                      </div>

                      <div>
                        <h2 className="font-bold text-slate-900">
                          {project.title}
                        </h2>

                        <p className="mt-1 text-xs text-slate-500">
                          {project.category}
                        </p>
                      </div>
                    </div>

                    <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                      {project.status}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="mt-5 text-sm leading-6 text-slate-600">
                    {project.description}
                  </p>

                  {/* Project Info */}
                  <div className="mt-5 grid grid-cols-2 gap-3 border-y border-slate-100 py-4">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Users size={15} />
                      {project.teamSize} Team Members
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <MapPin size={15} />
                      {project.location}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Clock size={15} />
                      {project.commitment}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Briefcase size={15} />
                      {project.stage}
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="mt-4">
                    <p className="mb-2 text-xs font-semibold text-slate-500">
                      Required Skills
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

                  {/* Founder */}
                  <div className="mt-5 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs text-slate-400">
                        Project Founder
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        {project.owner}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Link
                        to="/project-details"
                        className="flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        Details
                        <ArrowRight size={14} />
                      </Link>

                      <button
                        onClick={() => handleApply(project.id)}
                        disabled={appliedProjects.includes(project.id)}
                        className="rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-green-600"
                      >
                        {appliedProjects.includes(project.id)
                          ? 'Applied'
                          : 'Apply Now'}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default DiscoverProjects;
