import { Link } from 'react-router-dom';

function Landing() {
  return (
    <div className="landing-page">
      <nav className="navbar">
        <h2>Co-founder</h2>

        <div className="nav-links">
          <Link to="/login">Login</Link>
          <Link to="/signup" className="nav-button">
            Get Started
          </Link>
        </div>
      </nav>

      <section className="hero">
        <p className="hero-tag">BUILD SOMETHING GREAT TOGETHER</p>

        <h1>
          Find your perfect
          <span> co-founder.</span>
        </h1>

        <p className="hero-description">
          Great ideas need great teams. Discover talented people,
          connect with potential co-founders and build your startup together.
        </p>

        <div className="hero-buttons">
          <Link to="/signup" className="primary-button">
            Get Started
          </Link>

          <Link to="/login" className="secondary-button">
            Login
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Landing;