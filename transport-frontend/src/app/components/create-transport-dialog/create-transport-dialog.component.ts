import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { DEMO_ROUTES } from '../../models/transport.model';

@Component({
  selector: 'app-create-transport-dialog',
  templateUrl: './create-transport-dialog.component.html',
  styleUrls: ['./create-transport-dialog.component.css']
})
export class CreateTransportDialogComponent {
  form: FormGroup;
  demoRoutes = Object.keys(DEMO_ROUTES);

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateTransportDialogComponent>
  ) {
    this.form = this.fb.group({
      origin:           ['', Validators.required],
      destination:      ['', Validators.required],
      plannedDeparture: [''],
      plannedArrival:   ['']
    });
  }

  applyPreset(key: string): void {
    const route = DEMO_ROUTES[key];
    if (route) {
      this.form.patchValue({
        origin: route.origin,
        destination: route.destination
      });
    }
  }

  submit(): void {
    if (this.form.invalid) return;
    const v = this.form.value;
    this.dialogRef.close({
      origin: v.origin,
      destination: v.destination,
      plannedDeparture: v.plannedDeparture ? new Date(v.plannedDeparture).toISOString() : undefined,
      plannedArrival:   v.plannedArrival   ? new Date(v.plannedArrival).toISOString()   : undefined
    });
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
