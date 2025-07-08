import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InformationComponent } from './components/information/information.component';
import { PersoaneComponent } from './components/Persoane/Persoane.component';
import { MasiniComponent } from './components/Masini/Masini.component';

const routes: Routes = [
  { path: 'information', component: InformationComponent },
  { path: 'Masini', component: MasiniComponent },
  { path: 'Persoane', component: PersoaneComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
