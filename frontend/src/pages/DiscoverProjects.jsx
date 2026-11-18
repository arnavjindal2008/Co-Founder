import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Filter,
  FolderKanban,
  Briefcase,
  Users,
  Clock,
  Plus,
  X,
  ArrowRight,
  MapPin,
} from 'lucide-react';

function DiscoverProjects() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [appliedProjects, setAppliedProjects] = useState([]);

  const projects = [
    {
      id: 1,
      title: 'CampusConnect',
      description:
        'Building a platform that connects students across universities and helps them collaborate on projects.',
      category: 'Education',
      status: 'Recruiting',
      founder: 'Aarav Sharma',
      teamSize: 4,
      requiredMembers: 2,
      skills: ['React', 'Node.js', 'PostgreSQL'],
      location: 'Remote',
      time: '2 days ago',
    },
    {
      id: 2,
      title: 'EcoTrack',
      description:
        'An application that helps people monitor their carbon footprint and make environmentally friendly choices.',
      category: 'Environment',
      status: 'Recruiting',
      founder: 'Priya Mehta',
      teamSize: 2,
      requiredMembers: 3,
      skills: ['Python', 'UI/UX', 'Data Analytics'],
      location: 'Hybrid',
      time: '3 days ago',
    },
    {
      id: 3,
      title: 'SkillBridge',
      description:
        'A student-focused platform where people can exchange skills, learn together and find mentors.',
      category: 'Technology',
      status: 'In Progress',
      founder: 'Rohan Verma',
      teamSize: 5,
      requiredMembers: 1,
      skills: ['React', 'Express', 'MongoDB'],
      location: 'Remote',
      time: '5 days ago',
    },
    {
      id: 4,
      title: 'HealthMate',
      description:
        'Creating a digital platform to make healthcare information and wellness resources easier to access.',
      category: 'Healthcare',
      status: 'Recruiting',
      founder: 'Ananya Gupta',
      teamSize: 3,
      requiredMembers: 2,
      skills: ['JavaScript', 'UI/UX', 'Marketing'],
      location: 'Remote',
      time: '1 week ago',
    },
    {
      id: 5,
      title: 'FinTrack',
      description:
        'A personal finance management tool that helps students track expenses and manage their budgets.',
      category: 'Finance',
      status: 'Recruiting',
      founder: 'Kabir Malhotra',
      teamSize: 2,
      requiredMembers: 2,
      skills: ['React', 'Node.js', 'Finance'],
      location: 'Hybrid',
      time: '1 week ago',
    },
    {
      id: 6,
      title: 'FoodShare',
      description:
        'A community platform connecting restaurants and people to reduce food waste through food sharing.',
      category: 'Social Impact',
      status: 'Recruiting',
      founder: 'Ishita Kapoor',
      teamSize: 3,
      requiredMembers: 2,
      skills: ['React', 'Marketing', 'Operations'],
      location: 'On-site',
      time: '2 weeks ago',
    },
  ];

  const categories = [
    'All',
    'Technology',
    'Education',
    'Environment',
    'Healthcare',
    'Finance',
    'Social Impact',
  ];

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(search.toLowerCase()) ||
      project.description.toLowerCase().includes(search.toLowerCase()) ||
      project.skills.some((skill) =>
        skill.toLowerCase().includes(search.toLowerCase())
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
    setAppliedProjects((previous) =>
      previous.includes(projectId)
        ? previous
        : [...previous, projectId]
    );
  }

  function clearFilters() {
    setSearch('');
    setSelectedCategory('All');
    setSelectedStatus('All');
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 lg:ml-64">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Discover Projects
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Find exciting startups and become part of something meaningful.
            </p>
          </div>

          <Link
            to="/create-project"
            className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            <Plus size={18} />
            Create Project
          </Link>
        </div>

        {/* Search */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex flex-1 items-center gap-3 rounded-xl border border-slate-200 px-4 py-3">
              <Search size={19} className="text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search projects, skills or keywords..."
                className="w-full bg-transparent text-sm outline-none"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="text-slate-400 hover:text-slate-700"
                >
                  <X size={17} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 md:w-52">
              <Filter size={18} className="text-slate-400" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full bg-transparent text-sm outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="Recruiting">Recruiting</option>
                <option value="In Progress">In Progress</option>
              </select>
            </div>
          </div>

          {/* Categories */}
          <div className="mt-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Categories
            </p>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                    selectedCategory === category
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-slate-900">
              Available Projects
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {filteredProjects.length} projects found
            </p>
          </div>

          {(search ||
            selectedCategory !== 'All' ||
            selectedStatus !== 'All') && (
            <button
              onClick={clearFilters}
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Project Cards */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            {filteredProjects.map((project) => {
              const isApplied = appliedProjects.includes(project.id);

              return (
                <div
                  key={project.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:shadow-md"
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                        <Briefcase size={23} />
                      </div>

                      <div>
                        <h3 className="font-bold text-slate-900">
                          {project.title}
                        </h3>
                        <p className="mt-1 text-xs text-slate-500">
                          Founded by {project.founder}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${
                        project.status === 'Recruiting'
                          ? 'bg-green-50 text-green-600'
                          : 'bg-blue-50 text-blue-600'
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="mt-5 text-sm leading-6 text-slate-600">
                    {project.description}
                  </p>

                  {/* Skills */}
                  <div className="mt-5">
                    <p className="mb-2 text-xs font-semibold text-slate-500">
                      Required Skills
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {project.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-600"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Project Information */}
                  <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Users size={16} />
                      {project.teamSize} team members
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Plus size={16} />
                      {project.requiredMembers} positions open
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <MapPin size={16} />
                      {project.location}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Clock size={16} />
                      {project.time}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <FolderKanban size={16} />
                      {project.category}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                    <Link
                      to="/project-details"
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      View Details
                      <ArrowRight size={16} />
                    </Link>

                    <button
                      onClick={() => handleApply(project.id)}
                      disabled={
                        isApplied || project.status !== 'Recruiting'
                      }
                      className="flex flex-1 items-center justify-center rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-green-100 disabled:text-green-700"
                    >
                      {isApplied
                        ? 'Applied'
                        : project.status !== 'Recruiting'
                          ? 'Not Recruiting'
                          : 'Apply Now'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-16 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <FolderKanban size={27} />
            </div>

            <h3 className="font-bold text-slate-900">
              No projects found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Try changing your search or filters to find more projects.
            </p>

            <button
              onClick={clearFilters}
              className="mt-5 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default DiscoverProjects;