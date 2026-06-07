import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent }       from './pages/dashboard/dashboard.component';
import { TransportDetailComponent } from './pages/transport-detail/transport-detail.component';
import { DemoWizardComponent }      from './pages/demo-wizard/demo-wizard.component';

const routes: Routes = [
  { path: '',              component: DashboardComponent },
  { path: 'transports/:id', component: TransportDetailComponent },
  { path: 'demo',          component: DemoWizardComponent },
  { path: '**',            redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
