import { useEffect, useState } from 'react';
import {
  MapPin, Mail, Briefcase, GraduationCap, Pencil, Check,
  UserRound, Target, Clock, AlertCircle, LoaderCircle,
} from 'lucide-react';

import Sidebar from '../components/Sidebar';
import DashboardNavbar from '../components/DashboardNavbar';
import { useAuth } from '../context/AuthContext';

const emptyProfile = {
  name: '',
  email: '',
  headline: '',
  about: '',
  education: '',
  experience: '',
  github_url: '',
  portfolio_url: '',
  availability: 'Part-time',
};

function Profile() {
  const { token } = useAuth();

  const [profile, setProfile] = useState(emptyProfile);
  const [originalProfile, setOriginalProfile] = useState(emptyProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        setError('');

        const response = await fetch('/api/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Unable to load profile');
        }

        const loaded = {
          name: data.profile.full_name || '',
          email: data.profile.email || '',
          headline: data.profile.headline || '',
          about: data.profile.bio || '',
          education: data.profile.education || '',
          experience: data.profile.experience || '',
          github_url: data.profile.github_url || '',
          portfolio_url: data.profile.portfolio_url || '',
          availability: data.profile.availability || 'Part-time',
        };

        setProfile(loaded);
        setOriginalProfile(loaded);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (token) loadProfile();
  }, [token]);

  function handleChange(event) {
    const { name, value } = event.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function cancelEditing() {
    setProfile(originalProfile);
    setIsEditing(false);
    setError('');
    setMessage('');
  }

  async function handleSave(event) {
    event.preventDefault();

    try {
      setSaving(true);
      setError('');
      setMessage('');

      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          full_name: profile.name,
          headline: profile.headline,
          bio: profile.about,
          education: profile.education,
          experience: profile.experience,
          github_url: profile.github_url,
          portfolio_url: profile.portfolio_url,
          availability: profile.availability,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to save profile');
      }

      const updated = {
        ...profile,
        name: data.profile.full_name || '',
        headline: data.profile.headline || '',
        about: data.profile.bio || '',
        education: data.profile.education || '',
        experience: data.profile.experience || '',
        github_url: data.profile.github_url || '',
        portfolio_url: data.profile.portfolio_url || '',
        availability: data.profile.availability || 'Part-time',
      };

      setProfile(updated);
      setOriginalProfile(updated);
      setIsEditing(false);
      setMessage('Profile saved successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Sidebar />
        <div className="lg:ml-64">
          <DashboardNavbar />
          <div className="flex min-h-[70vh] items-center justify-center gap-3 text-slate-600">
            <LoaderCircle className="animate-spin" />
            Loading your profile...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <div className="min-h-screen lg:ml-64">
        <DashboardNavbar />

        <main className="mx-auto max-w-7xl p-5 sm:p-8">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
              <p className="mt-1 text-sm text-slate-500">
                Manage your information and showcase yourself to founders.
              </p>
            </div>

            {!isEditing && (
              <button
                onClick={() => {
                  setMessage('');
                  setError('');
                  setIsEditing(true);
                }}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                <Pencil size={16} />
                Edit Profile
              </button>
            )}
          </div>

          {message && (
            <div className="mb-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
              <Check className="mr-2 inline" size={18} />
              {message}
            </div>
          )}

          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <AlertCircle className="mr-2 inline" size={18} />
              {error}
            </div>
          )}

          <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-3xl font-bold text-indigo-700">
                {profile.name.charAt(0).toUpperCase() || '?'}
              </div>

              <div className="flex-1">
                <h2 className="text-2xl font-bold text-slate-900">
                  {profile.name || 'Your Name'}
                </h2>
                <p className="mt-1 text-slate-600">
                  {profile.headline || 'Add a headline to introduce yourself'}
                </p>
                <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Mail size={15} />
                    {profile.email}
                  </span>
                </div>
              </div>
            </div>
          </section>

          <form onSubmit={handleSave}>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="space-y-6 lg:col-span-2">
                <section className="rounded-2xl border border-slate-200 bg-white p-6">
                  <h3 className="mb-5 text-lg font-bold text-slate-900">
                    Personal Information
                  </h3>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <Field label="Full Name" name="name" value={profile.name} onChange={handleChange} disabled={!isEditing} />
                    <Field label="Email" value={profile.email} disabled />
                    <Field label="Headline" name="headline" value={profile.headline} onChange={handleChange} disabled={!isEditing} />
                  </div>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-6">
                  <h3 className="mb-4 text-lg font-bold text-slate-900">About Me</h3>
                  <textarea
                    name="about"
                    value={profile.about}
                    onChange={handleChange}
                    disabled={!isEditing}
                    rows={5}
                    className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm leading-6 outline-none focus:border-indigo-500 disabled:bg-slate-50"
                    placeholder="Tell founders about yourself..."
                  />
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-6">
                  <h3 className="mb-5 flex items-center gap-2 text-lg font-bold text-slate-900">
                    <GraduationCap className="text-indigo-600" size={20} />
                    Education
                  </h3>
                  <Field label="Degree / Education" name="education" value={profile.education} onChange={handleChange} disabled={!isEditing} />
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-6">
                  <h3 className="mb-5 flex items-center gap-2 text-lg font-bold text-slate-900">
                    <Briefcase className="text-indigo-600" size={20} />
                    Experience
                  </h3>
                  <Field label="Experience" name="experience" value={profile.experience} onChange={handleChange} disabled={!isEditing} />
                </section>
              </div>

              <div className="space-y-6">
                <section className="rounded-2xl border border-slate-200 bg-white p-6">
                  <h3 className="mb-5 flex items-center gap-2 text-lg font-bold text-slate-900">
                    <Target className="text-indigo-600" size={20} />
                    Online Presence
                  </h3>
                  <Field label="GitHub URL" name="github_url" value={profile.github_url} onChange={handleChange} disabled={!isEditing} placeholder="https://github.com/username" />
                  <div className="mt-4">
                    <Field label="Portfolio URL" name="portfolio_url" value={profile.portfolio_url} onChange={handleChange} disabled={!isEditing} placeholder="https://yourportfolio.com" />
                  </div>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-6">
                  <h3 className="mb-5 flex items-center gap-2 text-lg font-bold text-slate-900">
                    <Clock size={18} className="text-indigo-600" />
                    Availability
                  </h3>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Availability
                  </label>
                  <select
                    name="availability"
                    value={profile.availability}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm disabled:bg-slate-50"
                  >
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Weekends only</option>
                    <option>Flexible</option>
                  </select>
                </section>

                <section className="rounded-2xl bg-indigo-600 p-5 text-white">
                  <UserRound size={24} />
                  <h3 className="mt-3 font-bold">Build a stronger profile</h3>
                  <p className="mt-2 text-sm leading-6 text-indigo-100">
                    Add your skills and interests to help other founders discover you.
                  </p>
                </section>
              </div>
            </div>

            {isEditing && (
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={cancelEditing}
                  disabled={saving}
                  className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
                >
                  {saving ? <LoaderCircle className="animate-spin" size={17} /> : <Check size={17} />}
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </form>
        </main>
      </div>
    </div>
  );
}

function Field({ label, name, value, onChange, disabled, placeholder = '' }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        name={name}
        value={value ?? ''}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 disabled:bg-slate-50"
      />
    </div>
  );
}

export default Profile;
