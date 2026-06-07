import { Component, Input } from '@angular/core';
import { TransportStatus, RouteStatus } from '../../models/transport.model';

@Component({
  selector: 'app-status-badge',
  templateUrl: './status-badge.component.html',
  styleUrls: ['./status-badge.component.css']
})
export class StatusBadgeComponent {
  @Input() status: TransportStatus | RouteStatus | string = '';

  get cssClass(): string {
    switch (this.status) {
      case 'PLANNED':      return 'badge badge-planned';
      case 'PENDING':      return 'badge badge-pending';
      case 'IN_PROGRESS':  return 'badge badge-active';
      case 'ACTIVE':       return 'badge badge-active';
      case 'COMPLETED':    return 'badge badge-completed';
      case 'CANCELLED':    return 'badge badge-cancelled';
      default:             return 'badge';
    }
  }

  get label(): string {
    switch (this.status) {
      case 'PLANNED':      return 'Планиран';
      case 'PENDING':      return 'Изчакващ';
      case 'IN_PROGRESS':  return 'В движение';
      case 'ACTIVE':       return 'Активен';
      case 'COMPLETED':    return 'Завършен';
      case 'CANCELLED':    return 'Отменен';
      default:             return this.status;
    }
  }
}
