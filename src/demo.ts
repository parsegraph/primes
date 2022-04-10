import PrimesWidget from "./PrimesWidget";
import { BasicProjector, Projection } from "parsegraph-projector";
import { GraphPainter } from "parsegraph-graphpainter";
import TimingBelt from "parsegraph-timingbelt";

document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("demo");
  root.style.position = "relative";

  const widget = new PrimesWidget();
  const painter = new GraphPainter(widget.node());

  const projector = new BasicProjector();

  const belt = new TimingBelt();
  const proj = new Projection(projector, painter);
  belt.addRenderable(proj);

  root.appendChild(projector.container());
});
