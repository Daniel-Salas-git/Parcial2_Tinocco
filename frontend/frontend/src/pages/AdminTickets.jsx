import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import TicketTable from '../components/TicketTable';
import { Search, RefreshCw } from 'lucide-react';

export default function AdminTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    curp: '',
    nombre: '',
    municipioId: '',
    estatus: ''
  });
  const [municipios, setMunicipios] = useState([]);
  const [modalEdit, setModalEdit] = useState(false);
  const [ticketSeleccionado, setTicketSeleccionado] = useState(null);
  const [formEdit, setFormEdit] = useState({});

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [ticketsRes, munRes] = await Promise.all([
        fetch('/api/tickets', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }).then(r => r.json()),
        fetch('/api/catalogs/municipios').then(r => r.json())
      ]);
      setTickets(ticketsRes);
      setMunicipios(munRes);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const buscar = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filtros.curp) params.append('curp', filtros.curp);
      if (filtros.nombre) params.append('nombre', filtros.nombre);

      const response = await fetch(`/api/tickets/buscar?${params}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setTickets(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const abrirEditar = (ticket) => {
    setTicketSeleccionado(ticket);
    setFormEdit({
      nombre: ticket.nombre,
      paterno: ticket.paterno,
      materno: ticket.materno,
      telefono: ticket.telefono,
      correo: ticket.correo
    });
    setModalEdit(true);
  };

  const guardarEdicion = async () => {
    try {
      await fetch(`/api/tickets/${ticketSeleccionado.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formEdit)
      });
      setModalEdit(false);
      cargarDatos();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const eliminar = async (id) => {
    if (!window.confirm('¿Eliminar este ticket?')) return;
    try {
      await fetch(`/api/tickets/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      cargarDatos();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const cambiarEstatus = async (ticket) => {
    const nuevoEstatus = ticket.estatus === 'Resuelto' ? 'Pendiente' : 'Resuelto';
    try {
      await fetch(`/api/tickets/${ticket.id}/estatus`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ estatus: nuevoEstatus })
      });
      cargarDatos();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Gestión de Tickets</h1>
          <button onClick={cargarDatos} className="btn-secondary flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Actualizar
          </button>
        </div>

        {/* Filtros */}
        <div className="card mb-6">
          <form onSubmit={buscar} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <input
                type="text"
                placeholder="Buscar por CURP"
                value={filtros.curp}
                onChange={(e) => setFiltros({ ...filtros, curp: e.target.value })}
                className="input-field uppercase"
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Buscar por nombre"
                value={filtros.nombre}
                onChange={(e) => setFiltros({ ...filtros, nombre: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <select
                value={filtros.estatus}
                onChange={(e) => setFiltros({ ...filtros, estatus: e.target.value })}
                className="select-field"
              >
                <option value="">Todos los estatus</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Resuelto">Resuelto</option>
              </select>
            </div>
            <button type="submit" className="btn-primary flex items-center justify-center gap-2">
              <Search className="w-4 h-4" />
              Buscar
            </button>
          </form>
        </div>

        {/* Tabla */}
        <div className="card">
          {loading ? (
            <div className="text-center py-8">Cargando...</div>
          ) : (
            <TicketTable
              tickets={tickets}
              onEdit={abrirEditar}
              onDelete={eliminar}
              onToggleEstatus={cambiarEstatus}
            />
          )}
        </div>
      </main>

      {/* Modal Editar */}
      {modalEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Editar Ticket #{ticketSeleccionado.turno}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                  type="text"
                  value={formEdit.nombre}
                  onChange={(e) => setFormEdit({ ...formEdit, nombre: e.target.value })}
                  className="input-field"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Paterno</label>
                  <input
                    type="text"
                    value={formEdit.paterno}
                    onChange={(e) => setFormEdit({ ...formEdit, paterno: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Materno</label>
                  <input
                    type="text"
                    value={formEdit.materno}
                    onChange={(e) => setFormEdit({ ...formEdit, materno: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <input
                    type="text"
                    value={formEdit.telefono}
                    onChange={(e) => setFormEdit({ ...formEdit, telefono: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Correo</label>
                  <input
                    type="email"
                    value={formEdit.correo}
                    onChange={(e) => setFormEdit({ ...formEdit, correo: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setModalEdit(false)} className="btn-secondary">Cancelar</button>
              <button onClick={guardarEdicion} className="btn-primary">Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
