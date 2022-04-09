import PrimesModulo from "./PrimesModulo";
import Direction, {DirectionNode, DirectionCaret} from 'parsegraph-direction';
import {style} from 'parsegraph-block';
import Color from 'parsegraph-color';
import ActionCarousel from 'parsegraph-actioncarousel';

export default class PrimesWidget {
  position: number;
  knownPrimes: PrimesModulo[];
  caret: DirectionCaret;
  _paused: boolean;

  constructor()
  {
      this.knownPrimes = [];
      this.position = 2;

      this.caret = new DirectionCaret();
      this.caret.setMathMode(true);
      this.caret.label("1");

      var carousel = new ActionCarousel();
      carousel.addAction("Pause", function() {
          this._paused = !this._paused;
      }, this);
      carousel.install(this.caret.node());
  }

  isPaused()
  {
      return this._paused;
  };

  step()
  {
      //console.log("Stepping primes widget");
      // Check if any known prime is a multiple of the current position.
      this.caret.spawnMove('f', 'b');
      this.caret.label(this.position);
      this.caret.node()._id = this.position;
      this.caret.push();
      this.caret.pull('u');
      this.caret.crease();
      var freeze = false;
      freeze && this.caret.freeze();
      var isPrime = true;

      function addHighlights(dir:Direction) {
          var carousel = new ActionCarousel();
          var world = this.world();
          carousel.addAction("Highlight", function() {
              var bs = style('s', true);
              bs.backgroundColor = new Color(1, 1, 1, 1);
              for(var n = this; n; n = n.nodeAt(dir)) {
                  if(n.type() === parsegraph_SLOT) {
                      n.setBlockStyle(bs);
                  }
              }
              console.log("Highlighted node " + this.label());
              world.scheduleRepaint();
          }, this.caret.node());
          carousel.addAction("Unhighlight", function() {
              var bs = style('s', true);
              for(var n = this; n; n = n.nodeAt(dir)) {
                  if(n.type() === parsegraph_SLOT) {
                      n.setBlockStyle(bs);
                  }
              }
              console.log("Unhighlighted node " + this.label());
              world.scheduleRepaint();
          }, this.caret.node());
          carousel.install(this.caret.node());
      };

      for(var i = 0; i < this.knownPrimes.length; ++i) {
          var prime = this.knownPrimes[i];
          const modulus = prime.calculate(this.position);
          if(modulus == 0) {
              // It's a multiple, so there's no chance for primality.
              this.caret.spawnMove('u', 'b');
              this.caret.label(prime.frequency);
              isPrime = false;
          }
          else {
              this.caret.spawnMove('u', 's');
          }
          this.caret.node()._id = this.position + ":" + prime.frequency;
          if(i === 0) {
              this.caret.crease();
              freeze && this.caret.freeze();
          }
      }
      if(isPrime) {
          // The position is prime, so output it and add it to the list.
          this.caret.spawnMove('u', 'b');
          this.caret.label(this.position);
          this.caret.node()._id = this.position + ":" + this.position;
          addHighlights.call(this, Direction.DOWNWARD);
          this.knownPrimes.push(new PrimesModulo(this.position));
      }
      this.caret.pop();
      addHighlights.call(this, Direction.UPWARD);

      // Advance.
      ++(this.position);
  };

  node()
  {
      return this.caret.root();
  };
}

