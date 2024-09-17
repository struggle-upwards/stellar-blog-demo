"use strict"

// inject font
hexo.extend.injector.register("head_end", () => {
  return `
    <style>
    .medium-zoom-overlay {
      z-index: 20;
    }
    
    .medium-zoom-image {
      z-index: 21;
    }
    </style>
    <link href="https://cdn.jsdelivr.net/npm/medium-zoom@1.1.0/dist/style.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/medium-zoom@1.1.0/dist/medium-zoom.min.js"></script>
  `
})
hexo.extend.injector.register("body_end", function () {
  return `
  <script>
    mediumZoom(".l_body .content p img", { background: "var(--site-bg)" })
  </script>
  `
})
