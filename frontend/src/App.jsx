import { Routes, Route } from 'react-router-dom';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import DiscoverPeople from './pages/DiscoverPeople';
import DiscoverProjects from './pages/DiscoverProjects';
import Profile from './pages/Profile';
import Connections from './pages/Connections';
import ProjectDetails from './pages/ProjectDetails';
import CreateProject from './pages/CreateProject';
import Applications from './pages/Applications';
import Settings from './pages/Settings';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/discover-people" element={<DiscoverPeople />} />
      <Route path="/discover-projects" element={<DiscoverProjects />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/connections" element={<Connections />} />
      <Route path="/project-details" element={<ProjectDetails />} />
      <Route path="/create-project" element={<CreateProject />} />
      <Route path="/applications" element={<Applications />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
}

export default App;
