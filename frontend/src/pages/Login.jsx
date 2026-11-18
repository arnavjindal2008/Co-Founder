import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Rocket, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Login failed');
        return;
      }

      // Save user and token in AuthContext
      login(data.user, data.token);

      // Redirect to dashboard
      navigate('/dashboard');

    } catch (error) {
      console.error('Login error:', error);
      setError('Unable to connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg">

        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-9">
          <Rocket size={29} className="text-violet-600" />
          <span className="text-3xl font-bold text-violet-600">
            CoFounder
          </span>
        </Link>

        {/* Login Card */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 sm:p-9">

          <Link
            to="/"
            className="flex items-center gap-2 text-slate-500 hover:text-violet-600 mb-8"
          >
            <ArrowLeft size={18} />
            Back to home
          </Link>

          <h1 className="text-3xl font-bold text-slate-900 mb-3">
            Welcome back!
          </h1>

          <p className="text-slate-500 mb-9">
            Sign in to discover people and build something great.
          </p>

          <form onSubmit={handleLogin} className="space-y-6">

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email address
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-slate-700">
                  Password
                </label>

                <Link
                  to="/forgot-password"
                  className="text-sm text-slate-400 hover:text-violet-600"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 pr-12 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 text-sm">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white font-semibold py-4 rounded-lg transition"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

          </form>

          <div className="text-center mt-8">
            <p className="text-slate-500">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="font-semibold text-violet-600 hover:text-violet-700"
              >
                Create account
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
