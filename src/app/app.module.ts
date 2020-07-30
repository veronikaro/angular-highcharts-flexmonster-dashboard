import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { FlexmonsterPivotModule } from "ng-flexmonster";
import { DashboardComponent } from "./dashboard/dashboard.component";

@NgModule({
  declarations: [AppComponent, DashboardComponent],
  imports: [BrowserModule, FlexmonsterPivotModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
