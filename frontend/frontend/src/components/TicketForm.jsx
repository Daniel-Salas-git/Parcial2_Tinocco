import { useState, useEffect } from 'react';
import { ticketService } from '../services/api';
import { Ticket } from 'lucide-react';

export default function TicketForm({ onSuccess }) {
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
  const [catalogos, setCatalogos] = useState({ municipios: [], niveles: [], asuntos: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarCatalogos();
  }, []);

  const cargarCatalogos = async () => {
    try {
      const [munRes, nivRes, asuRes] = await Promise.all([
        ticketService.obtenerCatalogos('municipios'),
        ticketService.obtenerCatalogos('niveles'),
        ticketService.obtenerCatalogos('asuntos')
      ]);
      setCatalogos({
        municipios: munRes.data,
        niveles: nivRes.data,
        asuntos: asuRes.data
      });
    } catch (err) {
      setError('Error al cargar catálogos');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await ticketService.crear(formData);
      
      // Descargar PDF
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ticket_turno.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      // Limpiar formulario
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

      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al generar ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre(s)</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Apellido Paterno</label>
          <input
            type="text"
            name="paterno"
            value={formData.paterno}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Apellido Materno</label>
          <input
            type="text"
            name="materno"
            value={formData.materno}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>
      </div>

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
          <span className="text-xs text-gray-500">{formData.curp.length}/18 caracteres</span>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
          <input
            type="tel"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
        <input
          type="email"
          name="correo"
          value={formData.correo}
          onChange={handleChange}
          className="input-field"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Municipio</label>
          <select
            name="municipioId"
            value={formData.municipioId}
            onChange={handleChange}
            className="select-field"
            required
          >
            <option value="">Seleccionar municipio</option>
            {catalogos.municipios.map((m) => (
              <option key={m.id} value={m.id}>{m.nombre}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nivel</label>
          <select
            name="nivelId"
            value={formData.nivelId}
            onChange={handleChange}
            className="select-field"
            required
          >
            <option value="">Seleccionar nivel</option>
            {catalogos.niveles.map((n) => (
              <option key={n.id} value={n.id}>{n.nombre}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Asunto</label>
          <select
            name="asuntoId"
            value={formData.asuntoId}
            onChange={handleChange}
            className="select-field"
            required
          >
            <option value="">Seleccionar asunto</option>
            {catalogos.asuntos.map((a) => (
              <option key={a.id} value={a.id}>{a.descripcion}</option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full flex items-center justify-center gap-2 py-3"
      >
        {loading ? (
          'Generando...'
        ) : (
          <>
            <Ticket className="w-5 h-5" />
            Generar Ticket y Descargar PDF
          </>
        )}
      </button>
    </form>
  );
}
