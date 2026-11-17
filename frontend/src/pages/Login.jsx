import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Eye, EyeOff, ArrowLeft } from 'lucide-react';

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    setMessage('Login will be connected to the backend soon.');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-5 py-10">

      <div className="w-full max-w-md">

        <Link
          to="/"
          className="mb-8 flex items-center justify-center gap-2 text-2xl font-extrabold text-indigo-600"
        >
          <Rocket size={27} />
          CoFounder
        </Link>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50">

          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600"
          >
            <ArrowLeft size={16} />
            Back to home
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">
              Welcome back!
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Sign in to discover people and build something great.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Email address
              </label>

              <input
                type="email"
                placeholder="you@example.com"
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <div className="mb-2 flex justify-between">
                <label className="text-sm font-semibold text-slate-700">
                  Password
                </label>

                <span className="text-xs text-slate-400">
                  Forgot password? Coming soon
                </span>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  required
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 pr-12 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-4 -translate-y-1/2 text-slate-400 hover:text-indigo-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700"
            >
              Sign In
            </button>

            {message && (
              <p className="rounded-lg bg-indigo-50 p-3 text-center text-sm text-indigo-700">
                {message}
              </p>
            )}

          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-200"></div>
            <span className="text-xs text-slate-400">OR</span>
            <div className="h-px flex-1 bg-slate-200"></div>
          </div>

          <button
            type="button"
            disabled
            className="w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-50 py-3 text-sm font-semibold text-slate-400"
          >
            Continue with Google · Coming soon
          </button>

          <p className="mt-7 text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <Link to="/signup" className="font-bold text-indigo-600 hover:text-indigo-700">
              Create account
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Login;
