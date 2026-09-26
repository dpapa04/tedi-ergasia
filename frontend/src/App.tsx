import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { Nav } from './components/Nav';
import { Welcome } from './screens/Welcome';
import { Login } from './screens/Login';
import { Register } from './screens/Register';
import { Browse } from './screens/Browse';
import { EventDetail } from './screens/EventDetail';
import { Confirmation } from './screens/Confirmation';
import { Dashboard } from './screens/Dashboard';
import { CreateEvent } from './screens/CreateEvent';
import { AdminUsers } from './screens/AdminUsers';
import { Messages } from './screens/Messages';
import { useApp } from './state/AppContext';

/** Authenticated screens share the sticky Nav via this layout route. */
function AppLayout() {
  return (
    <div style={{ minHeight: '100vh', width: '100%', background: 'var(--paper)', overflowX: 'hidden' }}>
      <Nav />
      <Outlet />
    </div>
  );
}

function RequireRole({ roles }: { roles: string[] }) {
  const { role } = useApp();
  return roles.includes(role) ? <Outlet /> : <Navigate to="/browse" replace />;
}

export function App() {
  return (
    <Routes>
      {/* Pre-auth screens — no nav */}
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Authenticated app — with nav */}
      <Route element={<AppLayout />}>
        <Route path="/browse" element={<Browse />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route element={<RequireRole roles={['participant', 'organizer', 'admin']} />}>
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="/messages" element={<Messages />} />
        </Route>
        <Route element={<RequireRole roles={['organizer']} />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create" element={<CreateEvent />} />
        </Route>
        <Route element={<RequireRole roles={['admin']} />}>
          <Route path="/admin" element={<AdminUsers />} />
        </Route>
      </Route>
    </Routes>
  );
}
