import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Testexportjson67Page } from './testexportjson67.page';

const routes: Routes = [
  {
    path: '',
    component: Testexportjson67Page,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Testexportjson67PageRoutingModule {}
