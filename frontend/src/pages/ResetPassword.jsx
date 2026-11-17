import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Rocket, LockKeyhole, CheckCircle } from 'lucide-react';

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [updated, setUpdated] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must contain at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setUpdated(true);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <Link to="/" className="mb-8 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
            <Rocket size={21} />
          </div>
          <span className="text-xl font-bold text-slate-900">
            CoFounder
          </span>
        </Link>

        {!updated ? (
          <>
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <LockKeyhole size={27} />
            </div>

            <h1 className="text-2xl font-bold text-slate-900">
              Create a new password
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Choose a strong password for your account.
            </p>

            <form onSubmit={handleSubmit} className="mt-7 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
                <p className="mt-2 text-xs text-slate-400">
                  Minimum 8 characters.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Confirm Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              {error && (
                <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700"
              >
                Reset Password
              </button>
            </form>
          </>
        ) : (
          <div className="py-5 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600">
              <CheckCircle size={34} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              Password updated!
            </h1>
            <p className="mt-3 text-sm text-slate-500">
              Your password has been updated successfully.
            </p>
            <Link
              to="/login"
              className="mt-6 inline-block rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700"
            >
              Go to Login
            </Link>
          </div>
        )}

        {!updated && (
          <Link
            to="/login"
            className="mt-7 block text-center text-sm font-semibold text-indigo-600 hover:text-indigo-700"
          >
            Back to Login
          </Link>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;