import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

export default function CatalogManager({ type, title, campo }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({ [campo]: '' });

  useEffect(() => {
    cargarItems();
  }, [type]);

  const cargarItems = async () => {
    try {
      const response = await fetch(`/api/catalogs/${type}`);
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Error cargando:', error);
    } finally {
      setLoading(false);
    }
  };

  const abrirModal = (item = null) => {
    if (item) {
      setEditItem(item);
      setFormData({ [campo]: item[campo] });
    } else {
      setEditItem(null);
      setFormData({ [campo]: '' });
    }
    setModal(true);
  };

  const cerrarModal = () => {
    setModal(false);
    setEditItem(null);
    setFormData({ [campo]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editItem 
        ? `/api/catalogs/${type}/${editItem.id}` 
        : `/api/catalogs/${type}`;
      
      const method = editItem ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Error al guardar');
      }

      cerrarModal();
      cargarItems();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este elemento?')) return;

    try {
      const response = await fetch(`/api/catalogs/${type}/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Error al eliminar');
      }

      cargarItems();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Cargando...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        <button onClick={() => abrirModal()} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nuevo
        </button>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-500">{item.id}</td>
                <td className="px-4 py-3 font-medium text-gray-900">{item[campo]}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => abrirModal(item)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {items.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No hay elementos registrados
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">
                {editItem ? 'Editar' : 'Nuevo'} {title}
              </h3>
              <button onClick={cerrarModal} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  value={formData[campo]}
                  onChange={(e) => setFormData({ [campo]: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div className="flex justify-end gap-3">
                <button type="button" onClick={cerrarModal} className="btn-secondary">
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
