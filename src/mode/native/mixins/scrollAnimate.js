import { requestAnimationFrame } from 'core/third-party/scroller/requestAnimationFrame';

function noop() {
  return true;
}

/* istanbul ignore next */
const now =
  Date.now ||
  function() {
    return new Date().getTime();
  };

export default class ScrollControl {
  constructor() {
    this.st = 0;
    this.ed = 0;
    this.df = 0;
    this.spd = 0;
    this.ts = 0;

    this.isRunning = false;
  }

  startScroll(
    st,
    ed,
    spd,
    stepCb = noop,
    completeCb = noop,
    vertifyCb = noop,
    easingMethod = noop
  ) {
    if (!this.isRunning) {
      this.st = st;
      this.ed = ed;
    }

    this.spd = spd;
    this.df += ed - st;

    this.completeCb = completeCb;
    this.vertifyCb = vertifyCb;
    this.stepCb = stepCb;
    this.easingMethod = easingMethod;

    this.ref = requestAnimationFrame(window);

    if (!this.isRunning) this.execScroll();
  }

  execScroll() {
    this.ts = now();
    let percent = 0;
    this.isRunning = true;

    const loop = () => {
      /* istanbul ignore if */
      if (!this.isRunning || !this.vertifyCb(percent)) {
        this.isRunning = false;
        return;
      }

      percent = (now() - this.ts) / this.spd;
      if (percent < 1) {
        const value = this.st + this.df * this.easingMethod(percent);
        this.stepCb(value);
        this.ref(loop);
      } else {
        // trigger complete
        this.stepCb(this.st + this.df);
        this.completeCb();
        this.isRunning = false;
        this.df = 0;
      }
    };

    this.ref(loop);
  }
}
