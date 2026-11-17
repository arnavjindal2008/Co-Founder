
import { useState } from 'react';
import {
  Settings as SettingsIcon,
  UserRound,
  Lock,
  Bell,
  ShieldCheck,
  Save,
} from 'lucide-react';

import Sidebar from '../components/Sidebar';
import DashboardNavbar from '../components/DashboardNavbar';

function Settings() {
  const [profile, setProfile] = useState({
    name: 'Your Name',
    email: 'you@example.com',
  });

  const [preferences, setPreferences] = useState({
    connectionAlerts: true,
    applicationAlerts: true,
    messageAlerts: true,
    emailNotifications: false,
    profileVisibility: true,
  });

  const [message, setMessage] = useState('');

  function updateProfile(event) {
    const { name, value } = event.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function togglePreference(name) {
    setPreferences((previous) => ({
      ...previous,
      [name]: !previous[name],
    }));
  }

  function handleSave(event) {
    event.preventDefault();
    setMessage('Settings updated successfully!');

    setTimeout(() => setMessage(''), 3000);
  }

  function SettingToggle({ label, description, name }) {
    return (
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 py-4 last:border-0">
        <div>
          <p className="text-sm font-semibold text-slate-800">
            {label}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {description}
          </p>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={preferences[name]}
          onClick={() => togglePreference(name)}
          className={`relative h-6 w-11 shrink-0 rounded-full transition ${
            preferences[name] ? 'bg-indigo-600' : 'bg-slate-300'
          }`}
        >
          <span
            className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
              preferences[name] ? 'left-6' : 'left-1'
            }`}
          />
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <div className="min-h-screen lg:ml-64">
        <DashboardNavbar />

        <main className="mx-auto max-w-5xl p-5 sm:p-8">
          <div className="mb-7">
            <h1 className="text-2xl font-bold text-slate-900">
              Settings
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage your account, notifications and privacy preferences.
            </p>
          </div>

          {message && (
            <div className="mb-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
              {message}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-6">
            {/* Account settings */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                  <UserRound size={21} />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">
                    Account Information
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Manage your basic account details.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Full Name
                  </label>
                  <input
                    name="name"
                    value={profile.name}
                    onChange={updateProfile}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500"
                  />
                </div>
              </div>
            </section>

            {/* Password */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                  <Lock size={21} />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900">
                    Password & Security
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Keep your account secure.
                  </p>
                </div>
              </div>

              <p className="text-sm text-slate-500">
                Password management will be available after backend
                authentication is implemented.
              </p>
            </section>

            {/* Notification settings */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="mb-3 flex items-center gap-3">
                <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
                  <Bell size={21} />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900">
                    Notification Preferences
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Choose which updates you want to receive.
                  </p>
                </div>
              </div>

              <SettingToggle
                name="connectionAlerts"
                label="Connection Requests"
                description="Get notified when someone connects with you."
              />

              <SettingToggle
                name="applicationAlerts"
                label="Project Applications"
                description="Receive updates about project applications."
              />

              <SettingToggle
                name="messageAlerts"
                label="New Messages"
                description="Get notified when someone sends you a message."
              />

              <SettingToggle
                name="emailNotifications"
                label="Email Notifications"
                description="Receive selected notifications through email."
              />
            </section>

            {/* Privacy */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="mb-3 flex items-center gap-3">
                <div className="rounded-xl bg-green-50 p-3 text-green-600">
                  <ShieldCheck size={21} />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">
                    Privacy Settings
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Control your profile visibility.
                  </p>
                </div>
              </div>

              <SettingToggle
                name="profileVisibility"
                label="Public Profile"
                description="Allow other founders to discover your profile."
              />
            </section>

            <div className="flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                <Save size={17} />
                Save Settings
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}

export default Settings;
