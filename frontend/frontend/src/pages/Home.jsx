import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ticketService, catalogService } from '../services/api';
import { Ticket, Search, Download } from 'lucide-react';

function Home() {
  const [formData, setFormData] = useState({
    nombre: '',
    paterno: '',
    materno: '',
    curp: '',
    telefono: '',
    correo: '',
    municipioId: '',
    nivelId: '',
    asuntoId: ''
  });
  const [searchData, setSearchData] = useState({ curp: '', turno: '' });
  const [searchedTicket, setSearchedTicket] = useState(null);
  const [municipios, setMunicipios] = useState([]);
  const [niveles, setNiveles] = useState([]);
  const [asuntos, setAsuntos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadCatalogs();
  }, []);

  const loadCatalogs = async () => {
    try {
      const [munRes, nivRes, asuRes] = await Promise.all([
        catalogService.getAll('municipio'),
        catalogService.getAll('nivel'),
        catalogService.getAll('asunto')
      ]);
      setMunicipios(munRes.data);
      setNiveles(nivRes.data);
      setAsuntos(asuRes.data);
    } catch (error) {
      console.error('Error cargando catálogos');
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await ticketService.create(formData);
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ticket_turno.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      setMessage({ type: 'success', text: 'Ticket generado y descargado exitosamente' });
      setFormData({
        nombre: '',
        paterno: '',
        materno: '',
        curp: '',
        telefono: '',
        correo: '',
        municipioId: '',
        nivelId: '',
        asuntoId: ''
      });
    } catch (error) {
      console.error('Error:', error);
      setMessage({ type: 'error', text: error.response?.data?.error || 'Error al generar ticket' });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchData.curp || !searchData.turno) {
      setMessage({ type: 'error', text: 'Ingresa CURP y número de turno' });
      return;
    }

    try {
      const response = await ticketService.search(searchData);
      setSearchedTicket(response.data);
      setMessage({ type: '', text: '' });
    } catch (error) {
      setSearchedTicket(null);
      setMessage({ type: 'error', text: 'Ticket no encontrado' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      <header className="bg-primary-800 text-white py-6 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-3">
            <Ticket className="w-8 h-8" />
            <h1 className="text-3xl font-bold">Ticket de Turno</h1>
          </div>
          <p className="text-center mt-2 text-primary-200">Sistema de Gestión de Turnos</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="card">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Ticket className="w-5 h-5 text-primary-600" />
              Solicitar Ticket
            </h2>

            {message.text && (
              <div className={`p-4 rounded-lg mb-4 ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                  <input type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} className="input-field" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Paterno</label>
                  <input type="text" name="paterno" value={formData.paterno} onChange={handleInputChange} className="input-field" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Materno</label>
                  <input type="text" name="materno" value={formData.materno} onChange={handleInputChange} className="input-field" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CURP</label>
                  <input type="text" name="curp" value={formData.curp} onChange={handleInputChange} maxLength={18} className="input-field uppercase" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <input type="tel" name="telefono" value={formData.telefono} onChange={handleInputChange} className="input-field" required />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Correo</label>
                <input type="email" name="correo" value={formData.correo} onChange={handleInputChange} className="input-field" required />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Municipio</label>
                  <select name="municipioId" value={formData.municipioId} onChange={handleInputChange} className="select-field" required>
                    <option value="">Seleccionar</option>
                    {municipios.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nivel</label>
                  <select name="nivelId" value={formData.nivelId} onChange={handleInputChange} className="select-field" required>
                    <option value="">Seleccionar</option>
                    {niveles.map(n => <option key={n.id} value={n.id}>{n.nombre}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Asunto</label>
                  <select name="asuntoId" value={formData.asuntoId} onChange={handleInputChange} className="select-field" required>
                    <option value="">Seleccionar</option>
                    {asuntos.map(a => <option key={a.id} value={a.id}>{a.nombre}</option>)}
                  </select>
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                {loading ? 'Generando...' : <><Ticket className="w-4 h-4" /> Generar Ticket y Descargar PDF</>}
              </button>
            </form>
          </div>

          <div className="card">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Search className="w-5 h-5 text-primary-600" />
              Consultar Ticket
            </h2>

            <form onSubmit={handleSearch} className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CURP</label>
                <input type="text" name="curp" value={searchData.curp} onChange={(e) => setSearchData({ ...searchData, curp: e.target.value })} className="input-field uppercase" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Número de Turno</label>
                <input type="number" name="turno" value={searchData.turno} onChange={(e) => setSearchData({ ...searchData, turno: e.target.value })} className="input-field" required />
              </div>
              <button type="submit" className="btn-secondary w-full flex items-center justify-center gap-2">
                <Search className="w-4 h-4" /> Buscar
              </button>
            </form>

            {searchedTicket && (
              <div className="bg-primary-50 rounded-lg p-4 border border-primary-200">
                <div className="text-center mb-4">
                  <span className="text-4xl font-bold text-primary-600">#{searchedTicket.turno}</span>
                </div>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Nombre:</span> {searchedTicket.nombre} {searchedTicket.paterno} {searchedTicket.materno}</p>
                  <p><span className="font-medium">Municipio:</span> {searchedTicket.municipio?.nombre}</p>
                  <p><span className="font-medium">Estatus:</span> 
                    <span className={`ml-2 px-2 py-1 rounded text-xs ${searchedTicket.estatus === 'RESUELTO' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {searchedTicket.estatus}
                    </span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="text-center mt-8">
          <Link to="/login" className="text-primary-600 hover:text-primary-800 font-medium">
            Acceso Administrador
          </Link>
        </div>
      </main>
    </div>
  );
}

export default Home;
