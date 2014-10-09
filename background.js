chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('index.html', {
    "id": "cziHappy8Puzzle",
    "bounds": {
      "width": 400,
      "height": 700
    },
    /* "maxWidth": 380,
    "maxHeight": 617, */
    "frame": "none",
    "resizable": false,
    "transparentBackground": true,
  });
});