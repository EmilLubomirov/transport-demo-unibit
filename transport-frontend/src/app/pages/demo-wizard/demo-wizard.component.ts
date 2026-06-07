import { Component, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';
import { DemoCompleteDialogComponent } from '../../components/demo-complete-dialog/demo-complete-dialog.component';
import {
  DEMO_ROUTES, SensorEventType, TelematicData, TransportStatus, Waypoint
} from '../../models/transport.model';
import { TransportApiService } from '../../services/transport-api.service';
import { SimulatorService } from '../../services/simulator.service';
import { MapViewComponent } from '../../components/map-view/map-view.component';

type StepStatus = 'idle' | 'loading' | 'done' | 'error';

interface DemoStep {
  title: string;
  subtitle: string;
  icon: string;
  status: StepStatus;
}

const VEHICLE_ID = 101;

@Component({
  selector: 'app-demo-wizard',
  templateUrl: './demo-wizard.component.html',
  styleUrls: ['./demo-wizard.component.css']
})
export class DemoWizardComponent implements OnDestroy {
  @ViewChild(MapViewComponent) mapView!: MapViewComponent;

  mode: 'auto' | 'manual' = 'auto';
  currentStep = -1;
  isRunning = false;

  transportId: number | null = null;
  routeId: number | null = null;
  latestTelemetry: TelematicData | null = null;

  routeKeys = Object.keys(DEMO_ROUTES);
  selectedRouteKey = 'София → Пловдив';
  currentWaypoints: Waypoint[] = [];
  currentWaypointIndex = 0;

  steps: DemoStep[] = [
    { title: 'Създай транспорт',       subtitle: 'Дефинира начална и крайна точка', icon: '📦', status: 'idle' },
    { title: 'Създай маршрут',         subtitle: 'Назначава водач и превозно средство',   icon: '🗺️', status: 'idle' },
    { title: 'Тръгване',                subtitle: 'Сензорно събитие → статус АКТИВЕН',     icon: '🚀', status: 'idle' },
    { title: 'GPS телеметрия',         subtitle: 'Проследяване в реално време', icon: '📡', status: 'idle' },
    { title: 'Пристигане',             subtitle: 'Засичане на дестинация → ЗАВЪРШЕН',      icon: '🏁', status: 'idle' }
  ];

  // Manual mode forms
  transportForm: FormGroup;
  routeForm: FormGroup;

  drivers = [
    { id: 1, name: 'Иван Петров' },
    { id: 2, name: 'Георги Димитров' },
    { id: 3, name: 'Мария Стоянова' }
  ];

  vehicles = [
    { id: 101, name: 'TH-4521-BG | Volvo FH16' },
    { id: 102, name: 'CB-8834-BG | Mercedes Actros' },
    { id: 103, name: 'PB-2210-BG | MAN TGX' }
  ];

  errorMessage = '';
  loadingMessage = '';

  private aborted = false;

  constructor(
    private readonly api: TransportApiService,
    private readonly sim: SimulatorService,
    private readonly fb: FormBuilder,
    private readonly snack: MatSnackBar,
    private readonly dialog: MatDialog,
    private readonly router: Router
  ) {
    this.transportForm = this.fb.group({
      routeKey:  [this.selectedRouteKey, Validators.required],
      origin:    ['', Validators.required],
      destination: ['', Validators.required]
    });

    this.routeForm = this.fb.group({
      driverId:  [1, Validators.required],
      vehicleId: [VEHICLE_ID, Validators.required],
      startPoint: [''],
      endPoint:   ['']
    });

    this.applyRoutePreset(this.selectedRouteKey);
  }

  ngOnDestroy(): void {
    this.aborted = true;
  }

  applyRoutePreset(key: string): void {
    const route = DEMO_ROUTES[key];
    if (!route) return;
    this.selectedRouteKey = key;
    this.currentWaypoints = route.waypoints;
    this.transportForm.patchValue({ origin: route.origin, destination: route.destination });
    this.routeForm.patchValue({ startPoint: route.origin, endPoint: route.destination });
  }

  onPresetChange(key: string): void {
    this.applyRoutePreset(key);
  }

  resetDemo(): void {
    this.aborted = true;
    setTimeout(() => {
      this.aborted = false;
      this.currentStep = -1;
      this.isRunning = false;
      this.transportId = null;
      this.routeId = null;
      this.latestTelemetry = null;
      this.currentWaypointIndex = 0;
      this.errorMessage = '';
      this.steps.forEach(s => s.status = 'idle');
      if (this.mapView) this.mapView.reset();
    }, 50);
  }

  async runAuto(): Promise<void> {
    this.resetDemo();
    await this.delay(100);
    this.isRunning = true;
    this.aborted = false;

    try {
      await this.stepCreateTransport(true);
      await this.stepCreateRoute(true);
      await this.stepEngineOn();
      await this.stepGps();
      await this.stepGeofenceEnter();
      await this.delay(5000);
      this.openCompleteDialog();
    } catch (e: any) {
      this.errorMessage = e?.message || 'Грешка при изпълнение';
    } finally {
      this.isRunning = false;
    }
  }

  async manualStepCreateTransport(): Promise<void> {
    if (this.transportForm.invalid) return;
    this.isRunning = true;
    try {
      await this.stepCreateTransport(false);
    } finally {
      this.isRunning = false;
    }
  }

  async manualStepCreateRoute(): Promise<void> {
    if (!this.transportId || this.routeForm.invalid) return;
    this.isRunning = true;
    try {
      await this.stepCreateRoute(false);
    } finally {
      this.isRunning = false;
    }
  }

  async manualStepEngineOn(): Promise<void> {
    if (!this.routeId) return;
    this.isRunning = true;
    try {
      await this.stepEngineOn();
    } finally {
      this.isRunning = false;
    }
  }

  async manualStepSendGps(): Promise<void> {
    if (!this.routeId || this.currentWaypointIndex >= this.currentWaypoints.length) return;
    this.isRunning = true;
    try {
      const wp = this.currentWaypoints[this.currentWaypointIndex];
      this.steps[3].status = 'loading';
      await this.sendGpsPoint(wp);
      this.currentWaypointIndex++;
      if (this.currentWaypointIndex >= this.currentWaypoints.length) {
        this.steps[3].status = 'done';
      } else {
        this.steps[3].status = 'loading';
      }
    } finally {
      this.isRunning = false;
    }
  }

  async manualStepGeofence(): Promise<void> {
    if (!this.routeId) return;
    this.isRunning = true;
    try {
      await this.stepGeofenceEnter();
      await this.delay(5000);
      this.openCompleteDialog();
    } finally {
      this.isRunning = false;
    }
  }

  private openCompleteDialog(): void {
    const ref = this.dialog.open(DemoCompleteDialogComponent, {
      width: '440px',
      disableClose: true,
      data: { transportId: this.transportId }
    });
    ref.afterClosed().subscribe((result: string) => {
      if (result === 'new') {
        this.resetDemo();
      } else if (result === 'details' && this.transportId) {
        this.router.navigate(['/transports', this.transportId]);
      }
    });
  }

  // --- Core step logic ---

  private async stepCreateTransport(auto: boolean): Promise<void> {
    this.currentStep = 0;
    this.steps[0].status = 'loading';

    const routeData = DEMO_ROUTES[this.selectedRouteKey];
    const origin = auto ? routeData.origin : this.transportForm.value.origin;
    const destination = auto ? routeData.destination : this.transportForm.value.destination;
    const transport = await firstValueFrom(this.api.createTransport({
      origin, destination
    }));

    this.transportId = transport.id;
    this.currentWaypoints = DEMO_ROUTES[this.selectedRouteKey]?.waypoints ?? this.currentWaypoints;
    this.steps[0].status = 'done';
    this.steps[0].subtitle = `Транспорт #${transport.id} — ${origin} → ${destination}`;

    if (auto) { this.mapView?.setPlannedRoute(this.currentWaypoints); await this.delay(2500); }
    else       { this.mapView?.setPlannedRoute(this.currentWaypoints); }
  }

  private async stepCreateRoute(auto: boolean): Promise<void> {
    if (!this.transportId) throw new Error('Липсва транспорт');
    this.currentStep = 1;
    this.steps[1].status = 'loading';

    const driverId  = auto ? 1 : +this.routeForm.value.driverId;
    const vehicleId = auto ? VEHICLE_ID : +this.routeForm.value.vehicleId;
    const routeData = DEMO_ROUTES[this.selectedRouteKey];

    const route = await firstValueFrom(this.api.createRoute({
      transportId: this.transportId, driverId, vehicleId,
      startPoint: routeData?.origin, endPoint: routeData?.destination
    }));

    this.routeId = route.id;
    this.steps[1].status = 'done';
    this.steps[1].subtitle = `Маршрут #${route.id} — Водач ${driverId}, Камион ${vehicleId}`;

    const wp0 = this.currentWaypoints[0];
    if (wp0) {
      this.latestTelemetry = {
        lat: wp0.lat, lon: wp0.lon,
        speed: 0, temperature: 18,
        doorOpen: true, engineOn: false
      };
    }

    if (auto) {
      this.loadingMessage = '📦 Товарене в прогрес...';
      await this.delay(10000);
      this.loadingMessage = '';
    }
  }

  private async stepEngineOn(): Promise<void> {
    if (!this.routeId) throw new Error('Липсва маршрут');
    this.currentStep = 2;
    this.steps[2].status = 'loading';
    await firstValueFrom(this.sim.sendSensorEvent(this.routeId, VEHICLE_ID, SensorEventType.ENGINE_ON));
    if (this.transportId) {
      await firstValueFrom(this.api.updateTransportStatus(this.transportId, TransportStatus.IN_PROGRESS));
    }
    const wp0 = this.currentWaypoints[0];
    if (wp0) this.mapView?.moveVehicle(wp0.lat, wp0.lon);
    if (this.latestTelemetry) {
      this.latestTelemetry = { ...this.latestTelemetry, engineOn: true, doorOpen: false };
    }
    this.steps[2].status = 'done';
    this.steps[2].subtitle = 'Двигателят е пуснат — маршрутът е АКТИВЕН';
    this.currentWaypointIndex = 1;
    await this.delay(2000);
  }

  private async stepGps(): Promise<void> {
    if (!this.routeId) throw new Error('Липсва маршрут');
    this.currentStep = 3;
    this.steps[3].status = 'loading';

    for (let i = this.currentWaypointIndex; i < this.currentWaypoints.length; i++) {
      if (this.aborted) return;
      await this.sendGpsPoint(this.currentWaypoints[i]);
      this.currentWaypointIndex = i + 1;
      await this.delay(3000);
    }

    this.steps[3].status = 'done';
    this.steps[3].subtitle = `${this.currentWaypoints.length} GPS точки изпратени`;
    await this.delay(1500);
  }

  private async stepGeofenceEnter(): Promise<void> {
    if (!this.routeId) throw new Error('Липсва маршрут');
    this.currentStep = 4;
    this.steps[4].status = 'loading';
    await firstValueFrom(this.sim.sendSensorEvent(this.routeId, VEHICLE_ID, SensorEventType.GEOFENCE_ENTER));
    await firstValueFrom(this.sim.sendSensorEvent(this.routeId, VEHICLE_ID, SensorEventType.ENGINE_OFF));
    if (this.transportId) {
      await firstValueFrom(this.api.updateTransportStatus(this.transportId, TransportStatus.COMPLETED));
    }
    if (this.latestTelemetry) {
      this.latestTelemetry = { ...this.latestTelemetry, engineOn: false, speed: 0, doorOpen: true };
    }
    this.steps[4].status = 'done';
    this.steps[4].subtitle = 'Крайната точка е достигната — маршрутът е ЗАВЪРШЕН';
    this.snack.open('🏁 Транспортът е завършен успешно!', 'OK', { duration: 4000 });
  }

  private async sendGpsPoint(wp: Waypoint): Promise<void> {
    if (!this.routeId) return;
    const speed = 70 + Math.floor(Math.random() * 30);
    const td: TelematicData = {
      lat: wp.lat, lon: wp.lon,
      speed, temperature: 18 + Math.floor(Math.random() * 6),
      doorOpen: false, engineOn: true
    };
    this.latestTelemetry = td;

    await firstValueFrom(this.sim.sendCoordinates({
      routeId: this.routeId,
      coordinates: [{ recordedAt: new Date().toISOString(), data: td }]
    }));

    this.mapView?.moveVehicle(wp.lat, wp.lon);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
