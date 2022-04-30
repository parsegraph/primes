import PrimesWidget from "./PrimesWidget";
import { BasicProjector, Projection } from "parsegraph-projector";
import Navport, { renderFullscreen } from "parsegraph-viewport";
import TimingBelt from "parsegraph-timingbelt";
import { elapsed } from "parsegraph-timing";
import Color from "parsegraph-color";

document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("demo");
  root.style.position = "relative";

  const primes = new PrimesWidget();

  const belt = new TimingBelt();

  const totalStart = new Date();
  const MAX_PRIME = 200;
  belt.setGovernor(false);
  belt.setBurstIdle(true);
  belt.queueJob(() => {
    console.log("Processing primes: " + primes.position + " of " + MAX_PRIME);
    if (!primes.isPaused() && primes.position <= MAX_PRIME) {
      primes.step();
    }
    primes.node().value().scheduleRepaint();
    belt.scheduleUpdate();
    if (primes.position > MAX_PRIME) {
      console.log("Done in " + elapsed(totalStart) + "ms");
    }
    return primes.position <= MAX_PRIME;
  });

  primes.step();

  const topElem = document.getElementById("demo");
  renderFullscreen(topElem, primes.node(), new Color(0, 0, 0, 1));
});
