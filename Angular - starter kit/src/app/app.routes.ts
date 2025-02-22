import { Route, Routes } from '@angular/router';
import { LayoutComponent } from './layouts/layout/layout.component';


import { LogoutBasicComponent } from './account/auth/logout/logout-basic/logout-basic.component';

import { ResetPassBasicComponent } from './account/auth/reset-pass/reset-pass-basic/reset-pass-basic.component';
import { ResetPassCoverComponent } from './account/auth/reset-pass/reset-pass-cover/reset-pass-cover.component';
import { ResetPassBoxedComponent } from './account/auth/reset-pass/reset-pass-boxed/reset-pass-boxed.component';
import { ResetPassModernComponent } from './account/auth/reset-pass/reset-pass-modern/reset-pass-modern.component';

import { ComingSoonComponent } from './extrapages/coming-soon/coming-soon.component';
import { MaintenanceComponent } from './extrapages/maintenance/maintenance.component';
import { Error404Component } from './extrapages/error404/error404.component';
import { OfflineComponent } from './extrapages/offline/offline.component';
import { OnepageLandingComponent } from './landing/onepage-landing/onepage-landing.component';
import { ProductLandingComponent } from './landing/product-landing/product-landing.component';
import { AuthGuard } from './core/guards/auth.guard';
import { LoginComponent } from './account/login/login.component';
import { RegisterComponent } from './account/register/register.component';
import { UpdateProfileComponent } from './account/profile/update-profile/update-profile.component';

export const routes: Routes = [
    { 
        path: '', 
        component: LayoutComponent, 
        loadChildren: () => import('./pages/pages.route').then(mod => mod.PAGE_ROUTES), 
        canActivate: [AuthGuard] 
    },
    { path: 'account-login', component: LoginComponent },
    {path: '', redirectTo:'account-login', pathMatch: 'full'},
    { path: 'account-register', component: RegisterComponent }, 
    

    { path: 'auth-logout-basic', component: LogoutBasicComponent },
    

    { path: 'auth-reset-password-basic', component: ResetPassBasicComponent },
    { path: 'auth-reset-password-cover', component: ResetPassCoverComponent },
    { path: 'auth-reset-password-boxed', component: ResetPassBoxedComponent },
    { path: 'auth-reset-password-modern', component: ResetPassModernComponent },

    // Landing Pages
    { path: 'onepage-landing', component: OnepageLandingComponent },
    { path: 'product-landing', component: ProductLandingComponent },



    // extrapages
    { path: 'pages-coming-soon', component: ComingSoonComponent },
    { path: 'pages-maintenance', component: MaintenanceComponent },
    { path: 'pages-404', component: Error404Component },
    { path: 'pages-offline', component: OfflineComponent },

];


