import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CoordinateBatchRequest, SensorEventRequest, SensorEventType } from '../models/transport.model';

@Injectable({ providedIn: 'root' })
export class SimulatorService {
  private base = '/api/v1/simulator';

  constructor(private http: HttpClient) {}

  sendSensorEvent(routeId: number, vehicleId: number, eventType: SensorEventType): Observable<void> {
    const body: SensorEventRequest = {
      routeId,
      vehicleId,
      eventType,
      occurredAt: new Date().toISOString(),
      metadata: {}
    };
    return this.http.post(`${this.base}/sensor-event`, body, { responseType: 'text' }).pipe(map(() => void 0));
  }

  sendCoordinates(batch: CoordinateBatchRequest): Observable<void> {
    return this.http.post(`${this.base}/coordinates`, batch, { responseType: 'text' }).pipe(map(() => void 0));
  }
}
