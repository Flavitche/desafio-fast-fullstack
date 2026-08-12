import { NavLink } from 'react-router-dom';
import { Users, CalendarDays, BarChart3 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function BrandMark({ size = 30 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill="#2E6CE0" />
      <path d="M6 14L14 7L26 17L18 24Z" fill="#FFFFFF" />
      <path d="M6 21L12 15L20 22L14 27Z" fill="#8FC7DE" />
    </svg>
  );
}

const links = [
  { to: '/colaboradores', label: 'Colaboradores', icon: Users },
  { to: '/workshops', label: 'Workshops', icon: CalendarDays },
  { to: '/dashboard', label: 'Dashboard', icon: BarChart3 },
];

export default function Sidebar() {
  const { usuario, logout } = useAuth();
  const iniciais = (usuario || 'A').slice(0, 2).toUpperCase();

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <BrandMark />
        <div className="sidebar-brand-text">
          Fast Workshops
          <span>Rastreamento de participação</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-foot">
        <div className="sidebar-user">
          <span className="sidebar-avatar">{iniciais}</span>
          {usuario || 'admin'}
        </div>
        <button className="sidebar-logout" onClick={logout}>
          Sair
        </button>
      </div>
    </aside>
  );
}