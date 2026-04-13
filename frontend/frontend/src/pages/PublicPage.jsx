import { Ticket, Search } from 'lucide-react';
import TicketForm from '../components/TicketForm';
import ModifyForm from '../components/ModifyForm';
import { Link } from 'react-router-dom';

export default function PublicPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      {/* Header */}
      <header className="bg-primary-800 text-white py-6 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Ticket className="w-8 h-8" />
              <h1 className="text-2xl md:text-3xl font-bold">Ticket de Turno</h1>
            </div>
            <Link 
              to="/login" 
              className="bg-primary-700 hover:bg-primary-600 px-4 py-2 rounded-lg transition-colors"
            >
              Acceso Administrador
            </Link>
          </div>
          <p className="text-center mt-2 text-primary-200">Sistema de Gestión de Turnos</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Formulario de Ticket */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Ticket className="w-5 h-5 text-primary-600" />
              Solicitar Nuevo Ticket
            </h2>
            <TicketForm />
          </div>

          {/* Modificar Ticket */}
          <div className="card">
            <ModifyForm />
          </div>
        </div>

        {/* Instrucciones */}
        <div className="mt-8 card bg-primary-50 border border-primary-200">
          <h3 className="font-bold text-gray-800 mb-3">¿Cómo funciona?</h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Llena el formulario con tus datos personales</li>
            <li>Selecciona el municipio, nivel y asunto de tu solicitud</li>
            <li>Al enviar, se descargará automáticamente tu ticket en formato PDF</li>
            <li>Guarda tu número de turno y CURP para consultar o modificar después</li>
            <li>Presenta tu ticket en el módulo correspondiente</li>
          </ol>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 py-4 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm">
          Ticket de Turno © 2024 - Todos los derechos reservados
        </div>
      </footer>
    </div>
  );
}
