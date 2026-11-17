import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Mail, ArrowLeft, CheckCircle } from 'lucide-react';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();

    if (!email.trim()) return;

    setSubmitted(true);
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

        {!submitted ? (
          <>
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <Mail size={27} />
            </div>

            <h1 className="text-2xl font-bold text-slate-900">
              Forgot your password?
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              No worries! Enter your registered email address and
              we'll send you instructions to reset your password.
            </p>

            <form onSubmit={handleSubmit} className="mt-7 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700"
              >
                Send Reset Instructions
              </button>
            </form>
          </>
        ) : (
          <div className="py-5 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600">
              <CheckCircle size={34} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              Check your email
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              If an account exists for <strong>{email}</strong>,
              you will receive password reset instructions.
            </p>
          </div>
        )}

        <Link
          to="/login"
          className="mt-7 flex items-center justify-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
        >
          <ArrowLeft size={16} />
          Back to Login
        </Link>
      </div>
    </div>
  );
}

export default ForgotPassword;