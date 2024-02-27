window.onload = function () {
    let tl = gsap.timeline();
    let strokeWidth = 3; // Example stroke width
    let padding = 10; // Additional padding inside the stroke
    tl.to('#title', {
        opacity: 1,
        duration: 1,
        ease: "expoScale(0.5,7,none)",
    }).add(() => {
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
        let lastProgressUpdate = -1;

        function drawRectangle(newWidth) {
            // Clear previous frame
            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
            // Draw the rectangle with dynamic width
            rc.rectangle(padding, padding, newWidth, canvas.height - strokeWidth - padding * 2, {
                fill: '#c8102e',
                fillStyle: 'cross-hatch',
                hachureAngle: -45,
                hachureGap: 10,
                fillWeight: 1,
                stroke: '#F8F8F8',
                strokeWidth: strokeWidth,
                roughness: 1,
            });
        }

        // Initialize the animation object with width as zero to start
        let boxAnim = { width: 0 };

        gsap.to(boxAnim, {
            width: canvas.width - strokeWidth - padding * 2, // Target width adjusted for stroke and padding
            duration: 1,
            ease: "expoScale(0.5,7,none)", // Adjusted ease for consistency
            onUpdate: function () {
                let currentProgress = Math.round(this.progress() * 10) / 10; // Round progress to match the interval
                if (currentProgress > lastProgressUpdate) {
                    let currentWidth = this.targets()[0].width;
                    drawRectangle(currentWidth);
                    lastProgressUpdate = currentProgress;
                }
            }
        });
    }, "+=0");

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
                        stroke: '#F8F8F8', strokeWidth: 4, roughness: 2.5
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
