import PrimesWidget from "./PrimesWidget";
import { BasicProjector, Projection } from "parsegraph-projector";
import { Viewport } from "parsegraph-graphpainter";
import TimingBelt from "parsegraph-timingbelt";
import {elapsed} from 'parsegraph-timing';

document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("demo");
  root.style.position = "relative";

  const primes = new PrimesWidget();

  const belt = new TimingBelt();

  var totalStart = new Date();
  var MAX_PRIME = 200;
  belt.setGovernor(false);
  belt.setBurstIdle(true);
  belt.queueJob(()=>{
    console.log("Processing primes: " + primes.position + " of " + MAX_PRIME)
    if(!primes.isPaused() && primes.position <= MAX_PRIME) {
      primes.step();
    }
    comp.scheduleRepaint();
    if(primes.position > MAX_PRIME) {
        console.log("Done in " + elapsed(totalStart) + "ms");
    }
    return primes.position <= MAX_PRIME;
  });

  primes.step();

  const comp = new Viewport(primes.node());
  primes.node().value().setOnScheduleUpdate(() => comp.scheduleUpdate());
  // const freezer = new Freezer();
  // root.value().getCache().freeze(freezer);

  window.addEventListener("resize", () => {
    belt.scheduleUpdate();
  });

  const topElem = document.getElementById("demo");

  const projector = new BasicProjector();
  projector.glProvider().container();
  projector.overlay();
  topElem.appendChild(projector.container());
  projector.container().style.position = "absolute";
  const proj = new Projection(projector, comp);
  belt.addRenderable(proj);

});
