import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module')
                      .then( m => m.HomePageModule)
  },
  {
    path: 'test2dbs',
    loadChildren: () => import('./test2dbs/test2dbs.module')
                      .then( m => m.Test2dbsPageModule)
  },
  {
    path: 'upgradeversion',
    loadChildren: () => 
        import('./testupgradeversion/testupgradeversion.module')
                      .then( m => m.TestupgradeversionPageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
