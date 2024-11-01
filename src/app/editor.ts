import { Injector } from "@angular/core";
import { NodeEditor, GetSchemes, ClassicPreset } from "rete";
import { AreaPlugin, AreaExtensions } from "rete-area-plugin";
import {
  ConnectionPlugin,
  Presets as ConnectionPresets,
} from "rete-connection-plugin";
import {
  AngularPlugin,
  Presets,
  ControlComponent,
  AngularArea2D,
} from "rete-angular-plugin/15";
import { ButtonComponent, ButtonControl } from "./custom-button.component";
import {
  ProgressComponent,
  ProgressControl,
} from "./custom-progress.component";

type Schemes = GetSchemes<
  ClassicPreset.Node,
  ClassicPreset.Connection<ClassicPreset.Node, ClassicPreset.Node>
>;
type AreaExtra = AngularArea2D<Schemes>;

export async function createEditor(container: HTMLElement, injector: Injector) {
  const socket = new ClassicPreset.Socket("socket");

  const editor = new NodeEditor<Schemes>();
  const area = new AreaPlugin<Schemes, AreaExtra>(container);
  const connection = new ConnectionPlugin<Schemes, AreaExtra>();
  const render = new AngularPlugin<Schemes, AreaExtra>({ injector });

  AreaExtensions.selectableNodes(area, AreaExtensions.selector(), {
    accumulating: AreaExtensions.accumulateOnCtrl(),
  });

  render.addPreset(
    Presets.classic.setup({
      customize: {
        control(data) {
          if (data.payload instanceof ButtonControl) {
            return ButtonComponent;
          }
          if (data.payload instanceof ProgressControl) {
            return ProgressComponent;
          }
          if (data.payload instanceof ClassicPreset.InputControl) {
            return ControlComponent;
          }
          return null;
        },
      },
    })
  );

  connection.addPreset(ConnectionPresets.classic.setup());

  editor.use(area);
  area.use(connection);
  area.use(render);

  AreaExtensions.simpleNodesOrder(area);

  const a = new ClassicPreset.Node("A");
  a.addOutput("a", new ClassicPreset.Output(socket));

  const progressControl = new ProgressControl(0);
  const inputControl = new ClassicPreset.InputControl("number", {
    initial: 0,
    change(value) {
      progressControl.percent = value;
      area.update("control", progressControl.id);
    },
  });

  a.addControl("input", inputControl);
  a.addControl("progress", progressControl);
  a.addControl(
    "button",
    new ButtonControl("Randomize", () => {
      const percent = Math.round(Math.random() * 100);

      inputControl.setValue(percent);
      area.update("control", inputControl.id);

      progressControl.percent = percent;
      area.update("control", progressControl.id);
    })
  );
  await editor.addNode(a);

  AreaExtensions.zoomAt(area, editor.getNodes());

  return () => area.destroy();
}
