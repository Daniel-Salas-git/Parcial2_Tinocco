import { useState, useEffect } from 'react';
import { catalogService } from '../services/api';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

export default function CatalogPage({ type, title }) {
  const [items, setItems] = useState([]);
  const [modal, setModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({ nombre: '' });

  useEffect(() => {
    loadItems();
  }, [type]);

  const loadItems = async () => {
    try {
      const response = await catalogService.getAll(type);
      setItems(response.data);
    } catch (error) {
      console.error('Error cargando datos:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editItem) {
        await catalogService.update(type, editItem.id, formData);
      } else {
        await catalogService.create(type, formData);
      }
      setModal(false);
      setEditItem(null);
      setFormData({ nombre: '' });
      loadItems();
    } catch (error) {
      console.error('Error guardando:', error);
    }
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setFormData({ nombre: item.nombre });
    setModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este elemento?')) return;
    try {
      await catalogService.delete(type, id);
      loadItems();
    } catch (error) {
      console.error('Error eliminando:', error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        <button onClick={() => { setModal(true); setEditItem(null); setFormData({ nombre: '' }); }} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nuevo
        </button>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
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
                  <td className="px-4 py-3">{item.id}</td>
                  <td className="px-4 py-3 font-medium">{item.nombre}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(item)} className="p-2 text-blue-600 hover:bg-blue-100 rounded">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-100 rounded">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 && (
            <p className="text-center text-gray-500 py-8">No hay elementos registrados</p>
          )}
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{editItem ? 'Editar' : 'Nuevo'} {title}</h2>
              <button onClick={() => setModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ nombre: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setModal(false)} className="btn-secondary">Cancelar</button>
                <button type="submit" className="btn-primary">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
