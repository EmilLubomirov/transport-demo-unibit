import {
  Component, AfterViewInit, OnDestroy,
  ElementRef, ViewChild, NgZone
} from '@angular/core';
import * as L from 'leaflet';
import { Waypoint } from '../../models/transport.model';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements AfterViewInit, OnDestroy {
  @ViewChild('mapContainer') mapEl!: ElementRef<HTMLDivElement>;

  private map!: L.Map;
  private truckMarker: L.Marker | null = null;
  private pathLine: L.Polyline | null = null;
  private plannedLine: L.Polyline | null = null;
  private pathPoints: L.LatLng[] = [];
  private startMarker: L.Marker | null = null;
  private endMarker: L.Marker | null = null;

  constructor(private readonly zone: NgZone) {}

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      this.map = L.map(this.mapEl.nativeElement, {
        center: [42.5, 25],
        zoom: 7,
        zoomControl: true,
        attributionControl: true
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18
      }).addTo(this.map);
    });
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  setPlannedRoute(waypoints: Waypoint[]): void {
    if (!this.map) return;

    this.reset();

    const latlngs = waypoints.map(w => L.latLng(w.lat, w.lon));

    this.plannedLine = L.polyline(latlngs, {
      color: '#90CAF9',
      weight: 4,
      dashArray: '8, 8',
      opacity: 0.8
    }).addTo(this.map);

    const [first, ...rest] = waypoints;
    const last = rest.length > 0 ? rest[rest.length - 1] : first;

    this.startMarker = L.marker([first.lat, first.lon], {
      icon: this.createPinIcon('🏭', '#4CAF50')
    }).addTo(this.map).bindPopup(`<b>Старт:</b> ${first.label}`);

    this.endMarker = L.marker([last.lat, last.lon], {
      icon: this.createPinIcon('🏁', '#F44336')
    }).addTo(this.map).bindPopup(`<b>Крайна точка:</b> ${last.label}`);

    this.map.fitBounds(this.plannedLine.getBounds(), { padding: [40, 40] });
  }

  moveVehicle(lat: number, lon: number): void {
    if (!this.map) return;

    const latlng = L.latLng(lat, lon);

    if (this.truckMarker) {
      this.truckMarker.setLatLng(latlng);
    } else {
      this.truckMarker = L.marker(latlng, {
        icon: this.createTruckIcon(),
        zIndexOffset: 1000
      }).addTo(this.map);
    }

    this.pathPoints.push(latlng);

    if (this.pathLine) {
      this.pathLine.setLatLngs(this.pathPoints);
    } else {
      this.pathLine = L.polyline(this.pathPoints, {
        color: '#1565C0',
        weight: 4,
        opacity: 0.9
      }).addTo(this.map);
    }

    this.map.panTo(latlng, { animate: true, duration: 1 });
  }

  fitRoute(): void {
    if (this.plannedLine) {
      this.map.fitBounds(this.plannedLine.getBounds(), { padding: [40, 40] });
    }
  }

  reset(): void {
    this.pathPoints = [];
    if (this.truckMarker)  { this.truckMarker.remove();   this.truckMarker = null; }
    if (this.pathLine)     { this.pathLine.remove();      this.pathLine = null; }
    if (this.plannedLine)  { this.plannedLine.remove();   this.plannedLine = null; }
    if (this.startMarker)  { this.startMarker.remove();   this.startMarker = null; }
    if (this.endMarker)    { this.endMarker.remove();     this.endMarker = null; }
  }

  private createTruckIcon(): L.DivIcon {
    return L.divIcon({
      className: '',
      html: `<div class="truck-icon">🚛</div>`,
      iconSize: [52, 52],
      iconAnchor: [26, 26]
    });
  }

  private createPinIcon(emoji: string, color: string): L.DivIcon {
    return L.divIcon({
      className: '',
      html: `<div class="pin-icon" style="background:${color}">${emoji}</div>`,
      iconSize: [46, 46],
      iconAnchor: [23, 23]
    });
  }
}
