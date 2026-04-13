import { useState } from 'react';
import Navbar from '../components/Navbar';
import CatalogManager from '../components/CatalogManager';

export default function AdminCatalogs() {
  const [tabActiva, setTabActiva] = useState('municipios');

  const tabs = [
    { id: 'municipios', label: 'Municipios', campo: 'nombre' },
    { id: 'niveles', label: 'Niveles', campo: 'nombre' },
    { id: 'asuntos', label: 'Asuntos', campo: 'descripcion' }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Catálogos</h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTabActiva(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                tabActiva === tab.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Contenido del Tab */}
        {tabs.map((tab) => (
          tabActiva === tab.id && (
            <CatalogManager
              key={tab.id}
              type={tab.id}
              title={tab.label}
              campo={tab.campo}
            />
          )
        ))}
      </main>
    </div>
  );
}
