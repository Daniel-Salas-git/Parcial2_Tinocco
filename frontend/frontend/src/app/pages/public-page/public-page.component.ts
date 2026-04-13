import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-public-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <!-- Header -->
    <nav class="navbar navbar-dark bg-primary-dark">
      <div class="container">
        <a class="navbar-brand d-flex align-items-center" href="/">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi me-2">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
          </svg>
          <strong>Ticket de Turno</strong>
        </a>
        <a class="btn btn-outline-light" routerLink="/login">Acceso Admin</a>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="container py-5">
      <div class="row g-4">
        <!-- Formulario Ticket -->
        <div class="col-lg-6">
          <div class="card">
            <div class="card-body">
              <h4 class="card-title mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi me-2 text-primary">
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
                Solicitar Ticket
              </h4>

              <div *ngIf="mensaje" class="alert" [class.alert-success]="mensaje.tipo === 'success'" [class.alert-danger]="mensaje.tipo === 'error'">
                {{ mensaje.texto }}
              </div>

              <form (ngSubmit)="crearTicket()">
                <div class="row g-3">
                  <div class="col-md-4">
                    <label class="form-label">Nombre(s)</label>
                    <input type="text" class="form-control" [(ngModel)]="formData.nombre" name="nombre" required>
                  </div>
                  <div class="col-md-4">
                    <label class="form-label">Paterno</label>
                    <input type="text" class="form-control" [(ngModel)]="formData.paterno" name="paterno" required>
                  </div>
                  <div class="col-md-4">
                    <label class="form-label">Materno</label>
                    <input type="text" class="form-control" [(ngModel)]="formData.materno" name="materno" required>
                  </div>
                </div>

                <div class="row g-3 mt-2">
                  <div class="col-md-6">
                    <label class="form-label">CURP</label>
                    <input type="text" class="form-control text-uppercase" [(ngModel)]="formData.curp" name="curp" maxlength="18" required>
                    <small class="text-muted">{{ formData.curp?.length || 0 }}/18</small>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Teléfono</label>
                    <input type="tel" class="form-control" [(ngModel)]="formData.telefono" name="telefono" required>
                  </div>
                </div>

                <div class="mt-2">
                  <label class="form-label">Correo</label>
                  <input type="email" class="form-control" [(ngModel)]="formData.correo" name="correo" required>
                </div>

                <div class="row g-3 mt-2">
                  <div class="col-md-4">
                    <label class="form-label">Municipio</label>
                    <select class="form-select" [(ngModel)]="formData.municipioId" name="municipioId" required>
                      <option value="">Seleccionar</option>
                      <option *ngFor="let m of catalogos.municipios" [value]="m.id">{{ m.nombre }}</option>
                    </select>
                  </div>
                  <div class="col-md-4">
                    <label class="form-label">Nivel</label>
                    <select class="form-select" [(ngModel)]="formData.nivelId" name="nivelId" required>
                      <option value="">Seleccionar</option>
                      <option *ngFor="let n of catalogos.niveles" [value]="n.id">{{ n.nombre }}</option>
                    </select>
                  </div>
                  <div class="col-md-4">
                    <label class="form-label">Asunto</label>
                    <select class="form-select" [(ngModel)]="formData.asuntoId" name="asuntoId" required>
                      <option value="">Seleccionar</option>
                      <option *ngFor="let a of catalogos.asuntos" [value]="a.id">{{ a.descripcion }}</option>
                    </select>
                  </div>
                </div>

                <button type="submit" class="btn btn-primary w-100 mt-4" [disabled]="loading">
                  <span *ngIf="loading">Generando...</span>
                  <span *ngIf="!loading">Generar Ticket y Descargar PDF</span>
                </button>
              </form>
            </div>
          </div>
        </div>

        <!-- Modificar Ticket -->
        <div class="col-lg-6">
          <div class="card">
            <div class="card-body">
              <h4 class="card-title mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi me-2 text-warning">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                Modificar Mi Ticket
              </h4>

              <form (ngSubmit)="buscarTicket()">
                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label">CURP</label>
                    <input type="text" class="form-control text-uppercase" [(ngModel)]="buscarData.curp" name="curp" required>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Número de Turno</label>
                    <input type="number" class="form-control" [(ngModel)]="buscarData.turno" name="turno" required>
                  </div>
                </div>
                <button type="submit" class="btn btn-warning w-100 mt-3">Buscar Ticket</button>
              </form>

              <div *ngIf="ticketEncontrado" class="alert alert-info mt-3">
                <h5>Ticket #{{ ticketEncontrado.turno }}</h5>
                <p><strong>Solicitante:</strong> {{ ticketEncontrado.nombre }} {{ ticketEncontrado.paterno }}</p>
                <p><strong>Estatus:</strong> 
                  <span class="badge" [class.bg-success]="ticketEncontrado.estatus === 'Resuelto'" [class.bg-warning]="ticketEncontrado.estatus !== 'Resuelto'">
                    {{ ticketEncontrado.estatus }}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Instrucciones -->
      <div class="card mt-4 bg-light">
        <div class="card-body">
          <h5>¿Cómo funciona?</h5>
          <ol class="mb-0">
            <li>Llena el formulario con tus datos</li>
            <li>Al enviar, se descargará automáticamente tu PDF</li>
            <li>Guarda tu número de turno y CURP</li>
            <li>Presenta tu ticket en el módulo correspondiente</li>
          </ol>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-dark text-white py-3 mt-auto">
      <div class="container text-center">
        <small>Ticket de Turno © 2024</small>
      </div>
    </footer>
  `
})
export class PublicPageComponent implements OnInit {
  loading = false;
  mensaje: { tipo: string; texto: string } | null = null;
  catalogos = { municipios: [] as any[], niveles: [] as any[], asuntos: [] as any[] };
  
  formData: any = {
    nombre: '', paterno: '', materno: '', curp: '', telefono: '', correo: '',
    municipioId: '', nivelId: '', asuntoId: ''
  };

  buscarData: any = { curp: '', turno: '' };
  ticketEncontrado: any = null;

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.cargarCatalogos();
  }

  cargarCatalogos(): void {
    this.api.obtenerMunicipios().subscribe(data => this.catalogos.municipios = data);
    this.api.obtenerNiveles().subscribe(data => this.catalogos.niveles = data);
    this.api.obtenerAsuntos().subscribe(data => this.catalogos.asuntos = data);
  }

  crearTicket(): void {
    this.loading = true;
    this.mensaje = null;
    
    this.api.crearTicket(this.formData).subscribe({
      next: (blob: any) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ticket_turno.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
        
        this.mensaje = { tipo: 'success', texto: 'Ticket generado y descargado exitosamente' };
        this.formData = { nombre: '', paterno: '', materno: '', curp: '', telefono: '', correo: '', municipioId: '', nivelId: '', asuntoId: '' };
      },
      error: (err) => {
        this.mensaje = { tipo: 'error', texto: err.error?.error || 'Error al generar ticket' };
      },
      complete: () => this.loading = false
    });
  }

  buscarTicket(): void {
    const params = { curp: this.buscarData.curp, turno: this.buscarData.turno };
    this.api.buscarTickets(params).subscribe({
      next: (data: any[]) => {
        this.ticketEncontrado = data[0] || null;
        if (!this.ticketEncontrado) {
          this.mensaje = { tipo: 'error', texto: 'Ticket no encontrado' };
        }
      },
      error: () => {
        this.ticketEncontrado = null;
        this.mensaje = { tipo: 'error', texto: 'Ticket no encontrado' };
      }
    });
  }
}
