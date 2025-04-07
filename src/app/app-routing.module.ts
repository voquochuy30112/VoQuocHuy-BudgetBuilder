import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BUDGET_ROUTE_PATH } from './models/app-constants';

const routes: Routes = [
  {
    path: '',
    redirectTo: BUDGET_ROUTE_PATH,
    pathMatch: 'full',
  },
  {
    path: BUDGET_ROUTE_PATH,
    loadChildren: () => import('./budget/budget.module').then((m) => m.BudgetModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
