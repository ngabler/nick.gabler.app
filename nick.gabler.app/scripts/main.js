window.onload = function () {
    let strokeWidth = 4;
    let padding = 20;
    let duration = 1;
    let linkDuration = 0.5;
    let extraPadding = 30;
    let lastBoxUpdate = 0;
    let boxUpdateInterval = 41.67;
    let animationInterval;

    let title = document.getElementById('title');
    let canvas = setupCanvas();
    let rc = rough.canvas(canvas);
    let boxAnim = { width: 0, height: 0, opacity: 0 };

    function setupCanvas() {
        let cnv = document.createElement('canvas');
        document.body.appendChild(cnv);
        cnv.style.position = 'absolute';
        cnv.style.left = '0';
        cnv.style.zIndex = '-1';
        updateCanvasSize(cnv);
        window.addEventListener('resize', () => updateCanvasSize(cnv));
        return cnv;
    }

    function updateCanvasSize(cnv) {
        let titleRect = title.getBoundingClientRect();
        cnv.width = titleRect.width + extraPadding * 2;
        cnv.height = titleRect.height + extraPadding * 2;
        cnv.style.top = `${titleRect.top - extraPadding}px`;
        cnv.style.left = `${titleRect.left - extraPadding}px`;
    }

    function drawRectangle(cnv, width, height, opacity) {
        let context = cnv.getContext('2d');
        context.clearRect(0, 0, cnv.width, cnv.height);

        let startX = (cnv.width - width) / 2;
        let startY = (cnv.height - height) / 2;

        let options = {
            fill: `rgba(200, 16, 46, ${opacity})`,
            stroke: `rgba(248, 248, 248, ${opacity})`,
            strokeWidth: strokeWidth,
            roughness: 1.5,
            hachureAngle: 69,
            hachureGap: 10,
            fillWeight: 2,
            fillStyle: 'cross-hatch'
        };

        rc.rectangle(startX, startY, width, height, options);
    }

    let tl = gsap.timeline();
    tl.to(boxAnim, {
        width: () => canvas.width - strokeWidth - padding * 2,
        height: () => canvas.height - strokeWidth - padding * 2,
        opacity: 1,
        duration: duration,
        ease: 'expo.out',
        onUpdate: function () {
            let currentTime = Date.now();
            if (currentTime - lastBoxUpdate > boxUpdateInterval) {
                drawRectangle(canvas, boxAnim.width, boxAnim.height, boxAnim.opacity);
                lastBoxUpdate = currentTime;
            }
        },
        onComplete: function () {
            drawRectangle(canvas, canvas.width - strokeWidth - padding * 2, canvas.height - strokeWidth - padding * 2, 1);
            if (animationInterval) clearInterval(animationInterval); // Clear existing interval if any
            animationInterval = setInterval(function () {
                drawRectangle(canvas, boxAnim.width, boxAnim.height, boxAnim.opacity);
            }, 41.67); // Redraw every 250ms
        }
    })
        .to('#title', { opacity: 1, duration: duration, ease: 'expo.out' })
        .to('#social-links a', {
            opacity: 1,
            duration: linkDuration,
            stagger: 0.2,
            ease: "expo.out",
        }, "<");

    setupSocialLinks();

    window.addEventListener('pagehide', function () {
        if (animationInterval) clearInterval(animationInterval);
    });
};

function setupSocialLinks() {
    document.querySelectorAll('#social-links a').forEach(link => {
        link.style.position = 'relative';
        link.addEventListener('mouseenter', createLineAnimation);
        link.addEventListener('mouseleave', removeLineAnimation);
    });
}

function createLineAnimation() {
    if (!this.querySelector('canvas')) {
        let linkCanvas = document.createElement('canvas');
        setupLinkCanvas(this, linkCanvas);
        let rc = rough.canvas(linkCanvas);
        animateLine(rc, linkCanvas);
    }
}

function setupLinkCanvas(link, linkCanvas) {
    linkCanvas.width = link.offsetWidth;
    linkCanvas.height = 20;
    linkCanvas.style.position = 'absolute';
    linkCanvas.style.left = '0';
    linkCanvas.style.top = `${link.offsetHeight - 10}px`;
    link.appendChild(linkCanvas);
}

function animateLine(rc, linkCanvas) {
    let lineLength = { length: 0 };
    let lastUpdateTime = 0;
    let updateInterval = 50;
    gsap.to(lineLength, {
        length: linkCanvas.width,
        duration: 1,
        ease: "none",
        onUpdate: () => {
            let currentTime = Date.now();
            if (currentTime - lastUpdateTime > updateInterval) {
                drawLine(rc, linkCanvas, lineLength.length);
                lastUpdateTime = currentTime;
            }
        },
        onComplete: () => drawLine(rc, linkCanvas, linkCanvas.width)
    });
}

function drawLine(rc, linkCanvas, width) {
    let context = linkCanvas.getContext('2d');
    context.clearRect(0, 0, linkCanvas.width, linkCanvas.height);
    rc.line(0, 10, width, 10, {
        stroke: '#F8F8F8',
        strokeWidth: 3,
        roughness: 1.5,
    });
}

function removeLineAnimation() {
    let linkCanvas = this.querySelector('canvas');
    if (linkCanvas) {
        this.removeChild(linkCanvas);
    }
}
