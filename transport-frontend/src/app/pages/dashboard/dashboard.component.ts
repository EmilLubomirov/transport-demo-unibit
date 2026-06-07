import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Transport, TransportStatus } from '../../models/transport.model';
import { TransportApiService } from '../../services/transport-api.service';
import { CreateTransportDialogComponent } from '../../components/create-transport-dialog/create-transport-dialog.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  dataSource = new MatTableDataSource<Transport>([]);
  loading = false;
  displayedColumns = ['id', 'route', 'status', 'plannedDeparture', 'plannedArrival', 'actualDeparture', 'actualArrival', 'actions'];

  get transports(): Transport[] { return this.dataSource.data; }

  get statPlanned()    { return this.transports.filter(t => t.status === TransportStatus.PLANNED).length; }
  get statInProgress() { return this.transports.filter(t => t.status === TransportStatus.IN_PROGRESS).length; }
  get statCompleted()  { return this.transports.filter(t => t.status === TransportStatus.COMPLETED).length; }

  constructor(
    private readonly api: TransportApiService,
    private readonly router: Router,
    private readonly dialog: MatDialog,
    private readonly snack: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.api.listTransports().subscribe({
      next: data => {
        this.dataSource.data = data;
        this.loading = false;
        setTimeout(() => { this.dataSource.paginator = this.paginator; });
      },
      error: () => { this.loading = false; this.snack.open('Грешка при зареждане', 'OK', { duration: 3000 }); }
    });
  }

  openCreate(): void {
    const ref = this.dialog.open(CreateTransportDialogComponent, { width: '480px' });
    ref.afterClosed().subscribe(result => {
      if (result) {
        this.api.createTransport(result).subscribe({
          next: t => {
            this.dataSource.data = [t, ...this.dataSource.data];
            this.snack.open(`Транспорт #${t.id} създаден`, 'OK', { duration: 3000 });
          },
          error: () => this.snack.open('Грешка при създаване', 'OK', { duration: 3000 })
        });
      }
    });
  }

  openDetail(id: number): void {
    this.router.navigate(['/transports', id]);
  }

  formatDate(iso?: string): string {
    if (!iso) return '—';
    return new Date(iso).toLocaleString('bg-BG', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }
}
