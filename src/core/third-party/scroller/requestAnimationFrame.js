export function requestAnimationFrame(global) {
  // Check for request animation Frame support
  var requestFrame =
    global.requestAnimationFrame ||
    global.webkitRequestAnimationFrame ||
    global.mozRequestAnimationFrame ||
    global.oRequestAnimationFrame;
  var isNative = !!requestFrame;

  if (
    requestFrame &&
    !/requestAnimationFrame\(\)\s*\{\s*\[native code\]\s*\}/i.test(
      requestFrame.toString()
    )
  ) {
    isNative = false;
  }

  if (isNative) {
    return function(callback, root) {
      requestFrame(callback, root);
    };
  }

  var TARGET_FPS = 60;
  var requests = {};
  var rafHandle = 1;
  var intervalHandle = null;
  var lastActive = +new Date();

  return function(callback) {
    var callbackHandle = rafHandle++;

    // Store callback
    requests[callbackHandle] = callback;

    // Create timeout at first request
    if (intervalHandle === null) {
      intervalHandle = setInterval(function() {
        var time = +new Date();
        var currentRequests = requests;

        // Reset data structure before executing callbacks
        requests = {};

        for (var key in currentRequests) {
          if (currentRequests.hasOwnProperty(key)) {
            currentRequests[key](time);
            lastActive = time;
          }
        }

        // Disable the timeout when nothing happens for a certain
        // period of time
        if (time - lastActive > 2500) {
          clearInterval(intervalHandle);
          intervalHandle = null;
        }
      }, 1000 / TARGET_FPS);
    }

    return callbackHandle;
  };
}
