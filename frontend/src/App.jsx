import { Routes, Route } from 'react-router-dom';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import DiscoverPeople from './pages/DiscoverPeople';
import DiscoverProjects from './pages/DiscoverProjects';
import Profile from './pages/Profile';


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
    </Routes>
  );
}

export default App;
