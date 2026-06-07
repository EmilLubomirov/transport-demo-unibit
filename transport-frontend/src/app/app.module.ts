import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Angular Material
import { MatToolbarModule }        from '@angular/material/toolbar';
import { MatButtonModule }         from '@angular/material/button';
import { MatIconModule }           from '@angular/material/icon';
import { MatCardModule }           from '@angular/material/card';
import { MatDialogModule }         from '@angular/material/dialog';
import { MatFormFieldModule }      from '@angular/material/form-field';
import { MatInputModule }          from '@angular/material/input';
import { MatSelectModule }         from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule }       from '@angular/material/snack-bar';
import { MatButtonToggleModule }   from '@angular/material/button-toggle';
import { MatTooltipModule }        from '@angular/material/tooltip';
import { MatDividerModule }        from '@angular/material/divider';
import { MatChipsModule }          from '@angular/material/chips';
import { MatTableModule }          from '@angular/material/table';
import { MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { BgPaginatorIntl } from './services/paginator-intl.service';

// Routing
import { AppRoutingModule } from './app-routing.module';

// Components
import { AppComponent }                    from './app.component';
import { StatusBadgeComponent }            from './components/status-badge/status-badge.component';
import { TelemetryPanelComponent }         from './components/telemetry-panel/telemetry-panel.component';
import { MapViewComponent }                from './components/map-view/map-view.component';
import { CreateTransportDialogComponent }  from './components/create-transport-dialog/create-transport-dialog.component';
import { CreateRouteDialogComponent }      from './components/create-route-dialog/create-route-dialog.component';
import { DemoCompleteDialogComponent }    from './components/demo-complete-dialog/demo-complete-dialog.component';

// Pages
import { DashboardComponent }        from './pages/dashboard/dashboard.component';
import { TransportDetailComponent }  from './pages/transport-detail/transport-detail.component';
import { DemoWizardComponent }       from './pages/demo-wizard/demo-wizard.component';

@NgModule({
  declarations: [
    AppComponent,
    StatusBadgeComponent,
    TelemetryPanelComponent,
    MapViewComponent,
    CreateTransportDialogComponent,
    CreateRouteDialogComponent,
    DashboardComponent,
    TransportDetailComponent,
    DemoWizardComponent,
    DemoCompleteDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatButtonToggleModule,
    MatTooltipModule,
    MatDividerModule,
    MatChipsModule,
    MatTableModule,
    MatPaginatorModule
  ],
  entryComponents: [
    CreateTransportDialogComponent,
    CreateRouteDialogComponent,
    DemoCompleteDialogComponent
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: BgPaginatorIntl }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
