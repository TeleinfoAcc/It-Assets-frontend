import { Routes } from '@angular/router';
import { MainlayoutComponent } from './mainlayout/mainlayout/mainlayout.component';
import { authGuard } from './core/guards/auth.guard';
import { LoginComponent } from './features/login/login.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    {
        path: '',
        component: MainlayoutComponent,
        canActivate: [authGuard],
        children: [
            // ✅ เพิ่มแค่นี้
            // { path: 'projects', component: ProjectListComponent },
            // { path: 'projects/:slug', component: ProjectViewComponent },
        ]
    },
    // { path: '**', component: DashboardComponent },
];