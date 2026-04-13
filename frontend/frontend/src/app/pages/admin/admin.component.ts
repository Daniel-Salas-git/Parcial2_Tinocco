import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary-dark">
      <div class="container">
        <a class="navbar-brand d-flex align-items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" class="me-2">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
          </svg>
          <strong>Panel Admin</strong>
        </a>

        <div class="navbar-nav me-auto">
          <a class="nav-link" [class.active]="seccion === 'tickets'" (click)="seccion = 'tickets'; $event.preventDefault()">Tickets</a>
          <a class="nav-link" [class.active]="seccion === 'dashboard'" (click)="seccion = 'dashboard'; $event.preventDefault()">Dashboard</a>
          <a class="nav-link" [class.active]="seccion === 'catalogos'" (click)="seccion = 'catalogos'; $event.preventDefault()">Catálogos</a>
        </div>

        <button class="btn btn-outline-light btn-sm" (click)="logout()">Cerrar Sesión</button>
      </div>
    </nav>

    <main class="container py-4">
      <!-- Tickets -->
      <div *ngIf="seccion === 'tickets'">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h2>Gestión de Tickets</h2>
          <button class="btn btn-primary" (click)="cargarTickets()">Actualizar</button>
        </div>

        <!-- Filtros -->
        <div class="card mb-4">
          <div class="card-body">
            <div class="row g-3">
              <div class="col-md-4">
                <input type="text" class="form-control" placeholder="Buscar por CURP" [(ngModel)]="filtros.curp">
              </div>
              <div class="col-md-4">
                <input type="text" class="form-control" placeholder="Buscar por nombre" [(ngModel)]="filtros.nombre">
              </div>
              <div class="col-md-4">
                <button class="btn btn-primary w-100" (click)="buscarTickets()">Buscar</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Tabla -->
        <div class="card">
          <div class="table-responsive">
            <table class="table table-hover mb-0">
              <thead class="table-light">
                <tr>
                  <th>Turno</th>
                  <th>Nombre</th>
                  <th>CURP</th>
                  <th>Municipio</th>
                  <th>Estatus</th>
                  <th>Fecha</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let t of tickets">
                  <td class="fw-bold text-primary">#{{ t.turno }}</td>
                  <td>{{ t.nombre }} {{ t.paterno }}</td>
                  <td class="text-uppercase">{{ t.curp }}</td>
                  <td>{{ t.municipio?.nombre }}</td>
                  <td>
                    <span class="badge" [class.bg-success]="t.estatus === 'Resuelto'" [class.bg-warning]="t.estatus !== 'Resuelto'">
                      {{ t.estatus }}
                    </span>
                  </td>
                  <td>{{ t.fecha | date:'dd/MM/yyyy' }}</td>
                  <td>
                    <button class="btn btn-sm" [class.btn-success]="t.estatus !== 'Resuelto'" [class.btn-warning]="t.estatus === 'Resuelto'" (click)="toggleEstatus(t)">
                      {{ t.estatus === 'Resuelto' ? 'Pendiente' : 'Resolver' }}
                    </button>
                    <button class="btn btn-sm btn-danger ms-1" (click)="eliminarTicket(t.id)">Eliminar</button>
                  </td>
                </tr>
                <tr *ngIf="tickets.length === 0">
                  <td colspan="7" class="text-center text-muted py-4">No hay tickets registrados</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Dashboard -->
      <div *ngIf="seccion === 'dashboard'">
        <h2 class="mb-4">Dashboard</h2>

        <div class="card mb-4">
          <div class="card-body">
            <label class="form-label">Filtrar por municipio</label>
            <select class="form-select" style="max-width: 300px;" [(ngModel)]="filtroMunicipio" (change)="cargarStats()">
              <option value="">Todos los municipios</option>
              <option *ngFor="let m of municipios" [value]="m.id">{{ m.nombre }}</option>
            </select>
          </div>
        </div>

        <!-- Stats Cards -->
        <div class="row g-4 mb-4">
          <div class="col-md-3">
            <div class="card bg-primary text-white">
              <div class="card-body text-center">
                <h5 class="card-title">Total</h5>
                <h1>{{ stats.total }}</h1>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card bg-warning text-white">
              <div class="card-body text-center">
                <h5 class="card-title">Pendientes</h5>
                <h1>{{ stats.pendientes }}</h1>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card bg-success text-white">
              <div class="card-body text-center">
                <h5 class="card-title">Resueltos</h5>
                <h1>{{ stats.resueltos }}</h1>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card bg-info text-white">
              <div class="card-body text-center">
                <h5 class="card-title">Municipios</h5>
                <h1>{{ municipios.length }}</h1>
              </div>
            </div>
          </div>
        </div>

        <!-- Tabla de stats por municipio -->
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">Tickets por Municipio</h5>
          </div>
          <div class="table-responsive">
            <table class="table table-hover mb-0">
              <thead>
                <tr>
                  <th>Municipio</th>
                  <th>Pendientes</th>
                  <th>Resueltos</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let m of stats.porMunicipio">
                  <td>{{ m.municipio }}</td>
                  <td><span class="badge bg-warning">{{ m.pendientes }}</span></td>
                  <td><span class="badge bg-success">{{ m.resueltos }}</span></td>
                  <td>{{ m.pendientes + m.resueltos }}</td>
                </tr>
                <tr *ngIf="!stats.porMunicipio || stats.porMunicipio.length === 0">
                  <td colspan="4" class="text-center text-muted">Sin datos</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Catálogos -->
      <div *ngIf="seccion === 'catalogos'">
        <h2 class="mb-4">Catálogos</h2>

        <ul class="nav nav-tabs mb-4">
          <li class="nav-item">
            <a class="nav-link" [class.active]="catActivo === 'municipios'" (click)="catActivo = 'municipios'; cargarCatalogos(); $event.preventDefault()">Municipios</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" [class.active]="catActivo === 'niveles'" (click)="catActivo = 'niveles'; cargarCatalogos(); $event.preventDefault()">Niveles</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" [class.active]="catActivo === 'asuntos'" (click)="catActivo = 'asuntos'; cargarCatalogos(); $event.preventDefault()">Asuntos</a>
          </li>
        </ul>

        <div class="card">
          <div class="card-body">
            <div class="row mb-3">
              <div class="col-md-8">
                <input type="text" class="form-control" placeholder="Nuevo elemento" [(ngModel)]="nuevoElemento">
              </div>
              <div class="col-md-4">
                <button class="btn btn-primary w-100" (click)="agregarElemento()">Agregar</button>
              </div>
            </div>

            <table class="table" *ngIf="catActivo === 'municipios'">
              <thead><tr><th>ID</th><th>Nombre</th><th>Acciones</th></tr></thead>
              <tbody>
                <tr *ngFor="let m of catalogos.municipios">
                  <td>{{ m.id }}</td><td>{{ m.nombre }}</td>
                  <td><button class="btn btn-sm btn-danger" (click)="eliminarMunicipio(m.id)">Eliminar</button></td>
                </tr>
              </tbody>
            </table>

            <table class="table" *ngIf="catActivo === 'niveles'">
              <thead><tr><th>ID</th><th>Nombre</th><th>Acciones</th></tr></thead>
              <tbody>
                <tr *ngFor="let n of catalogos.niveles">
                  <td>{{ n.id }}</td><td>{{ n.nombre }}</td>
                  <td><button class="btn btn-sm btn-danger" (click)="eliminarNivel(n.id)">Eliminar</button></td>
                </tr>
              </tbody>
            </table>

            <table class="table" *ngIf="catActivo === 'asuntos'">
              <thead><tr><th>ID</th><th>Descripción</th><th>Acciones</th></tr></thead>
              <tbody>
                <tr *ngFor="let a of catalogos.asuntos">
                  <td>{{ a.id }}</td><td>{{ a.descripcion }}</td>
                  <td><button class="btn btn-sm btn-danger" (click)="eliminarAsunto(a.id)">Eliminar</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  `
})
export class AdminComponent implements OnInit {
  seccion = 'tickets';
  catActivo = 'municipios';
  nuevoElemento = '';
  filtroMunicipio = '';

  tickets: any[] = [];
  municipios: any[] = [];
  catalogos = { municipios: [] as any[], niveles: [] as any[], asuntos: [] as any[] };
  
  stats = { total: 0, pendientes: 0, resueltos: 0, porMunicipio: [] as any[] };
  filtros: any = { curp: '', nombre: '' };

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarTickets();
    this.cargarCatalogos();
    this.cargarMunicipios();
    this.cargarStats();
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  cargarTickets(): void {
    this.api.obtenerTickets().subscribe({ next: data => this.tickets = data, error: () => {} });
  }

  buscarTickets(): void {
    this.api.buscarTickets(this.filtros).subscribe({ next: data => this.tickets = data, error: () => {} });
  }

  toggleEstatus(ticket: any): void {
    const nuevo = ticket.estatus === 'Resuelto' ? 'Pendiente' : 'Resuelto';
    this.api.cambiarEstatus(ticket.id, nuevo).subscribe({ next: () => this.cargarTickets(), error: () => {} });
  }

  eliminarTicket(id: number): void {
    if (confirm('¿Eliminar este ticket?')) {
      this.api.eliminarTicket(id).subscribe({ next: () => this.cargarTickets(), error: () => {} });
    }
  }

  cargarMunicipios(): void {
    this.api.obtenerMunicipios().subscribe({ next: data => this.municipios = data, error: () => {} });
  }

  cargarCatalogos(): void {
    this.api.obtenerMunicipios().subscribe({ next: data => this.catalogos.municipios = data, error: () => {} });
    this.api.obtenerNiveles().subscribe({ next: data => this.catalogos.niveles = data, error: () => {} });
    this.api.obtenerAsuntos().subscribe({ next: data => this.catalogos.asuntos = data, error: () => {} });
  }

  cargarStats(): void {
    this.api.obtenerStats(this.filtroMunicipio ? +this.filtroMunicipio : undefined).subscribe({
      next: data => this.stats = data,
      error: () => {}
    });
  }

  agregarElemento(): void {
    if (!this.nuevoElemento) return;
    const data = this.catActivo === 'asuntos' ? { descripcion: this.nuevoElemento } : { nombre: this.nuevoElemento };
    
    if (this.catActivo === 'municipios') {
      this.api.crearMunicipio(data).subscribe({ next: () => { this.cargarCatalogos(); this.nuevoElemento = ''; }, error: () => {} });
    } else if (this.catActivo === 'niveles') {
      this.api.crearNivel(data).subscribe({ next: () => { this.cargarCatalogos(); this.nuevoElemento = ''; }, error: () => {} });
    } else {
      this.api.crearAsunto(data).subscribe({ next: () => { this.cargarCatalogos(); this.nuevoElemento = ''; }, error: () => {} });
    }
  }

  eliminarMunicipio(id: number): void { if (confirm('¿Eliminar?')) this.api.eliminarMunicipio(id).subscribe({ next: () => this.cargarCatalogos(), error: () => {} }); }
  eliminarNivel(id: number): void { if (confirm('¿Eliminar?')) this.api.eliminarNivel(id).subscribe({ next: () => this.cargarCatalogos(), error: () => {} }); }
  eliminarAsunto(id: number): void { if (confirm('¿Eliminar?')) this.api.eliminarAsunto(id).subscribe({ next: () => this.cargarCatalogos(), error: () => {} }); }
}
