window.onload = function () {
    let tl = gsap.timeline();
    let strokeWidth = 3;
    let roughness = 1.5;
    let padding = 20;
    let duration = 1;
    let linkDuration = 0.5;
    let fillWeight = 6;
    let hachureGap = 30;
    let hachureAngle = -50;
    let boxEase = 'expoScale(0.5,7,none)';

    let title = document.getElementById('title');
    let canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    canvas.style.position = 'absolute';
    canvas.style.left = '0';
    canvas.style.zIndex = '-1';

    let rc = rough.canvas(canvas);

    // Function to update canvas size and central X coordinate
    function updateCanvasSize() {
        canvas.width = window.innerWidth;
        canvas.height = title.offsetHeight + (strokeWidth + padding * 4);
        canvas.style.top = `${title.getBoundingClientRect().top - padding - (strokeWidth / 2)}px`;
    }

    // Initial canvas size update
    updateCanvasSize();

    // Adjust canvas size on window resize
    window.addEventListener('resize', function () {
        updateCanvasSize();
        // Recalculate the centerX based on the updated canvas width
        centerX = canvas.width / 2;
        // Redraw the rectangle with the updated dimensions
        drawRectangle(boxAnim.width, boxAnim.opacity);
    });

    let boxAnim = { width: 0, height: 0, opacity: 0 }; // Updated to recalculate height dynamically
    let centerX = canvas.width / 2;
    let centerY = canvas.height / 2;
    let lastProgressUpdate = -1;

    function drawRectangle(newWidth, newHeight, newOpacity) {
        // Clear previous drawing
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

        // Calculate new dimensions considering padding
        newWidth = Math.max(0, newWidth - padding * 2);
        newHeight = Math.max(0, newHeight - padding * 2);

        // Calculate position
        let newX = centerX - newWidth / 2;
        let newY = centerY - newHeight / 2;

        // Adjustments for stroke width
        newX += strokeWidth / 2;
        newY += strokeWidth / 2;
        newWidth -= strokeWidth;
        newHeight -= strokeWidth;

        // Setup styles
        let options = {
            fill: `rgba(200, 16, 46, ${newOpacity})`,
            stroke: `rgba(248, 248, 248, ${newOpacity})`,
            strokeWidth: strokeWidth,
            roughness: roughness,
            hachureAngle: hachureAngle,
            hachureGap: hachureGap,
            fillStyle: 'solid' // Changed from 'zigzag' to 'solid' for better visibility
        };

        // Draw the rectangle
        rc.rectangle(newX, newY, newWidth, newHeight, options);
    }

    tl.to('#title', {
        opacity: 1,
        duration: duration,
        ease: boxEase,
    });

    tl.to(boxAnim, {
        width: canvas.width - strokeWidth - padding * 2,
        height: canvas.height - strokeWidth - padding * 2,
        opacity: 1,
        duration: duration,
        ease: boxEase,
        onUpdate: function () {
            let currentProgress = Math.round(this.progress() * 10) / 10;
            if (currentProgress > lastProgressUpdate) {
                let currentWidth = this.targets()[0].width;
                let currentHeight = this.targets()[0].height;
                let currentOpacity = this.targets()[0].opacity;
                drawRectangle(currentWidth, currentHeight, currentOpacity);
                lastProgressUpdate = currentProgress;
            }
        }
    }, "<");

    tl.to('#social-links a', {
        opacity: 1,
        duration: linkDuration,
        stagger: 0.2,
        ease: "expoScale(0.5,7,power1.inOut)",
    });

    document.querySelectorAll('#social-links a').forEach(link => {
        link.style.position = 'relative';

        link.addEventListener('mouseenter', function () {
            if (!this.querySelector('canvas')) {
                let canvas = document.createElement('canvas');
                canvas.width = this.offsetWidth;
                let height = 20;
                canvas.height = height;
                canvas.style.position = 'absolute';
                canvas.style.left = '0';
                canvas.style.top = `${this.offsetHeight - height}px`;
                this.appendChild(canvas);

                let rc = rough.canvas(canvas);
                let lastProgressUpdate = -1;

                function drawLine(newWidth) {
                    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
                    rc.line(0, 10, newWidth, 10, {
                        stroke: '#F8F8F8',
                        strokeWidth: strokeWidth,
                        roughness: roughness,
                    });
                }

                gsap.fromTo({ width: 0 }, {
                    width: 0
                }, {
                    width: canvas.offsetWidth,
                    duration: 1,
                    ease: "expoScale(0.5,7,power1.inOut)",
                    onUpdate: function () {
                        let currentProgress = Math.round(this.progress() * 10) / 10;
                        if (currentProgress > lastProgressUpdate) {
                            let currentWidth = this.targets()[0].width;
                            drawLine(currentWidth);
                            lastProgressUpdate = currentProgress;
                        }
                    },
                    yoyo: true,
                });
            }
        });

        link.addEventListener('mouseleave', function () {
            let canvas = this.querySelector('canvas');
            if (canvas) {
                this.removeChild(canvas);
            }
        });
    });
};
