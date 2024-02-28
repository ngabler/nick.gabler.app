window.onload = function() {
    let strokeWidth = 3;
    let padding = 20;
    let duration = 1;
    let linkDuration = 0.5;
    let extraPadding = 20;

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

        let options = {
            fill: `rgba(200, 16, 46, ${opacity})`,
            stroke: `rgba(248, 248, 248, ${opacity})`,
            strokeWidth: strokeWidth,
            roughness: 1.5,
            hachureAngle: -50,
            hachureGap: 60,
            fillWeight: 9,
            fillStyle: 'zigzag'
        };

        rc.rectangle(padding, padding, width, height, options);
    }

    let tl = gsap.timeline();
    tl.to('#title', { opacity: 1, duration: duration, ease: 'expo.out' })
      .to(boxAnim, {
          width: () => canvas.width - strokeWidth - padding * 2,
          height: () => canvas.height - strokeWidth - padding * 2,
          opacity: 1,
          duration: duration,
          ease: 'expo.out',
          onUpdate: () => drawRectangle(canvas, boxAnim.width, boxAnim.height, boxAnim.opacity)
      }, "<")
      .to('#social-links a', {
          opacity: 1,
          duration: linkDuration,
          stagger: 0.2,
          ease: "expo.out",
      });

    setupSocialLinks();
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
    linkCanvas.style.top = `${link.offsetHeight}px`;
    link.appendChild(linkCanvas);
}

function animateLine(rc, linkCanvas) {
    let lineLength = { length: 0 };
    let lastUpdateTime = 0;
    let updateInterval = 50; // Update every 50 milliseconds

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
        onComplete: () => drawLine(rc, linkCanvas, linkCanvas.width) // Ensure the final state is rendered
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
