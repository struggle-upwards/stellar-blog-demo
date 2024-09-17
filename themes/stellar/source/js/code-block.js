const copyText = '<i class="fa-solid fa-window-restore"></i>';
const copySuccess = '<i class="fa-solid fa-check-double"></i>';
const openText = '<i class="fa-solid fa-angles-down fa-beat-fade"></i> 展开';
const closeText = '<i class="fa-solid fa-angles-up fa-beat-fade"></i> 收起';
const fullOpen = '<i class="fa-solid fa-expand"></i>';
const fullClose = '<i class="fa-solid fa-compress"></i>';
const downTest = '<i class="fa-solid fa-download"></i>';

const codeElements = document.querySelectorAll('td.code');

codeElements.forEach(async (code, index) => {
  const figure = code.closest('figure');
  const preCode = code.querySelector('pre').firstElementChild;
  const preGutter = code.parentElement.firstElementChild;
  let codeCopyOver = null

  preCode.id = `CodeBlock${index + 1}`;
  preCode.classList.add('code-collapsed');
  preGutter.classList.add('pre-gutter-collapsed');


  // Check code block height
  if (preCode.scrollHeight > 500) {
    preGutter.classList.add('pre-gutter-collapsed');

    const codeCopyDiv = document.createElement('div');
    codeCopyDiv.classList.add('CodeCloseDiv');
    figure.appendChild(codeCopyDiv);

    codeCopyOver = document.createElement('button');
    console.log(codeCopyOver);
    codeCopyOver.classList.add('CodeClose');
    codeCopyOver.innerHTML = openText;
    const description = figure.querySelector('figcaption') || figure.children[1];
    description.appendChild(codeCopyOver);

    codeCopyOver.addEventListener('click', () => {
      if (preCode.classList.contains('code-collapsed')) {
        preCode.classList.replace('code-collapsed', 'code-expanded');
        preGutter.classList.replace('pre-gutter-collapsed', 'pre-gutter-expanded');
        codeCopyOver.innerHTML = closeText;
      } else {
        preCode.classList.replace('code-expanded', 'code-collapsed');
        preGutter.classList.replace('pre-gutter-expanded', 'pre-gutter-collapsed');
        codeCopyOver.innerHTML = openText;
        figure.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Copy button
  const codeCopyBtn = document.createElement('div');
  codeCopyBtn.classList.add('copy-btn', 'more-btn');
  codeCopyBtn.innerHTML = copyText;
  code.appendChild(codeCopyBtn);

  codeCopyBtn.addEventListener('click', async () => {
    await copyCode(code.querySelector('pre')?.innerText);
    codeCopyBtn.innerHTML = copySuccess;
    codeCopyBtn.classList.add('success');
    setTimeout(() => {
      codeCopyBtn.innerHTML = copyText;
      codeCopyBtn.classList.remove('success');
    }, 3000);
  });

  // Fullscreen button
  const codeFullBtn = document.createElement('div');
  codeFullBtn.classList.add('full-btn', 'more-btn');
  codeFullBtn.innerHTML = fullOpen;
  code.appendChild(codeFullBtn);

  codeFullBtn.addEventListener('click', async () => {
    if (codeFullBtn.innerHTML === fullClose) {
      codeFullBtn.innerHTML = fullOpen;
      await exitFullscreen();
    } else {
      try {
        await openFullscreen();
        codeFullBtn.innerHTML = fullClose;
        ['fullscreenchange', 'mozfullscreenchange', 'webkitfullscreenchange', 'msfullscreenchange']
          .forEach(event => document.addEventListener(event, handleFullscreenChange));
      } catch (err) {
        console.error('全屏请求失败：', err);
      }
    }
  });

  // Handle fullscreen change
  const handleFullscreenChange = () => {
    if (!document.fullscreenElement && !document.mozFullScreenElement &&
      !document.webkitFullscreenElement && !document.msFullscreenElement) {
      if (codeFullBtn.innerHTML === fullClose) {
        codeFullBtn.innerHTML = fullOpen;
      }
      ['fullscreenchange', 'mozfullscreenchange', 'webkitfullscreenchange', 'msfullscreenchange']
        .forEach(event => document.removeEventListener(event, handleFullscreenChange));
    }
  };

  // Fullscreen functions
  const openFullscreen = async () => {
    await (figure.requestFullscreen() || figure.mozRequestFullScreen() || figure.webkitRequestFullscreen() || figure.msRequestFullscreen());
    if (preCode.classList.contains('code-collapsed')) {
      preCode.classList.replace('code-collapsed', 'code-expanded');
      preGutter.classList.replace('pre-gutter-collapsed', 'pre-gutter-expanded');
      codeCopyOver.innerHTML = closeText;
    }
  };

  const exitFullscreen = async () => {
    await (document.exitFullscreen() || document.mozCancelFullScreen() || document.webkitExitFullscreen() || document.msExitFullscreen());
    if (preCode.classList.contains('code-expanded')) {
      preCode.classList.replace('code-expanded', 'code-collapsed');
      preGutter.classList.replace('pre-gutter-expanded', 'pre-gutter-collapsed');
      codeCopyOver.innerHTML = openText;
    }
  };

  // Download button
  const codeDownBtn = document.createElement('div');
  codeDownBtn.classList.add('down-btn', 'more-btn');
  codeDownBtn.innerHTML = downTest;
  code.appendChild(codeDownBtn);

  const blob = new Blob([code.innerText], { type: 'text/plain' });
  const formatFileSize = (sizeInBytes) => {
    const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let size = sizeInBytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    return `${size.toFixed(2)} ${units[unitIndex]}`;
  };

  codeDownBtn.addEventListener('click', () => {
    const figcaption = figure.querySelector('figcaption');
    const fileNamePattern = /^[^\/\\]+\.\w+$/;
    let fileName = figcaption ? figcaption.innerText : 'demo';
    if (!fileNamePattern.test(fileName)) {
      const suffix = window.getComputedStyle(code, ':before').getPropertyValue('content').replaceAll('"', '').toLowerCase() || '';
      fileName += suffix ? `.${suffix}` : '';
    }
    fileName = fileNamePattern.test(fileName) ? fileName : `${fileName}.txt`;

    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = fileName;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    codeDownBtn.classList.add('success');
    setTimeout(() => {
      codeDownBtn.classList.remove('success');
    }, 3000);
  });
});

async function copyCode(currentCode) {
  if (navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(currentCode);
    } catch (error) {
      console.error(error);
    }
  } else {
    console.error('当前浏览器不支持此API');
  }
}