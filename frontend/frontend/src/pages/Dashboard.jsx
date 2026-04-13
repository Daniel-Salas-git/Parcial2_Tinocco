import { useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import Navbar from '../components/Navbar';
import { TrendingUp, Clock, CheckCircle, Building2 } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function Dashboard() {
  const [stats, setStats] = useState({ pendientes: 0, resueltos: 0, total: 0, porMunicipio: [] });
  const [municipios, setMunicipios] = useState([]);
  const [municipioSeleccionado, setMunicipioSeleccionado] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, [municipioSeleccionado]);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const params = municipioSeleccionado ? `?municipioId=${municipioSeleccionado}` : '';
      const [statsRes, munRes] = await Promise.all([
        fetch(`/api/stats${params}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }).then(r => r.json()),
        fetch('/api/catalogs/municipios').then(r => r.json())
      ]);
      setStats(statsRes);
      setMunicipios(munRes);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const chartDataPie = {
    labels: ['Pendientes', 'Resueltos'],
    datasets: [{
      data: [stats.pendientes, stats.resueltos],
      backgroundColor: ['#f59e0b', '#10b981'],
      borderColor: ['#d97706', '#059669'],
      borderWidth: 2
    }]
  };

  const chartDataBar = {
    labels: stats.porMunicipio.map(m => m.municipio),
    datasets: [
      {
        label: 'Pendientes',
        data: stats.porMunicipio.map(m => m.pendientes),
        backgroundColor: '#f59e0b'
      },
      {
        label: 'Resueltos',
        data: stats.porMunicipio.map(m => m.resueltos),
        backgroundColor: '#10b981'
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

        {/* Filtro */}
        <div className="card mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filtrar por municipio
          </label>
          <select
            value={municipioSeleccionado}
            onChange={(e) => setMunicipioSeleccionado(e.target.value)}
            className="select-field max-w-xs"
          >
            <option value="">Todos los municipios</option>
            {municipios.map((m) => (
              <option key={m.id} value={m.id}>{m.nombre}</option>
            ))}
          </select>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total</p>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
              <TrendingUp className="w-10 h-10 text-blue-200" />
            </div>
          </div>
          <div className="card bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm">Pendientes</p>
                <p className="text-3xl font-bold">{stats.pendientes}</p>
              </div>
              <Clock className="w-10 h-10 text-yellow-200" />
            </div>
          </div>
          <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Resueltos</p>
                <p className="text-3xl font-bold">{stats.resueltos}</p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-200" />
            </div>
          </div>
          <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Municipios</p>
                <p className="text-3xl font-bold">{municipios.length}</p>
              </div>
              <Building2 className="w-10 h-10 text-purple-200" />
            </div>
          </div>
        </div>

        {/* Gráficas */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Estado de Tickets</h2>
            <div className="h-64 flex items-center justify-center">
              {loading ? (
                <p>Cargando...</p>
              ) : (
                <Pie 
                  data={chartDataPie} 
                  options={{ 
                    maintainAspectRatio: false,
                    responsive: true,
                    plugins: { legend: { position: 'bottom' } }
                  }} 
                />
              )}
            </div>
          </div>
          <div className="card">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Tickets por Municipio</h2>
            <div className="h-64">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <p>Cargando...</p>
                </div>
              ) : (
                <Bar 
                  data={chartDataBar} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: { y: { beginAtZero: true } },
                    plugins: { legend: { position: 'bottom' } }
                  }} 
                />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
