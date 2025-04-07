import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BudgetRoutingModule } from './budget/budget-routing.module';
import { BudgetModule } from './budget/budget.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BudgetRoutingModule,
    BudgetModule
],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
