import { useState, useEffect } from 'react';
import { ticketService, catalogService } from '../services/api';
import { Search, Edit2, Trash2, Download, Eye } from 'lucide-react';

function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [search, setSearch] = useState({ curp: '', nombre: '', municipioId: '', estatus: '' });
  const [editModal, setEditModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [ticketsRes, munRes] = await Promise.all([
        ticketService.getAll(search),
        catalogService.getAll('municipio')
      ]);
      setTickets(ticketsRes.data);
      setMunicipios(munRes.data);
    } catch (error) {
      console.error('Error cargando datos');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadData();
  };

  const handleEdit = (ticket) => {
    setSelectedTicket(ticket);
    setFormData({
      nombre: ticket.nombre,
      paterno: ticket.paterno,
      materno: ticket.materno,
      curp: ticket.curp,
      telefono: ticket.telefono,
      correo: ticket.correo,
      municipioId: ticket.municipioId,
      nivelId: ticket.nivelId,
      asuntoId: ticket.asuntoId,
      estatus: ticket.estatus
    });
    setEditModal(true);
  };

  const handleUpdate = async () => {
    try {
      await ticketService.update(selectedTicket.id, formData);
      setEditModal(false);
      loadData();
    } catch (error) {
      console.error('Error actualizando');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este ticket?')) return;
    try {
      await ticketService.delete(id);
      loadData();
    } catch (error) {
      console.error('Error eliminando');
    }
  };

  const downloadPDF = async (ticket) => {
    try {
      const response = await ticketService.getById(ticket.id);
      const pdfTicket = response.data;
      const blob = new Blob([pdfTicket], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ticket_${ticket.turno}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      alert('Error descargando PDF');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Gestión de Tickets</h1>

      <div className="card mb-6">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Buscar por CURP"
            value={search.curp}
            onChange={(e) => setSearch({ ...search, curp: e.target.value })}
            className="input-field"
          />
          <input
            type="text"
            placeholder="Buscar por nombre"
            value={search.nombre}
            onChange={(e) => setSearch({ ...search, nombre: e.target.value })}
            className="input-field"
          />
          <select
            value={search.municipioId}
            onChange={(e) => setSearch({ ...search, municipioId: e.target.value })}
            className="select-field"
          >
            <option value="">Todos los municipios</option>
            {municipios.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
          </select>
          <select
            value={search.estatus}
            onChange={(e) => setSearch({ ...search, estatus: e.target.value })}
            className="select-field"
          >
            <option value="">Todos los estatus</option>
            <option value="PENDIENTE">Pendiente</option>
            <option value="RESUELTO">Resuelto</option>
          </select>
          <button type="submit" className="btn-primary flex items-center gap-2 justify-center">
            <Search className="w-4 h-4" /> Buscar
          </button>
        </form>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Turno</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">CURP</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Municipio</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estatus</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-bold text-primary-600">#{ticket.turno}</td>
                  <td className="px-4 py-3">{ticket.nombre} {ticket.paterno}</td>
                  <td className="px-4 py-3 uppercase text-sm">{ticket.curp}</td>
                  <td className="px-4 py-3">{ticket.municipio?.nombre}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs ${ticket.estatus === 'RESUELTO' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {ticket.estatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">{new Date(ticket.fecha).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(ticket)} className="p-1 text-blue-600 hover:bg-blue-100 rounded">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(ticket.id)} className="p-1 text-red-600 hover:bg-red-100 rounded">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Editar Ticket #{selectedTicket.turno}</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input type="text" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Paterno</label>
                <input type="text" value={formData.paterno} onChange={(e) => setFormData({ ...formData, paterno: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estatus</label>
                <select value={formData.estatus} onChange={(e) => setFormData({ ...formData, estatus: e.target.value })} className="select-field">
                  <option value="PENDIENTE">Pendiente</option>
                  <option value="RESUELTO">Resuelto</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setEditModal(false)} className="btn-secondary">Cancelar</button>
              <button onClick={handleUpdate} className="btn-primary">Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tickets;
