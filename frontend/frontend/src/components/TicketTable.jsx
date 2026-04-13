import { useState } from 'react';
import { Edit2, Trash2, CheckCircle, Clock } from 'lucide-react';

export default function TicketTable({ tickets, onEdit, onDelete, onToggleEstatus, onRefresh }) {
  const [loadingId, setLoadingId] = useState(null);

  const handleToggle = async (ticket) => {
    setLoadingId(ticket.id);
    try {
      await onToggleEstatus(ticket);
    } finally {
      setLoadingId(null);
    }
  };

  if (!tickets || tickets.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No hay tickets registrados</p>
      </div>
    );
  }

  return (
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
              <td className="px-4 py-3">
                <span className="font-bold text-primary-600 text-lg">#{ticket.turno}</span>
              </td>
              <td className="px-4 py-3">
                <div className="text-sm font-medium text-gray-900">
                  {ticket.nombre} {ticket.paterno}
                </div>
                <div className="text-xs text-gray-500">{ticket.materno}</div>
              </td>
              <td className="px-4 py-3 text-xs uppercase font-mono text-gray-700">
                {ticket.curp}
              </td>
              <td className="px-4 py-3 text-sm">
                {ticket.municipio?.nombre}
              </td>
              <td className="px-4 py-3">
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  ticket.estatus === 'Resuelto'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {ticket.estatus === 'Resuelto' ? (
                    <CheckCircle className="w-3 h-3" />
                  ) : (
                    <Clock className="w-3 h-3" />
                  )}
                  {ticket.estatus}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-500">
                {new Date(ticket.fecha).toLocaleDateString('es-MX')}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggle(ticket)}
                    disabled={loadingId === ticket.id}
                    className={`p-2 rounded-lg transition-colors ${
                      ticket.estatus === 'Resuelto'
                        ? 'text-yellow-600 hover:bg-yellow-100'
                        : 'text-green-600 hover:bg-green-100'
                    }`}
                    title={ticket.estatus === 'Resuelto' ? 'Marcar Pendiente' : 'Marcar Resuelto'}
                  >
                    {ticket.estatus === 'Resuelto' ? (
                      <Clock className="w-4 h-4" />
                    ) : (
                      <CheckCircle className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => onEdit(ticket)}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(ticket.id)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
