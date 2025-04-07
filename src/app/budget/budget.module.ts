import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BudgetDetailComponent } from './budget-detail/budget-detail.component';
import { BudgetRoutingModule } from './budget-routing.module';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [BudgetDetailComponent],
  exports: [BudgetDetailComponent],
  imports: [
    CommonModule,
    BudgetRoutingModule,
    FormsModule
  ]
})
export class BudgetModule { }
