import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Plus,
  FolderKanban,
  Users,
  CalendarDays,
  MoreVertical,
  Pencil,
  Trash2,
  Eye,
} from 'lucide-react';

function ManageProjects() {
  const { token } = useAuth();

  const [projects, setProjects] = useState([]);
  const [activeMenu, setActiveMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load projects from PostgreSQL through the backend.
  async function fetchProjects() {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('/api/projects/mine', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to load projects.');
      }

      setProjects(data.projects || []);
    } catch (err) {
      console.error('Fetch projects error:', err);
      setError(err.message || 'Unable to load projects.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (token) {
      fetchProjects();
    } else {
      setLoading(false);
      setError('Please log in again to view your projects.');
    }
  }, [token]);

  // Delete a project from PostgreSQL.
  async function handleDelete(id) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this project?'
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to delete project.');
      }

      setProjects((previous) =>
        previous.filter((project) => project.id !== id)
      );

      setActiveMenu(null);
    } catch (err) {
      console.error('Delete project error:', err);
      alert(err.message || 'Unable to delete project.');
    }
  }

  const statusStyles = {
    'In Progress': 'bg-blue-50 text-blue-600',
    Planning: 'bg-amber-50 text-amber-600',
    Completed: 'bg-green-50 text-green-600',
    Recruiting: 'bg-green-50 text-green-600',
  };

  const formatDate = (date) => {
    if (!date) return 'Recently created';

    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const totalMembers = projects.reduce(
    (total, project) => total + Number(project.members || 0),
    0
  );

  const inProgressProjects = projects.filter(
    (project) => project.status === 'In Progress'
  ).length;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 lg:ml-64">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Manage Projects
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage your projects, teams and progress.
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

        {/* Statistics */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">Total Projects</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              {projects.length}
            </h2>
            <FolderKanban className="mt-2 text-indigo-600" size={23} />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">Team Members</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              {totalMembers}
            </h2>
            <Users className="mt-2 text-purple-600" size={23} />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">In Progress</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              {inProgressProjects}
            </h2>
            <CalendarDays className="mt-2 text-blue-600" size={23} />
          </div>
        </div>

        {/* Project List */}
        <div className="overflow-visible rounded-2xl border border-slate-200 bg-white">
          <div className="border-b border-slate-100 p-5">
            <h2 className="font-bold text-slate-900">Your Projects</h2>
            <p className="mt-1 text-sm text-slate-500">
              View and manage all the projects you have created.
            </p>
          </div>

          {loading ? (
            <div className="py-16 text-center text-slate-500">
              Loading your projects...
            </div>
          ) : error ? (
            <div className="px-5 py-12 text-center">
              <p className="text-sm text-red-600">{error}</p>
              <button
                onClick={fetchProjects}
                className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white"
              >
                Try Again
              </button>
            </div>
          ) : projects.length === 0 ? (
            <div className="px-5 py-16 text-center">
              <FolderKanban
                size={40}
                className="mx-auto mb-4 text-slate-300"
              />
              <h3 className="font-semibold text-slate-800">
                No projects yet
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Create your first project and start building your team.
              </p>
              <Link
                to="/create-project"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                <Plus size={17} />
                Create Project
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {projects.map((project) => {
                const status = project.status || 'Recruiting';

                return (
                  <div
                    key={project.id}
                    className="flex flex-col justify-between gap-4 p-5 transition hover:bg-slate-50 sm:flex-row sm:items-center"
                  >
                    <div className="flex min-w-0 items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                        <FolderKanban size={23} />
                      </div>

                      <div className="min-w-0">
                        <h3 className="font-semibold text-slate-900">
                          {project.title || project.name}
                        </h3>

                        <p className="mt-1 max-w-xl text-sm text-slate-500">
                          {project.description || 'No description provided.'}
                        </p>

                        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                          <span>{project.category || 'Other'}</span>

                          <span className="flex items-center gap-1">
                            <Users size={14} />
                            {project.members || 0} members
                          </span>

                          <span className="flex items-center gap-1">
                            <CalendarDays size={14} />
                            {formatDate(project.createdAt || project.date)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 sm:justify-end">
                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                          statusStyles[status] ||
                          'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {status}
                      </span>

                      <div className="relative">
                        <button
                          onClick={() =>
                            setActiveMenu(
                              activeMenu === project.id ? null : project.id
                            )
                          }
                          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                        >
                          <MoreVertical size={20} />
                        </button>

                        {activeMenu === project.id && (
                          <div className="absolute right-0 top-10 z-20 w-44 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                            <Link
                              to={`/project-details/${project.id}`}
                              onClick={() => setActiveMenu(null)}
                              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
                            >
                              <Eye size={16} />
                              View Project
                            </Link>

                            <button
                              onClick={() => setActiveMenu(null)}
                              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
                            >
                              <Pencil size={16} />
                              Edit Project
                            </button>

                            <button
                              onClick={() => handleDelete(project.id)}
                              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                              <Trash2 size={16} />
                              Delete Project
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ManageProjects;