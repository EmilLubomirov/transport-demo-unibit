import { Component, Input } from '@angular/core';
import { TelematicData } from '../../models/transport.model';

@Component({
  selector: 'app-telemetry-panel',
  templateUrl: './telemetry-panel.component.html',
  styleUrls: ['./telemetry-panel.component.css']
})
export class TelemetryPanelComponent {
  @Input() data: TelematicData | null = null;
  @Input() lastUpdate: string | null = null;
}
