import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-create-route-dialog',
  templateUrl: './create-route-dialog.component.html',
  styleUrls: ['./create-route-dialog.component.css']
})
export class CreateRouteDialogComponent {
  form: FormGroup;

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

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateRouteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { transportId: number; origin: string; destination: string }
  ) {
    this.form = this.fb.group({
      driverId:   [1, Validators.required],
      vehicleId:  [101, Validators.required],
      startPoint: [data.origin  || ''],
      endPoint:   [data.destination || ''],
      distance:   ['']
    });
  }

  submit(): void {
    if (this.form.invalid) return;
    const v = this.form.value;
    this.dialogRef.close({
      transportId: this.data.transportId,
      driverId:    v.driverId,
      vehicleId:   v.vehicleId,
      startPoint:  v.startPoint || undefined,
      endPoint:    v.endPoint   || undefined,
      distance:    v.distance   ? +v.distance : undefined
    });
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
