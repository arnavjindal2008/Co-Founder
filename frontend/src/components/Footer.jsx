
import { Link } from 'react-router-dom';
import { Rocket } from 'lucide-react';

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 py-10 md:flex-row">

        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-extrabold text-indigo-600"
        >
          <Rocket size={23} />
          CoFounder
        </Link>

        <p className="text-center text-sm text-slate-500">
          Find your people. Build your vision.
        </p>

        <p className="text-sm text-slate-400">
          © {new Date().getFullYear()} CoFounder. All rights reserved.
        </p>

      </div>
    </footer>
  );
}

export default Footer;
