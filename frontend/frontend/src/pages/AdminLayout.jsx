import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Ticket, LayoutDashboard, List, MapPin, BarChart3, LogOut, Building2, Scale } from 'lucide-react';

function AdminLayout() {
  const { logout, user } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
    { path: '/admin/tickets', icon: List, label: 'Tickets' },
    { path: '/admin/municipios', icon: MapPin, label: 'Municipios' },
    { path: '/admin/niveles', icon: Building2, label: 'Niveles' },
    { path: '/admin/asuntos', icon: Scale, label: 'Asuntos' }
  ];

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-primary-800 text-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Ticket className="w-6 h-6" />
              <span className="font-bold text-lg">Panel de Administración</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-primary-200">Bienvenido, {user?.usuario}</span>
              <button onClick={handleLogout} className="flex items-center gap-1 text-sm hover:text-primary-200">
                <LogOut className="w-4 h-4" />
                Salir
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        <aside className="w-64 bg-white shadow-md min-h-screen">
          <div className="p-4">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const isActive = item.exact 
                  ? location.pathname === item.path 
                  : location.pathname.startsWith(item.path);
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-primary-100 text-primary-800 font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>

        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
