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
        canvas.width = title.offsetWidth + 100 + strokeWidth;
        canvas.height = title.offsetHeight + 20 + strokeWidth;
        canvas.style.position = 'absolute';
        canvas.style.left = `${title.getBoundingClientRect().left - 50 - (strokeWidth / 2)}px`;
        canvas.style.top = `${title.getBoundingClientRect().top - 10 - (strokeWidth / 2)}px`;
        canvas.style.zIndex = '-1';

        let rc = rough.canvas(canvas);
        let lastProgressUpdate = -1; // Ensure initial drawing happens by setting this to -1


        // Initialize the animation object with width as half of canvas width to start from the center
        let boxAnim = { width: 0, height: canvas.height - (strokeWidth + padding * 2) };

        gsap.to(boxAnim, {
            width: canvas.width / 2 - (strokeWidth / 2 + padding), // Subtract half strokeWidth and padding
            duration: 1, // Match the duration to the social-links underscore lines
            ease: "expoScale(0.5,7,power1.inOut)", // Match the easing function as well
            onUpdate: function () {
                canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height); // Clear previous frame
                let currentProgress = Math.round(this.progress() * 10) / 10; // Round progress to match the interval
                if (currentProgress > lastProgressUpdate) {
                    let currentWidth = this.targets()[0].width;
                    drawLine(currentWidth);
                    lastProgressUpdate = currentProgress;
                }
                // Start drawing further in from the edge by half the strokeWidth plus padding
                let startX = (canvas.width - boxAnim.width * 2) / 2 + (strokeWidth / 2 + padding);
                let startY = padding;
                // The rectangle's width is adjusted to keep the stroke inside
                rc.rectangle(startX, startY, boxAnim.width * 2 - (strokeWidth + padding * 2), boxAnim.height, {
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
