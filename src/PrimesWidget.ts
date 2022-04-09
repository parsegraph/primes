import PrimesModulo from "./PrimesModulo";
import {DirectionCaret} from 'parsegraph-direction';
import Block from 'parsegraph-block';
import {Freezer} from 'parsegraph-artist';

export default class PrimesWidget {
  position: number;
  knownPrimes: PrimesModulo[];
  caret: DirectionCaret<Block>;
  _paused: boolean;
  _freezer: Freezer;

  constructor(caret: DirectionCaret<Block>, freezer:Freezer)
  {
    this._freezer = freezer;
    this.knownPrimes = [];
    this.position = 2;

    this.caret = caret;
    this.caret.node().value().setLabel("1");
  }

  isPaused()
  {
    return this._paused;
  };

  freezer() {
    return this._freezer;
  }

  step()
  {
    //console.log("Stepping primes widget");
    // Check if any known prime is a multiple of the current position.
    this.caret.spawnMove('f', 'b');
    this.caret.node().value().setLabel("" + this.position);
    this.caret.node().state().setId(this.position);
    this.caret.push();
    this.caret.pull('u');
    this.caret.crease();
    const freeze = !!this._freezer;
    freeze && this.caret.node().value().getCache().freeze(this.freezer());
    let isPrime = true;

    for(let i = 0; i < this.knownPrimes.length; ++i) {
        const prime = this.knownPrimes[i];
        const modulus = prime.calculate(this.position);
        if(modulus == 0) {
            // It's a multiple, so there's no chance for primality.
            this.caret.spawnMove('u', 'b');
            this.caret.node().value().setLabel("" + prime.frequency);
            isPrime = false;
        }
        else {
            this.caret.spawnMove('u', 's');
        }
        this.caret.node().state().setId(this.position + ":" + prime.frequency);
        if(i === 0) {
            this.caret.crease();
            freeze && this.caret.node().value().getCache().freeze(this.freezer());
        }
    }
    if(isPrime) {
        // The position is prime, so output it and add it to the list.
        this.caret.spawnMove('u', 'b');
        this.caret.node().value().setLabel("" + this.position);
        this.caret.node().state().setId(this.position + ":" + this.position);
        this.knownPrimes.push(new PrimesModulo(this.position));
    }
    this.caret.pop();

    // Advance.
    ++(this.position);
  };

  node()
  {
      return this.caret.root();
  };
}
