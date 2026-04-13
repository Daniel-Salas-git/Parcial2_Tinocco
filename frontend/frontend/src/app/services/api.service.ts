import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = '/api';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    const headers: any = {
      'Content-Type': 'application/json'
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return new HttpHeaders(headers);
  }

  // Auth
  login(usuario: string, password: string, recaptchaToken: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, { usuario, password, recaptchaToken });
  }

  getMe(): Observable<any> {
    return this.http.get(`${this.apiUrl}/auth/me`, { headers: this.getHeaders() });
  }

  // Tickets - Para PDF se usa responseType: 'blob'
  crearTicket(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/tickets`, data, {
      headers: this.getHeaders(),
      responseType: 'blob'
    });
  }

  obtenerTickets(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/tickets`, { headers: this.getHeaders() });
  }

  buscarTickets(params: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/tickets/buscar`, { 
      headers: this.getHeaders(),
      params 
    });
  }

  actualizarTicket(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/tickets/${id}`, data, { headers: this.getHeaders() });
  }

  eliminarTicket(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/tickets/${id}`, { headers: this.getHeaders() });
  }

  cambiarEstatus(id: number, estatus: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/tickets/${id}/estatus`, { estatus }, { headers: this.getHeaders() });
  }

  // Catalogos (publicos)
  obtenerMunicipios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/catalogs/municipio`);
  }

  obtenerNiveles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/catalogs/nivel`);
  }

  obtenerAsuntos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/catalogs/asunto`);
  }

  // Catalogos (privados)
  crearMunicipio(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/catalogs/municipio`, data, { headers: this.getHeaders() });
  }

  actualizarMunicipio(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/catalogs/municipio/${id}`, data, { headers: this.getHeaders() });
  }

  eliminarMunicipio(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/catalogs/municipio/${id}`, { headers: this.getHeaders() });
  }

  crearNivel(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/catalogs/nivel`, data, { headers: this.getHeaders() });
  }

  actualizarNivel(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/catalogs/nivel/${id}`, data, { headers: this.getHeaders() });
  }

  eliminarNivel(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/catalogs/nivel/${id}`, { headers: this.getHeaders() });
  }

  crearAsunto(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/catalogs/asunto`, data, { headers: this.getHeaders() });
  }

  actualizarAsunto(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/catalogs/asunto/${id}`, data, { headers: this.getHeaders() });
  }

  eliminarAsunto(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/catalogs/asunto/${id}`, { headers: this.getHeaders() });
  }

  // Stats
  obtenerStats(municipioId?: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats`, { 
      headers: this.getHeaders(),
      params: municipioId ? { municipioId: municipioId.toString() } : {}
    });
  }
}
