import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { RegisterComponent } from './components/register/register.component';
import { LayoutComponent } from './components/layout/layout.component';
import { GraphConfigComponent } from './components/graph-config/graph-config.component';
import { NgModule } from '@angular/core';
import { RiotApiChampionWinrateComponent } from './components/riot-api-champion-winrate/riot-api-champion-winrate.component';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
    { path: 'login', component: LoginComponent },
    { path: 'graph', component: GraphConfigComponent, canActivate: [AuthGuard]},
    { path: 'register', component: RegisterComponent },
    { path: 'riotgames', component: RiotApiChampionWinrateComponent, canActivate: [AuthGuard]},
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: '**', component: DashboardComponent, canActivate: [AuthGuard]},
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
