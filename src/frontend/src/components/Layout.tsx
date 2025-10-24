import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Map, ImageIcon, BarChart3 } from 'lucide-react';

export default function Layout() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gradient-to-r from-purple-700 to-indigo-800 text-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-3 hover:opacity-90 transition-opacity">
              <Map className="w-8 h-8" />
              <span className="text-xl font-bold">D&D Map Editor</span>
            </Link>
            
            <nav className="flex space-x-1">
              <NavLink to="/" icon={<Home className="w-5 h-5" />} label="Kezdőlap" active={location.pathname === '/'} />
              <NavLink to="/editor" icon={<Map className="w-5 h-5" />} label="Szerkesztő" active={isActive('/editor')} />
              <NavLink to="/gallery" icon={<ImageIcon className="w-5 h-5" />} label="Galéria" active={isActive('/gallery')} />
              <NavLink to="/stats" icon={<BarChart3 className="w-5 h-5" />} label="Statisztikák" active={isActive('/stats')} />
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-gray-800 text-gray-300 py-4">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>&copy; 2025 D&D Map Editor. Készítette: Dragon Group</p>
        </div>
      </footer>
    </div>
  );
}

interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}

function NavLink({ to, icon, label, active }: NavLinkProps) {
  return (
    <Link
      to={to}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
        active
          ? 'bg-white/20 font-semibold'
          : 'hover:bg-white/10'
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
