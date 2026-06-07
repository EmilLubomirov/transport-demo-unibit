import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface DemoCompleteDialogData {
  transportId: number;
}

@Component({
  selector: 'app-demo-complete-dialog',
  templateUrl: './demo-complete-dialog.component.html',
  styleUrls: ['./demo-complete-dialog.component.css']
})
export class DemoCompleteDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DemoCompleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DemoCompleteDialogData
  ) {}
}
