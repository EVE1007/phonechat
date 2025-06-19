/**
 * 增强型防复制脚本
 * 此脚本将被注入到受密码保护的HTML页面中
 */

// 防止控制台访问
(function() {
    // 覆盖console对象的方法
    const originalConsole = window.console;
    window.console = {
        ...originalConsole,
        log: function() {},
        info: function() {},
        warn: function() {},
        error: function() {},
        debug: function() {}
    };
    
    // 防止通过Object.defineProperty恢复console
    Object.defineProperty(window, 'console', {
        get: function() {
            return {
                log: function() {},
                info: function() {},
                warn: function() {},
                error: function() {},
                debug: function() {}
            };
        },
        set: function() {}
    });
})();

// 防止查看源代码
document.addEventListener('keydown', function(e) {
    // 禁用查看源代码的快捷键
    if (
        e.keyCode === 123 || // F12
        (e.ctrlKey && e.shiftKey && e.keyCode === 73) || // Ctrl+Shift+I
        (e.ctrlKey && e.shiftKey && e.keyCode === 74) || // Ctrl+Shift+J
        (e.ctrlKey && e.keyCode === 85) || // Ctrl+U
        (e.ctrlKey && e.keyCode === 83) || // Ctrl+S
        (e.ctrlKey && e.keyCode === 65) || // Ctrl+A
        (e.ctrlKey && e.keyCode === 67)    // Ctrl+C
    ) {
        e.preventDefault();
        return false;
    }
});

// 禁用右键菜单
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    return false;
});

// 禁用复制
document.addEventListener('copy', function(e) {
    e.preventDefault();
    return false;
});

// 禁用剪切
document.addEventListener('cut', function(e) {
    e.preventDefault();
    return false;
});

// 禁用粘贴
document.addEventListener('paste', function(e) {
    e.preventDefault();
    return false;
});

// 禁用选择
document.addEventListener('selectstart', function(e) {
    e.preventDefault();
    return false;
});

// 禁用拖拽
document.addEventListener('dragstart', function(e) {
    e.preventDefault();
    return false;
});

// 定期检查是否被篡改
setInterval(function() {
    const protectionActive = (
        document.oncontextmenu === null ||
        document.oncopy === null ||
        document.oncut === null ||
        document.onpaste === null ||
        document.onselectstart === null ||
        document.ondragstart === null
    );
    
    if (protectionActive) {
        // 重新应用保护
        document.oncontextmenu = function() { return false; };
        document.oncopy = function() { return false; };
        document.oncut = function() { return false; };
        document.onpaste = function() { return false; };
        document.onselectstart = function() { return false; };
        document.ondragstart = function() { return false; };
    }
}, 1000);

// 添加水印
function addWatermark() {
    const watermark = document.createElement('div');
    const userId = 'User_' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    
    watermark.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 100000;
        background-image: repeating-linear-gradient(45deg, rgba(0,0,0,0.02), rgba(0,0,0,0.02) 10px, rgba(0,0,0,0.04) 10px, rgba(0,0,0,0.04) 20px);
    `;
    
    // 创建多个水印文本
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            const watermarkText = document.createElement('div');
            watermarkText.innerText = userId + '\n' + new Date().toLocaleDateString();
            watermarkText.style.cssText = `
                position: absolute;
                left: ${i * 20}%;
                top: ${j * 20}%;
                transform: rotate(-45deg);
                font-size: 14px;
                color: rgba(0,0,0,0.1);
                user-select: none;
                pointer-events: none;
                white-space: nowrap;
            `;
            watermark.appendChild(watermarkText);
        }
    }
    
    document.body.appendChild(watermark);
    
    // 监听DOM变化，防止水印被删除
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                const removedNodes = Array.from(mutation.removedNodes);
                if (removedNodes.includes(watermark) || !document.body.contains(watermark)) {
                    document.body.appendChild(watermark);
                }
            }
        });
    });
    
    observer.observe(document.body, { childList: true });
}

// 页面加载完成后添加水印
window.addEventListener('load', addWatermark);

// 防止调试
setInterval(function() {
    debugger;
}, 100); 