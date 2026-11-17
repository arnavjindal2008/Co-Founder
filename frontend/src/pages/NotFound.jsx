import { Link } from 'react-router-dom';
import { Rocket, ArrowLeft, SearchX } from 'lucide-react';

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-lg text-center">
        <Link to="/" className="mb-10 inline-flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
            <Rocket size={21} />
          </div>
          <span className="text-xl font-bold text-slate-900">
            CoFounder
          </span>
        </Link>

        <div className="mb-6 flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
            <SearchX size={48} />
          </div>
        </div>

        <h1 className="text-7xl font-extrabold tracking-tight text-indigo-600">
          404
        </h1>

        <h2 className="mt-5 text-2xl font-bold text-slate-900">
          Page not found
        </h2>

        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500">
          Sorry, the page you are looking for doesn't exist or may
          have been moved. Let's get you back on track.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            <ArrowLeft size={17} />
            Back to Home
          </Link>

          <Link
            to="/dashboard"
            className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;