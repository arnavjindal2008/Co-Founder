import { useState } from 'react';
import {
  MapPin,
  Mail,
  Briefcase,
  GraduationCap,
  Pencil,
  Plus,
  X,
  Check,
  UserRound,
  Target,
  Clock,
} from 'lucide-react';

import Sidebar from '../components/Sidebar';
import DashboardNavbar from '../components/DashboardNavbar';

function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');

  const [profile, setProfile] = useState({
    name: 'Your Name',
    email: 'you@example.com',
    headline: 'Aspiring Founder | Building something meaningful',
    location: 'Sonipat, India',
    about:
      'I am passionate about building products, solving real-world problems and working with people who have exciting ideas.',
    education: 'BTech Computer Science & AI',
    university: 'Your University',
    experience: 'Student / Beginner',
    role: 'Looking for a Co-founder',
    availability: 'Part-time',
  });

  const [skills, setSkills] = useState([
    'JavaScript',
    'React',
    'Node.js',
    'Python',
    'PostgreSQL',
  ]);

  const [interests, setInterests] = useState([
    'Startups',
    'Artificial Intelligence',
    'Technology',
    'Entrepreneurship',
  ]);

  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');

  function handleChange(event) {
    const { name, value } = event.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleSave(event) {
    event.preventDefault();
    setIsEditing(false);
    setMessage('Profile updated successfully!');

    setTimeout(() => {
      setMessage('');
    }, 3000);
  }

  function addSkill() {
    const value = newSkill.trim();

    if (value && !skills.includes(value)) {
      setSkills([...skills, value]);
      setNewSkill('');
    }
  }

  function addInterest() {
    const value = newInterest.trim();

    if (value && !interests.includes(value)) {
      setInterests([...interests, value]);
      setNewInterest('');
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <div className="min-h-screen lg:ml-64">
        <DashboardNavbar />

        <main className="mx-auto max-w-7xl p-5 sm:p-8">
          {/* Page heading */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                My Profile
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Manage your information and showcase yourself to founders.
              </p>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              <Pencil size={16} />
              {isEditing ? 'Cancel Editing' : 'Edit Profile'}
            </button>
          </div>

          {message && (
            <div className="mb-5 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
              <Check size={18} />
              {message}
            </div>
          )}

          {/* Profile overview */}
          <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-3xl font-bold text-indigo-700">
                {profile.name.charAt(0).toUpperCase()}
              </div>

              <div className="flex-1">
                <h2 className="text-2xl font-bold text-slate-900">
                  {profile.name}
                </h2>

                <p className="mt-1 text-slate-600">
                  {profile.headline}
                </p>

                <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <MapPin size={15} />
                    {profile.location}
                  </span>

                  <span className="flex items-center gap-1.5">
                    <Mail size={15} />
                    {profile.email}
                  </span>
                </div>
              </div>

              <div className="rounded-xl bg-indigo-50 px-4 py-3 text-center">
                <p className="text-2xl font-bold text-indigo-700">75%</p>
                <p className="text-xs font-medium text-indigo-600">
                  Profile Complete
                </p>
              </div>
            </div>
          </section>

          <form onSubmit={handleSave}>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Main profile information */}
              <div className="space-y-6 lg:col-span-2">
                {/* Personal information */}
                <section className="rounded-2xl border border-slate-200 bg-white p-6">
                  <h3 className="mb-5 text-lg font-bold text-slate-900">
                    Personal Information
                  </h3>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Full Name
                      </label>
                      <input
                        name="name"
                        value={profile.name}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 disabled:bg-slate-50"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Email
                      </label>
                      <input
                        value={profile.email}
                        disabled
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Headline
                      </label>
                      <input
                        name="headline"
                        value={profile.headline}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 disabled:bg-slate-50"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Location
                      </label>
                      <input
                        name="location"
                        value={profile.location}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 disabled:bg-slate-50"
                      />
                    </div>
                  </div>
                </section>

                {/* About */}
                <section className="rounded-2xl border border-slate-200 bg-white p-6">
                  <h3 className="mb-4 text-lg font-bold text-slate-900">
                    About Me
                  </h3>

                  <textarea
                    name="about"
                    value={profile.about}
                    onChange={handleChange}
                    disabled={!isEditing}
                    rows={5}
                    className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm leading-6 outline-none focus:border-indigo-500 disabled:bg-slate-50"
                  />
                </section>

                {/* Skills */}
                <section className="rounded-2xl border border-slate-200 bg-white p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-900">
                      Skills
                    </h3>
                    <span className="text-xs text-slate-400">
                      {skills.length} skills
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <span
                        key={skill}
                        className="flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700"
                      >
                        {skill}

                        {isEditing && (
                          <button
                            type="button"
                            onClick={() =>
                              setSkills(skills.filter((item) => item !== skill))
                            }
                            className="text-indigo-500 hover:text-red-500"
                          >
                            <X size={14} />
                          </button>
                        )}
                      </span>
                    ))}
                  </div>

                  {isEditing && (
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
                        placeholder="Add a skill"
                        className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={addSkill}
                        className="rounded-xl bg-indigo-600 px-4 text-white hover:bg-indigo-700"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                  )}
                </section>

                {/* Interests */}
                <section className="rounded-2xl border border-slate-200 bg-white p-6">
                  <h3 className="mb-4 text-lg font-bold text-slate-900">
                    Interests
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    {interests.map((interest) => (
                      <span
                        key={interest}
                        className="flex items-center gap-2 rounded-lg bg-purple-50 px-3 py-2 text-sm font-medium text-purple-700"
                      >
                        {interest}

                        {isEditing && (
                          <button
                            type="button"
                            onClick={() =>
                              setInterests(
                                interests.filter((item) => item !== interest)
                              )
                            }
                            className="text-purple-500 hover:text-red-500"
                          >
                            <X size={14} />
                          </button>
                        )}
                      </span>
                    ))}
                  </div>

                  {isEditing && (
                    <div className="mt-4 flex gap-2">
                      <input
                        value={newInterest}
                        onChange={(event) => setNewInterest(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter') {
                            event.preventDefault();
                            addInterest();
                          }
                        }}
                        placeholder="Add an interest"
                        className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={addInterest}
                        className="rounded-xl bg-purple-600 px-4 text-white hover:bg-purple-700"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                  )}
                </section>
              </div>

              {/* Right column */}
              <div className="space-y-6">
                {/* Education */}
                <section className="rounded-2xl border border-slate-200 bg-white p-6">
                  <div className="mb-5 flex items-center gap-2">
                    <GraduationCap className="text-indigo-600" size={20} />
                    <h3 className="text-lg font-bold text-slate-900">
                      Education
                    </h3>
                  </div>

                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Degree
                  </label>
                  <input
                    name="education"
                    value={profile.education}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="mb-4 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-indigo-500 disabled:bg-slate-50"
                  />

                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    University
                  </label>
                  <input
                    name="university"
                    value={profile.university}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-indigo-500 disabled:bg-slate-50"
                  />
                </section>

                {/* Experience */}
                <section className="rounded-2xl border border-slate-200 bg-white p-6">
                  <div className="mb-5 flex items-center gap-2">
                    <Briefcase className="text-indigo-600" size={20} />
                    <h3 className="text-lg font-bold text-slate-900">
                      Experience
                    </h3>
                  </div>

                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Current Experience
                  </label>
                  <input
                    name="experience"
                    value={profile.experience}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-indigo-500 disabled:bg-slate-50"
                  />
                </section>

                {/* Founder preferences */}
                <section className="rounded-2xl border border-slate-200 bg-white p-6">
                  <div className="mb-5 flex items-center gap-2">
                    <Target className="text-indigo-600" size={20} />
                    <h3 className="text-lg font-bold text-slate-900">
                      Founder Preferences
                    </h3>
                  </div>

                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    I am
                  </label>
                  <select
                    name="role"
                    value={profile.role}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="mb-4 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-indigo-500 disabled:bg-slate-50"
                  >
                    <option>Looking for a Co-founder</option>
                    <option>Looking to join a Startup</option>
                    <option>Looking for Team Members</option>
                  </select>

                  <div className="mb-2 flex items-center gap-2">
                    <Clock size={16} className="text-slate-500" />
                    <label className="text-sm font-medium text-slate-700">
                      Availability
                    </label>
                  </div>

                  <select
                    name="availability"
                    value={profile.availability}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-indigo-500 disabled:bg-slate-50"
                  >
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Weekends only</option>
                    <option>Flexible</option>
                  </select>
                </section>

                {/* Profile tip */}
                <section className="rounded-2xl bg-indigo-600 p-5 text-white">
                  <UserRound size={24} />
                  <h3 className="mt-3 font-bold">
                    Build a stronger profile
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-indigo-100">
                    Add your skills and interests so other founders can
                    discover you more easily.
                  </p>
                </section>
              </div>
            </div>

            {isEditing && (
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
                >
                  <Check size={17} />
                  Save Changes
                </button>
              </div>
            )}
          </form>
        </main>
      </div>
    </div>
  );
}

export default Profile;