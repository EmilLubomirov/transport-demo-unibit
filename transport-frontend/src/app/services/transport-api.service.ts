import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Transport, Route, RouteCoordinate,
  CreateTransportRequest, CreateRouteRequest, TransportStatus
} from '../models/transport.model';

@Injectable({ providedIn: 'root' })
export class TransportApiService {
  private readonly base = '/api/v1';

  constructor(private readonly http: HttpClient) {}

  createTransport(req: CreateTransportRequest): Observable<Transport> {
    return this.http.post<Transport>(`${this.base}/transports`, req);
  }

  getTransport(id: number): Observable<Transport> {
    return this.http.get<Transport>(`${this.base}/transports/${id}`);
  }

  listTransports(status?: TransportStatus): Observable<Transport[]> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    return this.http.get<Transport[]>(`${this.base}/transports`, { params });
  }

  updateTransportStatus(id: number, status: TransportStatus): Observable<Transport> {
    return this.http.patch<Transport>(`${this.base}/transports/${id}/status`, { status });
  }

  createRoute(req: CreateRouteRequest): Observable<Route> {
    return this.http.post<Route>(`${this.base}/routes`, req);
  }

  getRoute(id: number): Observable<Route> {
    return this.http.get<Route>(`${this.base}/routes/${id}`);
  }

  getRoutesByTransport(transportId: number): Observable<Route[]> {
    return this.http.get<Route[]>(`${this.base}/routes/transport/${transportId}`);
  }

  getCoordinates(routeId: number): Observable<RouteCoordinate[]> {
    return this.http.get<RouteCoordinate[]>(`${this.base}/coordinates/route/${routeId}`);
  }
}
