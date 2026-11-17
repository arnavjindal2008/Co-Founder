import { Link } from 'react-router-dom';
import {
  Users,
  Rocket,
  Target,
  MessageCircle,
  Search,
  Handshake,
  ArrowRight,
  CheckCircle,
  Code,
  Palette,
  Lightbulb
} from 'lucide-react';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function Landing() {
  const features = [
    {
      icon: Users,
      title: 'Find Co-founders',
      description: 'Discover people with complementary skills and shared ambitions.',
      color: 'bg-indigo-100 text-indigo-600'
    },
    {
      icon: Rocket,
      title: 'Launch Projects',
      description: 'Create your startup idea and find people interested in joining.',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: Target,
      title: 'Skill-based Matching',
      description: 'Discover potential partners based on skills, interests and goals.',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      icon: MessageCircle,
      title: 'Real-time Chat',
      description: 'Connect and communicate with potential co-founders directly.',
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: Search,
      title: 'Explore Opportunities',
      description: 'Discover projects looking for your skills and experience.',
      color: 'bg-orange-100 text-orange-600'
    },
    {
      icon: Handshake,
      title: 'Build Teams',
      description: 'Turn connections into teams and start building together.',
      color: 'bg-pink-100 text-pink-600'
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Create your profile',
      description: 'Share your skills, interests, experience and what you want to build.'
    },
    {
      number: '02',
      title: 'Discover people and projects',
      description: 'Explore founders and projects that match your goals.'
    },
    {
      number: '03',
      title: 'Connect and build',
      description: 'Start conversations, form teams and bring ideas to life.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* HERO SECTION */}
      <section className="overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-24 md:grid-cols-2 md:py-32">

          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-4 py-2 text-sm font-medium text-indigo-700 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-green-500"></span>
              Your next big idea starts here
            </div>

            <h1 className="text-4xl leading-tight font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Great ideas need
              <span className="block text-indigo-600">
                great people.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Find the right co-founder, discover exciting projects and build
              something meaningful together. Your next teammate could be one
              connection away.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-7 py-3.5 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700"
              >
                Get Started
                <ArrowRight size={19} />
              </Link>

              <a
                href="#how-it-works"
                className="rounded-xl border border-slate-200 bg-white px-7 py-3.5 font-semibold text-slate-700 transition hover:border-indigo-300 hover:text-indigo-600"
              >
                Learn More
              </a>
            </div>

            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-600">
              <span className="flex items-center gap-2">
                <CheckCircle size={17} className="text-green-600" />
                Find complementary skills
              </span>

              <span className="flex items-center gap-2">
                <CheckCircle size={17} className="text-green-600" />
                Build meaningful teams
              </span>
            </div>
          </div>

          {/* HERO VISUAL */}
          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute inset-0 rounded-full bg-indigo-200/50 blur-3xl"></div>

            <div className="relative rounded-3xl border border-white bg-white p-7 shadow-2xl shadow-indigo-100">

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Your next connection
                  </p>
                  <h3 className="mt-1 text-xl font-bold text-slate-900">
                    Build together
                  </h3>
                </div>

                <div className="rounded-xl bg-indigo-100 p-3 text-indigo-600">
                  <Users size={25} />
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4">
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-indigo-200 text-lg font-bold text-indigo-700">
                    D
                  </div>

                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900">
                      Product Designer
                    </h4>
                    <p className="text-sm text-slate-500">
                      UI/UX · Product Strategy
                    </p>
                  </div>

                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    Match
                  </span>
                </div>

                <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4">
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-purple-200 text-lg font-bold text-purple-700">
                    A
                  </div>

                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900">
                      Software Developer
                    </h4>
                    <p className="text-sm text-slate-500">
                      React · Node.js
                    </p>
                  </div>

                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    Match
                  </span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-4 text-white">
                <Handshake size={20} />
                <span className="font-semibold">
                  Start building together
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-24">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="text-sm font-bold tracking-widest text-indigo-600 uppercase">
            What we offer
          </p>

          <h2 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl">
            Everything you need to build your team
          </h2>

          <p className="mt-4 leading-7 text-slate-600">
            From discovering the right people to building your startup team,
            CoFounder brings the process together in one place.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="rounded-2xl border border-slate-100 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className={`mb-5 grid h-12 w-12 place-items-center rounded-xl ${feature.color}`}>
                  <Icon size={24} />
                </div>

                <h3 className="text-lg font-bold text-slate-900">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="text-sm font-bold tracking-widest text-indigo-600 uppercase">
              Simple process
            </p>

            <h2 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl">
              How CoFounder works
            </h2>

            <p className="mt-4 text-slate-600">
              Three simple steps to turn an idea into a team.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.number}
                className="rounded-2xl bg-white p-8 shadow-sm"
              >
                <span className="text-4xl font-extrabold text-indigo-200">
                  {step.number}
                </span>

                <h3 className="mt-5 text-xl font-bold text-slate-900">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-5xl rounded-3xl bg-indigo-600 px-8 py-16 text-center shadow-xl shadow-indigo-200 sm:px-16">
          <div className="mx-auto mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-white/15 text-white">
            <Lightbulb size={28} />
          </div>

          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Your idea deserves the right team.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-indigo-100">
            Meet people who share your ambition, bring different skills and
            are ready to build something meaningful.
          </p>

          <Link
            to="/signup"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 font-bold text-indigo-700 transition hover:bg-indigo-50"
          >
            Create Your Account
            <ArrowRight size={19} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Landing;
