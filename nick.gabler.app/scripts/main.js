window.onload = function() {
    let strokeWidth = 3;
    let padding = 20;
    let duration = 1;
    let linkDuration = 0.5;
    let extraPadding = 20;

    let title = document.getElementById('title');
    let canvas = setupCanvas();
    let rc = rough.canvas(canvas);
    let boxAnim = { width: 0, opacity: 0 };

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
        cnv.style.top = `${titleRect.top - (extraPadding / 2)}px`;
        cnv.style.left = `${titleRect.left - extraPadding}px`;
    }

    function drawRectangle(cnv, width, opacity) {
        let context = cnv.getContext('2d');
        context.clearRect(0, 0, cnv.width, cnv.height);

        let options = {
            fill: `rgba(200, 16, 46, ${opacity})`,
            stroke: `rgba(248, 248, 248, ${opacity})`,
            strokeWidth: strokeWidth,
            roughness: 1.5,
            hachureAngle: -50,
            hachureGap: 60,
            fillWeight: 6,
            fillStyle: 'zigzag'
        };

        rc.rectangle(padding, padding, width, cnv.height - padding * 2, options);
    }

    let tl = gsap.timeline();
    tl.to('#title', { opacity: 1, duration: duration, ease: 'expoScale(0.5,7,none)' })
      .to(boxAnim, {
          width: () => canvas.width - strokeWidth - padding * 2,
          opacity: 1,
          duration: duration,
          ease: 'expoScale(0.5,7,none)',
          onUpdate: () => drawRectangle(canvas, boxAnim.width, boxAnim.opacity)
      }, "<")
      .to('#social-links a', {
          opacity: 1,
          duration: linkDuration,
          stagger: 0.2,
          ease: "expoScale(0.5,7,power1.inOut)",
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
    linkCanvas.style.top = `${link.offsetHeight - linkCanvas.height}px`;
    link.appendChild(linkCanvas);
}

function animateLine(rc, linkCanvas) {
    gsap.fromTo(
        { width: 0 }, 
        { width: linkCanvas.offsetWidth, duration: 1, ease: "expoScale(0.5,7,power1.inOut)" },
        {
            onUpdate: function() {
                let width = this.targets()[0].width;
                drawLine(rc, linkCanvas, width);
            },
            yoyo: true,
        }
    );
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
