window.onload = function () {
    let tl = gsap.timeline();
    let strokeWidth = 3;
    let roughness = 1;
    let padding = 20;

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
        canvas.height = title.offsetHeight + (strokeWidth + padding * 2);
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
    let lastProgressUpdate = -1;

    function drawRectangle(newWidth, newOpacity) {
        // Ensure height is dynamically updated based on current canvas height
        boxAnim.height = canvas.height - (strokeWidth + padding * 2);

        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

        let borderPadding = padding;
        let newX = centerX - newWidth / 2 + borderPadding;
        newWidth = newWidth - borderPadding * 2;
        newWidth = Math.max(0, newWidth);

        let fillStyle = `rgba(200, 16, 46, ${newOpacity})`;
        let strokeStyle = `rgba(248, 248, 248, ${newOpacity})`;

        rc.rectangle(newX, padding + borderPadding, newWidth, boxAnim.height - borderPadding * 2, {
            fill: fillStyle,
            fillStyle: 'zigzag-line',
            hachureAngle: 45,
            hachureGap: 10,
            fillWeight: 1.5,
            stroke: strokeStyle,
            strokeWidth: strokeWidth,
            roughness: roughness,
        });
    }

    tl.to('#title', {
        opacity: 1,
        duration: 1,
        ease: "expoScale(0.5,7,power1.inOut)",
    });

    tl.to(boxAnim, {
        width: canvas.width - strokeWidth - padding * 2, // Target width adjusted for stroke and padding
        opacity: 1,
        duration: 1,
        ease: "expoScale(0.5,7,power1.inOut)",
        onUpdate: function () {
            let currentProgress = Math.round(this.progress() * 10) / 10;
            if (currentProgress > lastProgressUpdate) {
                let currentWidth = this.targets()[0].width;
                let currentOpacity = this.targets()[0].opacity;
                drawRectangle(currentWidth, currentOpacity);
                lastProgressUpdate = currentProgress;
            }
        }
    }, "<");

    tl.to('#social-links a', {
        opacity: 1,
        duration: 0.5,
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
