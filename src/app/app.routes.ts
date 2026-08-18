import { Routes } from '@angular/router';
import { MainlayoutComponent } from './mainlayout/mainlayout/mainlayout.component';
import { authGuard } from './core/guards/auth.guard';
import { LoginComponent } from './features/login/login.component';
import { AssetsComponent } from './features/assets/assets.component';
import { AssetRentComponent } from './features/asset-rent/asset-rent.component';
import { UpdateAssetsComponent } from './features/update-assets/update-assets.component';
import { UpdateAssetsRentComponent } from './features/update-assets-rent/update-assets-rent.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    {
        path: '',
        component: MainlayoutComponent,
        canActivate: [authGuard],
        children: [
            { path: 'dashboard', component: DashboardComponent },
            { path: 'assets', component: AssetsComponent },
            { path: 'asset-rent', component: AssetRentComponent },
            { path: 'update-assets', component: UpdateAssetsComponent },
            { path: 'update-assets-rent', component: UpdateAssetsRentComponent },
        ]
    },
    // { path: '**', component: DashboardComponent },
];