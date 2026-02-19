import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import LoginPage from './components/auth/LoginPage';
import AppLayout from './components/layout/AppLayout';
import DashboardPage from './components/dashboard/DashboardPage';
import CustomersPage from './components/customers/CustomersPage';
import UsersPage from './components/users/UsersPage';

function RequireAuth({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.token);
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function RequireAdmin({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user);
  if (user?.role !== 'ADMIN') return <Navigate to="/customers" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <RequireAuth>
              <AppLayout />
            </RequireAuth>
          }
        >
          <Route index element={<Navigate to="/customers" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route
            path="users"
            element={
              <RequireAdmin>
                <UsersPage />
              </RequireAdmin>
            }
          />
        </Route>
        <Route path="*" element={<Navigate to="/customers" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
