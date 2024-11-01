import { Component, Input } from "@angular/core";
import { ClassicPreset } from "rete";

export class ProgressControl extends ClassicPreset.Control {
  constructor(public percent: number) {
    super();
  }
}

@Component({
  selector: "app-button",
  template: `<nz-progress
    [nzPercent]="data.percent"
    nzType="circle"
  ></nz-progress>`
})
export class ProgressComponent {
  @Input() data: ProgressControl;
}
