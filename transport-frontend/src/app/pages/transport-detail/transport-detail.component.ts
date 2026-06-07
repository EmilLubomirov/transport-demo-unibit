import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { interval, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Transport, Route, RouteCoordinate, TelematicData, RouteStatus, DRIVER_NAMES, VEHICLE_NAMES } from '../../models/transport.model';
import { TransportApiService } from '../../services/transport-api.service';
import { MapViewComponent } from '../../components/map-view/map-view.component';
import { CreateRouteDialogComponent } from '../../components/create-route-dialog/create-route-dialog.component';

@Component({
  selector: 'app-transport-detail',
  templateUrl: './transport-detail.component.html',
  styleUrls: ['./transport-detail.component.css']
})
export class TransportDetailComponent implements OnInit, OnDestroy {
  @ViewChild(MapViewComponent) mapView!: MapViewComponent;

  transportId!: number;
  transport: Transport | null = null;
  routes: Route[] = [];
  selectedRoute: Route | null = null;
  coordinates: RouteCoordinate[] = [];
  latestTelemetry: TelematicData | null = null;
  lastUpdate: string | null = null;
  loading = false;

  private pollSub?: Subscription;

  get activeRoute(): Route | undefined {
    return this.routes.find(r => r.status === RouteStatus.ACTIVE);
  }

  constructor(
    private readonly route: ActivatedRoute,
    private readonly api: TransportApiService,
    private readonly dialog: MatDialog,
    private readonly snack: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.transportId = +(this.route.snapshot.paramMap.get('id') ?? '0');
    this.loadAll();
  }

  ngOnDestroy(): void {
    this.pollSub?.unsubscribe();
  }

  loadAll(): void {
    this.loading = true;
    this.api.getTransport(this.transportId).subscribe({
      next: t => {
        this.transport = t;
        this.loading = false;
        this.loadRoutes();
      },
      error: () => { this.loading = false; }
    });
  }

  loadRoutes(): void {
    this.api.getRoutesByTransport(this.transportId).subscribe(routes => {
      this.routes = routes;
      const active = routes.find(r => r.status === RouteStatus.ACTIVE);
      if (active) this.selectRoute(active);
      else if (routes.length > 0) this.selectRoute(routes[0]);
    });
  }

  selectRoute(route: Route): void {
    this.selectedRoute = route;
    this.pollSub?.unsubscribe();
    this.loadCoordinates(route.id);

    if (route.status === RouteStatus.ACTIVE) {
      this.pollSub = interval(3000).pipe(
        switchMap(() => this.api.getCoordinates(route.id))
      ).subscribe(coords => this.updateMap(coords));
    }
  }

  loadCoordinates(routeId: number): void {
    this.api.getCoordinates(routeId).subscribe(coords => this.updateMap(coords));
  }

  private updateMap(coords: RouteCoordinate[]): void {
    this.coordinates = coords;
    if (coords.length === 0) return;

    const last = coords.at(-1);
    if (!last) return;
    this.latestTelemetry = last.telematicData;
    this.lastUpdate = new Date(last.serverTime).toLocaleTimeString('bg-BG');

    setTimeout(() => {
      if (this.mapView) {
        coords.forEach(c => this.mapView.moveVehicle(c.telematicData.lat, c.telematicData.lon));
      }
    }, 100);
  }

  openCreateRoute(): void {
    const ref = this.dialog.open(CreateRouteDialogComponent, {
      width: '500px',
      data: {
        transportId: this.transportId,
        origin: this.transport?.origin || '',
        destination: this.transport?.destination || ''
      }
    });
    ref.afterClosed().subscribe(result => {
      if (result) {
        this.api.createRoute(result).subscribe({
          next: r => {
            this.routes = [...this.routes, r];
            this.snack.open(`Маршрут #${r.id} създаден`, 'OK', { duration: 3000 });
          },
          error: () => this.snack.open('Грешка при създаване', 'OK', { duration: 3000 })
        });
      }
    });
  }

  get stats(): { maxSpeed: number; avgSpeed: number; minTemp: number; maxTemp: number } | null {
    if (this.coordinates.length === 0) return null;
    const speeds = this.coordinates.map(c => c.telematicData.speed);
    const temps  = this.coordinates.map(c => c.telematicData.temperature);
    return {
      maxSpeed: Math.max(...speeds),
      avgSpeed: Math.round(speeds.reduce((a, b) => a + b, 0) / speeds.length),
      minTemp:  Math.min(...temps),
      maxTemp:  Math.max(...temps)
    };
  }

  driverName(id: number): string {
    return DRIVER_NAMES[id] ?? `Водач #${id}`;
  }

  vehicleName(id: number): string {
    return VEHICLE_NAMES[id] ?? `Камион #${id}`;
  }

  formatDate(iso?: string): string {
    if (!iso) return '—';
    return new Date(iso).toLocaleString('bg-BG', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }
}
