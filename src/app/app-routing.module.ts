import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { CustomPreloadingService } from './shared/custom-preloading.service';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'employees',
    // set the preload property to true, using the route data property
    // If you do not want the module to be preloaded set it to false
    data: { preload: true },
    loadChildren: () =>
      import('./employees/employees.module').then((m) => m.EmployeesModule),
  },
  { path: 'home', component: HomeComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: CustomPreloadingService,
    }),
    // RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }), // For Preloading Modulas
    // RouterModule.forRoot(routes, { preloadingStrategy: NoPreloading }), // For Disabling  Preloading Modules
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
