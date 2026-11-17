import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  CalendarDays,
  CheckCircle,
  Clock,
  Code,
  Lightbulb,
  MapPin,
  MessageCircle,
  Target,
  Users,
  Wallet,
  Send,
  X,
} from 'lucide-react';
import { Link } from 'react-router-dom';

import Sidebar from '../components/Sidebar';
import DashboardNavbar from '../components/DashboardNavbar';

function ProjectDetails() {
  const [showApplication, setShowApplication] = useState(false);
  const [application, setApplication] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const project = {
    title: 'SkillBridge',
    category: 'Education Technology',
    status: 'Looking for team members',
    description:
      'SkillBridge is a platform that helps students learn practical skills through real-world projects, mentorship and collaboration.',
    problem:
      'Many students learn theoretical concepts but struggle to gain practical experience. They also find it difficult to connect with people who can help them build real projects.',
    solution:
      'SkillBridge connects learners, mentors and project creators. Students can join teams, work on practical assignments and build a portfolio of real work.',
    goal:
      'Build a platform where students can discover projects, collaborate with others and develop skills through practical experience.',
    owner: 'Aarav Sharma',
    ownerRole: 'Founder & Full Stack Developer',
    location: 'Delhi, India',
    teamSize: 3,
    posted: '2 days ago',
    commitment: 'Part-time',
    stage: 'Idea / MVP',
    skills: ['React', 'Node.js', 'PostgreSQL', 'UI/UX Design', 'Marketing'],
    roles: [
      {
        title: 'Frontend Developer',
        description: 'Build responsive and user-friendly React interfaces.',
        skills: ['React', 'JavaScript', 'Tailwind CSS'],
        openings: 1,
      },
      {
        title: 'UI/UX Designer',
        description: 'Design user flows, wireframes and product interfaces.',
        skills: ['Figma', 'UI Design', 'Prototyping'],
        openings: 1,
      },
    ],
    team: [
      { name: 'Aarav Sharma', role: 'Founder & Developer', initials: 'AS' },
      { name: 'Riya Mehta', role: 'Product Designer', initials: 'RM' },
      { name: 'Kabir Verma', role: 'Marketing', initials: 'KV' },
    ],
  };

  function handleApplication(event) {
    event.preventDefault();

    if (!application.trim()) {
      return;
    }

    setSubmitted(true);
    setShowApplication(false);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <div className="min-h-screen lg:ml-64">
        <DashboardNavbar />

        <main className="mx-auto max-w-7xl p-5 sm:p-8">
          <Link
            to="/discover-projects"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600"
          >
            <ArrowLeft size={17} />
            Back to Discover Projects
          </Link>

          {/* Project heading */}
          <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
            <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
              <div className="flex gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700">
                  <Lightbulb size={32} />
                </div>

                <div>
                  <div className="mb-2 flex flex-wrap gap-2">
                    <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                      {project.category}
                    </span>
                    <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                      {project.status}
                    </span>
                  </div>

                  <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                    {project.title}
                  </h1>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                    {project.description}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowApplication(true)}
                disabled={submitted}
                className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-green-600"
              >
                {submitted ? (
                  <>
                    <CheckCircle size={17} />
                    Application Sent
                  </>
                ) : (
                  <>
                    Apply to Join
                    <ArrowRight size={17} />
                  </>
                )}
              </button>
            </div>

            <div className="mt-7 grid grid-cols-2 gap-4 border-t border-slate-100 pt-6 sm:grid-cols-4">
              <div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Users size={16} />
                  <span className="text-xs">Team Size</span>
                </div>
                <p className="mt-2 font-semibold text-slate-800">
                  {project.teamSize} Members
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Clock size={16} />
                  <span className="text-xs">Commitment</span>
                </div>
                <p className="mt-2 font-semibold text-slate-800">
                  {project.commitment}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Target size={16} />
                  <span className="text-xs">Project Stage</span>
                </div>
                <p className="mt-2 font-semibold text-slate-800">
                  {project.stage}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-slate-400">
                  <CalendarDays size={16} />
                  <span className="text-xs">Posted</span>
                </div>
                <p className="mt-2 font-semibold text-slate-800">
                  {project.posted}
                </p>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Main content */}
            <div className="space-y-6 lg:col-span-2">
              <section className="rounded-2xl border border-slate-200 bg-white p-6">
                <h2 className="mb-4 text-lg font-bold text-slate-900">
                  About This Project
                </h2>

                <p className="text-sm leading-7 text-slate-600">
                  {project.description}
                </p>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-6">
                <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-slate-900">
                  <Target size={19} className="text-indigo-600" />
                  Problem We Are Solving
                </h2>
                <p className="text-sm leading-7 text-slate-600">
                  {project.problem}
                </p>

                <h3 className="mb-3 mt-6 font-semibold text-slate-900">
                  Our Solution
                </h3>
                <p className="text-sm leading-7 text-slate-600">
                  {project.solution}
                </p>

                <h3 className="mb-3 mt-6 font-semibold text-slate-900">
                  Project Goal
                </h3>
                <p className="text-sm leading-7 text-slate-600">
                  {project.goal}
                </p>
              </section>

              {/* Required skills */}
              <section className="rounded-2xl border border-slate-200 bg-white p-6">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
                  <Code size={19} className="text-indigo-600" />
                  Required Skills
                </h2>

                <div className="flex flex-wrap gap-2">
                  {project.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-lg bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>

              {/* Open roles */}
              <section className="rounded-2xl border border-slate-200 bg-white p-6">
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-slate-900">
                    Open Positions
                  </h2>
                  <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                    {project.roles.length} Open Roles
                  </span>
                </div>

                <div className="space-y-4">
                  {project.roles.map((role) => (
                    <div
                      key={role.title}
                      className="rounded-xl border border-slate-200 p-5"
                    >
                      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                        <div>
                          <h3 className="font-semibold text-slate-900">
                            {role.title}
                          </h3>
                          <p className="mt-2 text-sm leading-6 text-slate-500">
                            {role.description}
                          </p>
                        </div>

                        <span className="w-fit rounded-lg bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
                          {role.openings} Opening
                        </span>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {role.skills.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-md bg-slate-100 px-2.5 py-1 text-xs text-slate-600"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Sidebar information */}
            <div className="space-y-6">
              {/* Founder */}
              <section className="rounded-2xl border border-slate-200 bg-white p-6">
                <h2 className="mb-5 text-lg font-bold text-slate-900">
                  Project Founder
                </h2>

                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 font-bold text-purple-700">
                    AS
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {project.owner}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      {project.ownerRole}
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-3 border-t border-slate-100 pt-5 text-sm text-slate-500">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    {project.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase size={16} />
                    Project Founder
                  </div>
                </div>

                <button
                  onClick={() =>
                    window.alert('Founder messaging will be available soon.')
                  }
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-indigo-200 py-3 text-sm font-semibold text-indigo-600 hover:bg-indigo-50"
                >
                  <MessageCircle size={17} />
                  Contact Founder
                </button>
              </section>

              {/* Current team */}
              <section className="rounded-2xl border border-slate-200 bg-white p-6">
                <h2 className="mb-5 text-lg font-bold text-slate-900">
                  Current Team
                </h2>

                <div className="space-y-4">
                  {project.team.map((member) => (
                    <div key={member.name} className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-700">
                        {member.initials}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          {member.name}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {member.role}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Project commitment */}
              <section className="rounded-2xl border border-slate-200 bg-white p-6">
                <h2 className="mb-4 text-lg font-bold text-slate-900">
                  Project Details
                </h2>

                <div className="space-y-4 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2 text-slate-500">
                      <Clock size={16} />
                      Time Commitment
                    </span>
                    <span className="font-semibold text-slate-800">
                      {project.commitment}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2 text-slate-500">
                      <Users size={16} />
                      Team Members
                    </span>
                    <span className="font-semibold text-slate-800">
                      {project.teamSize}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2 text-slate-500">
                      <Wallet size={16} />
                      Compensation
                    </span>
                    <span className="font-semibold text-slate-800">
                      To be discussed
                    </span>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>

      {/* Application modal */}
      {showApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Apply to Join
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Send your application to {project.owner}.
                </p>
              </div>

              <button
                onClick={() => setShowApplication(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleApplication}>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Why do you want to join this project?
              </label>

              <textarea
                value={application}
                onChange={(event) => setApplication(event.target.value)}
                rows={5}
                required
                placeholder="Tell the founder about your skills, experience and how you can contribute..."
                className="w-full resize-none rounded-xl border border-slate-200 p-4 text-sm outline-none focus:border-indigo-500"
              />

              <div className="mt-5 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowApplication(false)}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
                >
                  <Send size={16} />
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectDetails;