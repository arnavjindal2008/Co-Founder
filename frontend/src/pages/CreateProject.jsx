
import { useState } from 'react';
import {
  ArrowLeft,
  Plus,
  X,
  Lightbulb,
  Briefcase,
  Target,
  Users,
  CheckCircle,
  Send,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import Sidebar from '../components/Sidebar';
import DashboardNavbar from '../components/DashboardNavbar';

function CreateProject() {
  const navigate = useNavigate();

  const [project, setProject] = useState({
    title: '',
    category: '',
    description: '',
    problem: '',
    solution: '',
    goals: '',
    stage: 'Idea',
    commitment: 'Part-time',
    location: '',
  });

  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');

  const [roles, setRoles] = useState([]);
  const [newRole, setNewRole] = useState({
    title: '',
    openings: '1',
  });

  const [success, setSuccess] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setProject((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function addSkill() {
    const value = newSkill.trim();

    if (value && !skills.includes(value)) {
      setSkills((previous) => [...previous, value]);
      setNewSkill('');
    }
  }

  function removeSkill(skill) {
    setSkills((previous) =>
      previous.filter((item) => item !== skill)
    );
  }

  function addRole() {
    const title = newRole.title.trim();

    if (!title) return;

    setRoles((previous) => [
      ...previous,
      {
        id: Date.now(),
        title,
        openings: Number(newRole.openings),
      },
    ]);

    setNewRole({
      title: '',
      openings: '1',
    });
  }

  function removeRole(id) {
    setRoles((previous) =>
      previous.filter((role) => role.id !== id)
    );
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (skills.length === 0) {
      alert('Please add at least one required skill.');
      return;
    }

    setSuccess(true);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Sidebar />

        <div className="min-h-screen lg:ml-64">
          <DashboardNavbar />

          <main className="flex min-h-[75vh] items-center justify-center p-5">
            <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                <CheckCircle size={34} />
              </div>

              <h1 className="mt-5 text-2xl font-bold text-slate-900">
                Project Created!
              </h1>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Your project form has been completed successfully.
                Backend integration will allow you to publish it and
                make it visible to other founders.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <button
                  onClick={() => navigate('/discover-projects')}
                  className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
                >
                  Discover Projects
                </button>

                <button
                  onClick={() => {
                    setProject({
                      title: '',
                      category: '',
                      description: '',
                      problem: '',
                      solution: '',
                      goals: '',
                      stage: 'Idea',
                      commitment: 'Part-time',
                      location: '',
                    });
                    setSkills([]);
                    setRoles([]);
                    setSuccess(false);
                  }}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Create Another
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <div className="min-h-screen lg:ml-64">
        <DashboardNavbar />

        <main className="mx-auto max-w-5xl p-5 sm:p-8">
          <Link
            to="/discover-projects"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600"
          >
            <ArrowLeft size={17} />
            Back to Discover Projects
          </Link>

          <div className="mb-7">
            <h1 className="text-2xl font-bold text-slate-900">
              Create a Project
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Share your idea, build your team and turn your vision into reality.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic information */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                  <Lightbulb size={21} />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900">
                    Basic Information
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Introduce your project to the community.
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Project Name *
                  </label>
                  <input
                    name="title"
                    value={project.title}
                    onChange={handleChange}
                    required
                    maxLength={100}
                    placeholder="e.g. SkillBridge"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={project.category}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500"
                  >
                    <option value="">Select a category</option>
                    <option>Technology</option>
                    <option>Education Technology</option>
                    <option>Healthcare</option>
                    <option>Finance</option>
                    <option>E-commerce</option>
                    <option>Social Impact</option>
                    <option>Artificial Intelligence</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Short Description *
                  </label>
                  <textarea
                    name="description"
                    value={project.description}
                    onChange={handleChange}
                    required
                    maxLength={300}
                    rows={3}
                    placeholder="Explain your project in a few sentences..."
                    className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500"
                  />
                  <p className="mt-1 text-right text-xs text-slate-400">
                    {project.description.length}/300
                  </p>
                </div>
              </div>
            </section>

            {/* Project details */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
                  <Target size={21} />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900">
                    Project Details
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Explain the problem and your proposed solution.
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Problem Statement *
                  </label>
                  <textarea
                    name="problem"
                    value={project.problem}
                    onChange={handleChange}
                    required
                    rows={4}
                    placeholder="What problem are you trying to solve?"
                    className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Proposed Solution *
                  </label>
                  <textarea
                    name="solution"
                    value={project.solution}
                    onChange={handleChange}
                    required
                    rows={4}
                    placeholder="How will your project solve this problem?"
                    className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Project Goals
                  </label>
                  <textarea
                    name="goals"
                    value={project.goals}
                    onChange={handleChange}
                    rows={3}
                    placeholder="What do you want to achieve?"
                    className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </section>

            {/* Skills */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-xl bg-green-50 p-3 text-green-600">
                  <Briefcase size={21} />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900">
                    Required Skills
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Add skills you need in your project team.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="text-indigo-500 hover:text-red-500"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>

              <div className="mt-4 flex gap-2">
                <input
                  value={newSkill}
                  onChange={(event) => setNewSkill(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      addSkill();
                    }
                  }}
                  placeholder="e.g. React, Marketing, UI Design"
                  className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white hover:bg-indigo-700"
                >
                  <Plus size={17} />
                  Add
                </button>
              </div>
            </section>

            {/* Open positions */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                  <Users size={21} />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900">
                    Open Positions
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Specify the roles you want to recruit.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_130px_auto]">
                <input
                  value={newRole.title}
                  onChange={(event) =>
                    setNewRole((previous) => ({
                      ...previous,
                      title: event.target.value,
                    }))
                  }
                  placeholder="Role e.g. Frontend Developer"
                  className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500"
                />

                <select
                  value={newRole.openings}
                  onChange={(event) =>
                    setNewRole((previous) => ({
                      ...previous,
                      openings: event.target.value,
                    }))
                  }
                  className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-indigo-500"
                >
                  <option value="1">1 Opening</option>
                  <option value="2">2 Openings</option>
                  <option value="3">3 Openings</option>
                  <option value="4">4 Openings</option>
                  <option value="5">5 Openings</option>
                </select>

                <button
                  type="button"
                  onClick={addRole}
                  className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
                >
                  <Plus size={17} />
                  Add Role
                </button>
              </div>

              {roles.length > 0 && (
                <div className="mt-5 space-y-3">
                  {roles.map((role) => (
                    <div
                      key={role.id}
                      className="flex items-center justify-between rounded-xl border border-slate-200 p-4"
                    >
                      <div>
                        <p className="font-semibold text-slate-800">
                          {role.title}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {role.openings} opening(s)
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeRole(role.id)}
                        className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                      >
                        <X size={17} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Preferences */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="mb-5 font-bold text-slate-900">
                Project Preferences
              </h2>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Project Stage
                  </label>
                  <select
                    name="stage"
                    value={project.stage}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500"
                  >
                    <option>Idea</option>
                    <option>Research</option>
                    <option>Prototype</option>
                    <option>MVP</option>
                    <option>Launched</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Time Commitment
                  </label>
                  <select
                    name="commitment"
                    value={project.commitment}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500"
                  >
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Weekends only</option>
                    <option>Flexible</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Location
                  </label>
                  <input
                    name="location"
                    value={project.location}
                    onChange={handleChange}
                    placeholder="e.g. Delhi, India or Remote"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </section>

            {/* Submit */}
            <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
              <Link
                to="/discover-projects"
                className="rounded-xl border border-slate-200 px-6 py-3 text-center text-sm font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-7 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                <Send size={17} />
                Publish Project
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}

export default CreateProject;
