export enum TransportStatus {
  PLANNED = 'PLANNED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum RouteStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum SensorEventType {
  ENGINE_ON = 'ENGINE_ON',
  ENGINE_OFF = 'ENGINE_OFF',
  DOOR_OPEN = 'DOOR_OPEN',
  DOOR_CLOSE = 'DOOR_CLOSE',
  GEOFENCE_ENTER = 'GEOFENCE_ENTER',
  GEOFENCE_EXIT = 'GEOFENCE_EXIT'
}

export interface TelematicData {
  lat: number;
  lon: number;
  speed: number;
  temperature: number;
  doorOpen: boolean;
  engineOn: boolean;
}

export interface Transport {
  id: number;
  origin: string;
  destination: string;
  status: TransportStatus;
  plannedDeparture?: string;
  plannedArrival?: string;
  actualDeparture?: string;
  actualArrival?: string;
  eta?: string;
  routeIds: number[];
}

export interface Route {
  id: number;
  transportId: number;
  driverId: number;
  vehicleId: number;
  avgSpeed?: number;
  startPoint?: string;
  endPoint?: string;
  distance?: number;
  status: RouteStatus;
}

export interface RouteCoordinate {
  id: number;
  routeId: number;
  recordedAt: string;
  serverTime: string;
  telematicData: TelematicData;
}

export interface CreateTransportRequest {
  origin: string;
  destination: string;
  plannedDeparture?: string;
  plannedArrival?: string;
}

export interface CreateRouteRequest {
  transportId: number;
  driverId: number;
  vehicleId: number;
  startPoint?: string;
  endPoint?: string;
  distance?: number;
}

export interface CoordinateEntry {
  recordedAt: string;
  data: TelematicData;
}

export interface SensorEventRequest {
  routeId: number;
  vehicleId: number;
  eventType: SensorEventType;
  occurredAt: string;
  metadata?: Record<string, string>;
}

export interface CoordinateBatchRequest {
  routeId: number;
  coordinates: CoordinateEntry[];
}

export interface Waypoint {
  lat: number;
  lon: number;
  label: string;
}

export const DRIVER_NAMES: Record<number, string> = {
  1: 'Иван Петров',
  2: 'Георги Димитров',
  3: 'Мария Стоянова'
};

export const VEHICLE_NAMES: Record<number, string> = {
  101: 'TH-4521-BG | Volvo FH16',
  102: 'CB-8834-BG | Mercedes Actros',
  103: 'PB-2210-BG | MAN TGX'
};

export const DEMO_ROUTES: Record<string, { origin: string; destination: string; waypoints: Waypoint[] }> = {
  'София → Пловдив': {
    origin: 'София',
    destination: 'Пловдив',
    waypoints: [
      { lat: 42.6977, lon: 23.3219, label: 'София' },
      { lat: 42.66, lon: 23.42, label: 'Дружба' },
      { lat: 42.64, lon: 23.58, label: 'Елин Пелин' },
      { lat: 42.59, lon: 23.7, label: 'Костенец' },
      { lat: 42.48, lon: 23.84, label: 'Ихтиман' },
      { lat: 42.39, lon: 24, label: 'Белово' },
      { lat: 42.3, lon: 24.2, label: 'Ветрен' },
      { lat: 42.22, lon: 24.35, label: 'Пазарджик' },
      { lat: 42.17, lon: 24.55, label: 'Зап. Пловдив' },
      { lat: 42.1354, lon: 24.7453, label: 'Пловдив' }
    ]
  },
  'София → Варна': {
    origin: 'София',
    destination: 'Варна',
    waypoints: [
      { lat: 42.6977, lon: 23.3219, label: 'София' },
      { lat: 42.78, lon: 23.75, label: 'Ботевград' },
      { lat: 42.9, lon: 24.7, label: 'Ловеч' },
      { lat: 43.08, lon: 25.62, label: 'В. Търново' },
      { lat: 43.27, lon: 26.92, label: 'Шумен' },
      { lat: 43.2, lon: 27.45, label: 'Провадия' },
      { lat: 43.2141, lon: 27.9147, label: 'Варна' }
    ]
  },
  'Пловдив → Бургас': {
    origin: 'Пловдив',
    destination: 'Бургас',
    waypoints: [
      { lat: 42.1354, lon: 24.7453, label: 'Пловдив' },
      { lat: 42.1, lon: 25, label: 'Брезово' },
      { lat: 42.15, lon: 25.5, label: 'Стара Загора' },
      { lat: 42.3, lon: 26, label: 'Нова Загора' },
      { lat: 42.49, lon: 26.5, label: 'Сливен' },
      { lat: 42.5, lon: 27.1, label: 'Карнобат' },
      { lat: 42.5048, lon: 27.4626, label: 'Бургас' }
    ]
  },
  'София → Русе': {
    origin: 'София',
    destination: 'Русе',
    waypoints: [
      { lat: 42.6977, lon: 23.3219, label: 'София' },
      { lat: 42.78, lon: 23.75,  label: 'Ботевград' },
      { lat: 43.08, lon: 24.62,  label: 'Плевен' },
      { lat: 43.41, lon: 25.07,  label: 'Бяла' },
      { lat: 43.6, lon: 25.6,    label: 'Павликени' },
      { lat: 43.84, lon: 25.95,  label: 'Русе' }
    ]
  },
  'Варна → Бургас': {
    origin: 'Варна',
    destination: 'Бургас',
    waypoints: [
      { lat: 43.2141, lon: 27.9147, label: 'Варна' },
      { lat: 42.98,   lon: 27.83,   label: 'Обзор' },
      { lat: 42.83,   lon: 27.7,    label: 'Несебър' },
      { lat: 42.69,   lon: 27.62,   label: 'Поморие' },
      { lat: 42.5048, lon: 27.4626, label: 'Бургас' }
    ]
  },
  'София → Благоевград': {
    origin: 'София',
    destination: 'Благоевград',
    waypoints: [
      { lat: 42.6977, lon: 23.3219, label: 'София' },
      { lat: 42.57,   lon: 23.28,   label: 'Бояна' },
      { lat: 42.4,    lon: 23.22,   label: 'Перник' },
      { lat: 42.24,   lon: 23.15,   label: 'Дупница' },
      { lat: 42.02,   lon: 23.1,    label: 'Благоевград' }
    ]
  }
};
