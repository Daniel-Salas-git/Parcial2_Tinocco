import { useState } from 'react';
import { Search, Edit } from 'lucide-react';

export default function ModifyForm() {
  const [formData, setFormData] = useState({
    curp: '',
    turno: '',
    nombre: '',
    telefono: '',
    correo: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [ticketEncontrado, setTicketEncontrado] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const buscarTicket = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    setTicketEncontrado(null);

    try {
      const response = await fetch(`/api/tickets/modificar?curp=${formData.curp}&turno=${formData.turno}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Ticket no encontrado');
      }

      setTicketEncontrado(data);
      setFormData({
        ...formData,
        nombre: data.nombre,
        telefono: data.telefono,
        correo: data.correo
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const modificarTicket = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/tickets/modificar', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Error al modificar');
      }

      setSuccess('Ticket modificado exitosamente');
      setTicketEncontrado(null);
      setFormData({ curp: '', turno: '', nombre: '', telefono: '', correo: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Edit className="w-5 h-5 text-primary-600" />
        Modificar Mi Ticket
      </h3>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4">
          {success}
        </div>
      )}

      {!ticketEncontrado ? (
        <form onSubmit={buscarTicket} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CURP</label>
              <input
                type="text"
                name="curp"
                value={formData.curp}
                onChange={handleChange}
                maxLength={18}
                className="input-field uppercase"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Número de Turno</label>
              <input
                type="number"
                name="turno"
                value={formData.turno}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
          </div>
          <button type="submit" className="btn-secondary w-full flex items-center justify-center gap-2">
            <Search className="w-4 h-4" />
            Buscar Ticket
          </button>
        </form>
      ) : (
        <form onSubmit={modificarTicket} className="space-y-4">
          <div className="bg-primary-50 p-4 rounded-lg mb-4">
            <p className="text-sm text-gray-600">Ticket encontrado: <span className="font-bold text-primary-600">#{ticketEncontrado.turno}</span></p>
            <p className="text-sm text-gray-600">Solicitante: {ticketEncontrado.nombre} {ticketEncontrado.paterno}</p>
            <p className="text-sm text-gray-600">Municipio: {ticketEncontrado.municipio?.nombre}</p>
            <p className="text-sm text-gray-600">Estatus: <span className={`font-bold ${ticketEncontrado.estatus === 'Resuelto' ? 'text-green-600' : 'text-yellow-600'}`}>{ticketEncontrado.estatus}</span></p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Correo</label>
              <input
                type="email"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                className="input-field"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={() => setTicketEncontrado(null)} className="btn-secondary flex-1">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
