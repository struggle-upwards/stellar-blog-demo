const message = {
    toast: (msg, duration) => {
        const d = Number(isNaN(duration) ? 2000 : duration);
        var el = document.createElement('div');
        el.classList.add('toast');
        el.classList.add('show');
        el.innerHTML = msg;
        document.body.appendChild(el);

        setTimeout(function () { document.body.removeChild(el) }, d);
    },
}

const Config = {
    snow: ['❄️', '☃️', '❄', '※', '❅', '❆', '❈', '❉', '❊', '❋'],
    color: '#d9e2e7',
    speed: 10,
    dom: document.getElementsByTagName('body')[0],
    interval: 800,
    active: false
};

// 从 localStorage 获取雪花模式状态
const storedSnowActive = localStorage.getItem('snowActive');
Config.active = storedSnowActive === 'true';

// 确保 DOM 元素存在
if (!Config.dom) {
    throw Error('请获取存在的DOM');
}

const $canvas = document.createElement('div');

function useStyle(dom, style) {
    for (let sKey in style) {
        dom.style[sKey] = style[sKey];
    }
}

useStyle($canvas, {
    width: '100%',
    height: '100%',
    position: 'fixed',
    top: 0,
    left: 0,
    pointerEvents: 'none',
    zIndex: 100
});

const matchDarkMode = window.matchMedia('(prefers-color-scheme: dark)');
function handleColorSchemeChange(e) {
    Config.color = e.matches ? 'rgb(255, 255, 255)' : 'rgb(149, 141, 186)';
}
matchDarkMode.addEventListener('change', handleColorSchemeChange);
handleColorSchemeChange(matchDarkMode);

let snowInterval;
function startSnowInterval() {
    return setInterval(() => {
        const $snow = document.createElement('div');
        $snow.innerText = Config.snow[Math.floor(Math.random() * Config.snow.length)];
        useStyle($snow, {
            display: 'inline-block',
            color: Config.color,
            fontSize: Math.floor(Math.random() * (25 - 14 + 1) + 14) + 'px',
            position: 'absolute',
            top: 0,
            left: Math.floor(Math.random() * 100) + '%',
            transition: 'transform ' + Config.speed + 's linear,opacity ' + Config.speed + 's linear',
            transform: 'translateY(-100%)',
            opacity: Math.random() + 0.3
        });
        setTimeout(() => {
            useStyle($snow, {
                transform: 'translate(0, ' + window.innerHeight + 'px) rotate(480deg)',
                opacity: 0
            });
            $snow.addEventListener('transitionend', () => {
                $snow.remove();
            });
        }, 100);
        $canvas.appendChild($snow);
    }, Config.interval);
}

function toggleSnow() {
    if (Config.active) {
        clearInterval(snowInterval);
        $canvas.innerHTML = '';
        Config.active = false;
        message.toast("切换到晴天模式");
    } else {
        snowInterval = startSnowInterval()
        Config.active = true;
        message.toast("切换到下雪模式");
    }
    localStorage.setItem('snowActive', Config.active);
}

// 在页面加载时应用之前的状态
if (Config.active) {
    snowInterval = startSnowInterval()
}

Config.dom.appendChild($canvas);
