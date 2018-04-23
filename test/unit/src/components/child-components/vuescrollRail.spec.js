/**
 * rail unit-test-file
 */
import {
  trigger
}from "test/util";

describe("test vueScrollRail component", () => {
  let ins = null;
  let vs = null;
  let data = deepMerge(globalData, {});
  beforeAll(() => {
    ins = new Vue({
      template,
      data
    }).$mount();
    vs = ins.$refs["vsIns"];
    document.body.appendChild(ins.$el);
  });
  afterAll(() => {
    ins.$destroy();
    document.body.removeChild(ins.$el);
  });
  it("test rail click", (done) => {
    // use a marco task to ensure that all components have been updated
    setTimeout(() => {
      trigger(vs.$refs["verticalRail"], "click");
      done();
    }, 0);
  });
  it("test rail and bar pos", (done) => {
    ins.ops.vRail["pos"] = "right";
    vs.forceUpdate();
    setTimeout(() => {
      expect(vs.$refs["verticalRail"].style.right).toBe("0px");
      expect(vs.$refs["verticalBar"].$el.style.right).toBe("0px");
      done();
    }, 0);
  });
});