window.onload = function () {
    let tl = gsap.timeline();
    let strokeWidth = 2;
    let roughness = 1;
    let padding = 10;

    let title = document.getElementById('title');
    let canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    canvas.width = title.offsetWidth + strokeWidth + padding * 4; // Adjusted for correct full width
    canvas.height = title.offsetHeight + strokeWidth + padding * 2; // Adjusted for correct full height
    canvas.style.position = 'absolute';
    canvas.style.left = `${title.getBoundingClientRect().left - padding * 2 - (strokeWidth / 2)}px`;
    canvas.style.top = `${title.getBoundingClientRect().top - padding - (strokeWidth / 2)}px`;
    canvas.style.zIndex = '-1';

    let rc = rough.canvas(canvas);
    let boxAnim = { width: 0, height: canvas.height - (strokeWidth + padding * 2), opacity: 0 };
    let centerX = canvas.width / 2;
    let lastProgressUpdate = -1;

    // Define drawRectangle outside to make it accessible everywhere within this function
    function drawRectangle(newWidth, newOpacity) {
        // Clear previous frame
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

        // Calculate new X position to start drawing from, expanding from the center
        let newX = centerX - newWidth / 2;

        // Adjust styles to include dynamic opacity
        let fillStyle = `rgba(200, 16, 46, ${newOpacity})`; // Adjust fill color opacity
        let strokeStyle = `rgba(248, 248, 248, ${newOpacity})`; // Adjust stroke color opacity

        // Draw the rectangle with dynamic width, adjusted X position, and opacity
        rc.rectangle(newX, padding, newWidth, canvas.height - strokeWidth - padding * 2, {
            fill: fillStyle,
            fillStyle: 'cross-hatch',
            hachureAngle: -45,
            hachureGap: 10,
            fillWeight: 1,
            stroke: strokeStyle,
            strokeWidth: strokeWidth,
            roughness: roughness,
        });
    }

    tl.to('#title', {
        opacity: 1,
        duration: 1,
        ease: "expoScale(0.5,7,none)",
    });

    tl.to(boxAnim, {
        width: canvas.width - strokeWidth - padding * 2, // Target width adjusted for stroke and padding
        opacity: 1,
        duration: 0.5,
        ease: "expoScale(0.5,7,power1.inOut)", // Adjusted ease for consistency
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
                let height = 20; // Adjust height as needed
                canvas.height = height;
                canvas.style.position = 'absolute';
                canvas.style.left = '0';
                canvas.style.top = `${this.offsetHeight - height}px`; // Adjusted to correctly position the line
                this.appendChild(canvas);

                let rc = rough.canvas(canvas);
                let lastProgressUpdate = -1; // Ensure initial drawing happens by setting this to -1

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
                        let currentProgress = Math.round(this.progress() * 10) / 10; // Round progress to match the interval
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
