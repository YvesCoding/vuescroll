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
    this.init();

    this.isRunning = false;
  }

  pause() {
    /* istanbul ignore if */
    if (!this.isRunning) return;

    this.isPaused = true;
  }

  stop() {
    this.isStopped = true;
  }

  continue() {
    /* istanbul ignore if */
    if (!this.isPaused) return;

    this.isPaused = false;
    this.ts = now() - this.percent * this.spd;
    this.execScroll();
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
    const df = ed - st;
    const dir = df > 0 ? -1 : 1;
    const nt = now();

    if (!this.isRunning) {
      this.init();
    }

    if (dir != this.dir || nt - this.ts > 200) {
      this.ts = nt;

      this.dir = dir;
      this.st = st;
      this.ed = ed;
      this.df = df;
    } /* istanbul ignore next */ else {
      this.df += df;
    }

    this.spd = spd;

    this.completeCb = completeCb;
    this.vertifyCb = vertifyCb;
    this.stepCb = stepCb;
    this.easingMethod = easingMethod;

    if (!this.isRunning) this.execScroll();
  }

  execScroll() {
    if (!this.df) return;

    let percent = this.percent || 0;
    this.percent = 0;
    this.isRunning = true;

    const loop = () => {
      /* istanbul ignore if */
      if (!this.isRunning || !this.vertifyCb(percent) || this.isStopped) {
        this.isRunning = false;
        return;
      }

      percent = (now() - this.ts) / this.spd;

      if (this.isPaused) {
        this.percent = percent;
        this.isRunning = false;
        return;
      }

      if (percent < 1) {
        const value = this.st + this.df * this.easingMethod(percent);
        this.stepCb(value);
        this.ref(loop);
      } else {
        // trigger complete
        this.stepCb(this.st + this.df);
        this.completeCb();

        this.isRunning = false;
      }
    };

    this.ref(loop);
  }

  init() {
    this.st = 0;
    this.ed = 0;
    this.df = 0;
    this.spd = 0;
    this.ts = 0;
    this.dir = 0;
    this.ref = requestAnimationFrame(window);

    this.isPaused = false;
    this.isStopped = false;
  }
}
