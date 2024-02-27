window.onload = function () {
    let tl = gsap.timeline();
    tl.to('#title', {
        opacity: 1,
        duration: 1,
        ease: "expoScale(0.5,7,none)",
    }).add(() => {
        let title = document.getElementById('title');
        let canvas = document.createElement('canvas');
        document.body.appendChild(canvas);
        canvas.width = title.offsetWidth + 50; // Increased extra space
        canvas.height = title.offsetHeight + 30; // Increased extra space
        canvas.style.position = 'absolute';
        canvas.style.left = `${title.getBoundingClientRect().left - 25}px`; // Adjusted for extra space
        canvas.style.top = `${title.getBoundingClientRect().top - 15}px`; // Adjusted for extra space
        canvas.style.zIndex = '-1'; // Ensure the canvas is behind the title

        let rc = rough.canvas(canvas);

        let boxAnim = {width: 0};

        gsap.to(boxAnim, {
            width: canvas.width, // Animate width to full canvas width
            duration: 0.5, // Duration for the animation
            ease: "expoScale(0.5,7,none)",
            onUpdate: function() {
                canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height); // Clear previous frame
                rc.rectangle(0, 0, boxAnim.width, canvas.height, {
                    fill: '#c8102e',
                    fillStyle: 'hachure',
                    hachureAngle: -45,
                    hachureGap: 40,
                    fillWeight: 4,
                    stroke: '#F8F8F8',
                    strokeWidth: 4,
                    roughness: 2.5,
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
