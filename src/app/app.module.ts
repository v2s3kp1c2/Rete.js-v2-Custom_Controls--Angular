import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { NzButtonModule } from "ng-zorro-antd/button";
import { NzProgressModule } from "ng-zorro-antd/progress";
import { AppComponent } from "./app.component";
import { ButtonComponent } from "./custom-button.component";
import { ProgressComponent } from "./custom-progress.component";

@NgModule({
  declarations: [AppComponent, ButtonComponent, ProgressComponent],
  imports: [BrowserModule, NzButtonModule, NzProgressModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
