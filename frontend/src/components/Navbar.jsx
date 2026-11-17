
import { Link } from 'react-router-dom';
import { Rocket, Menu } from 'lucide-react';

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        <Link to="/" className="flex items-center gap-2 text-2xl font-extrabold text-indigo-600">
          <Rocket size={26} />
          CoFounder
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <a href="#features" className="text-sm font-medium text-slate-600 hover:text-indigo-600">
            Features
          </a>

          <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-indigo-600">
            How It Works
          </a>

          <Link to="/login" className="text-sm font-semibold text-slate-700 hover:text-indigo-600">
            Login
          </Link>

          <Link
            to="/signup"
            className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Get Started
          </Link>
        </div>

        <Link to="/signup" className="rounded-lg bg-indigo-600 p-2.5 text-white md:hidden">
          <Menu size={21} />
        </Link>

      </div>
    </nav>
  );
}

export default Navbar;