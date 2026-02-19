import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const navItems = [
  { to: '/dashboard', label: 'דשבורד', icon: '📊' },
  { to: '/customers', label: 'לקוחות', icon: '👥' },
];

const adminItems = [
  { to: '/users', label: 'משתמשים', icon: '⚙️' },
];

export default function Sidebar() {
  const user = useAuthStore((s) => s.user);

  return (
    <nav className="w-56 bg-white border-l border-gray-200 flex flex-col shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-lg font-bold text-blue-700">CRM גבייה</h1>
      </div>

      <ul className="flex-1 p-3 space-y-1">
        {navItems.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          </li>
        ))}

        {user?.role === 'ADMIN' &&
          adminItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`
                }
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
      </ul>

      <div className="p-3 border-t border-gray-200 text-xs text-gray-500">
        <p className="font-medium text-gray-700">{user?.fullName}</p>
        <p>{user?.role === 'ADMIN' ? 'מנהל' : 'גובה'}</p>
      </div>
    </nav>
  );
}
