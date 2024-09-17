"use strict"

// inject font
hexo.extend.injector.register("head_end", () => {
  return `
    <style>
      @font-face {
        font-family: 'hytmr';
        font-style: normal;
        font-weight: normal;
        font-display: swap;
        src: url(https://cdn.coolchong.cn/%E5%AD%97%E4%BD%93%E6%A0%B7%E5%BC%8F/hytmr55.woff) format('woff');
      }    
    </style>
  `
})
