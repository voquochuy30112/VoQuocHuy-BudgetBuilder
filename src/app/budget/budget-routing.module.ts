import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes } from '@angular/router';
import { DETAIL_ROUTE_PATH } from '../models/app-constants';
import { BudgetDetailComponent } from './budget-detail/budget-detail.component';

const routes: Routes = [
  {path: '', redirectTo: DETAIL_ROUTE_PATH, pathMatch: 'full'},
  {path: DETAIL_ROUTE_PATH, component: BudgetDetailComponent}
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class BudgetRoutingModule { }
