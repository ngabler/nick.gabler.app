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
        canvas.width = title.offsetWidth + 20; // Adjust as needed
        canvas.height = title.offsetHeight + 20; // Adjust as needed
        canvas.style.position = 'absolute';
        canvas.style.left = `${title.getBoundingClientRect().left - 10}px`; // Position adjust
        canvas.style.top = `${title.getBoundingClientRect().top - 10}px`; // Position adjust
        canvas.style.zIndex = '-1'; // Ensure the canvas is behind the title

        let rc = rough.canvas(canvas);

        // Dummy object for animation
        let boxAnim = {width: 0};

        gsap.to(boxAnim, {
            width: canvas.width, // Animate width to full canvas width
            duration: 0.5, // Same duration as social-links animation
            ease: "none",
            onUpdate: function() {
                canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height); // Clear previous frame
                // Draw the box using the animated width while keeping height constant
                rc.rectangle(0, 0, boxAnim.width, canvas.height, {
                    fill: '#a0c4ff',
                    stroke: 'none',
                    fillStyle: 'hachure',
                    hachureAngle: -45, // Adjust the angle for desired effect
                    hachureGap: 50, // Adjust the gap for desired effect
                    fillWeight: 5,
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

    // Set up the event listeners for the social links
    document.querySelectorAll('#social-links a').forEach(link => {
        link.style.position = 'relative'; // Necessary for positioning the canvas correctly

        link.addEventListener('mouseenter', function () {
            if (!this.querySelector('canvas')) {
                let canvas = document.createElement('canvas');
                canvas.width = this.offsetWidth;
                let height = 20; // Adjust height as needed
                canvas.height = height;
                canvas.style.position = 'absolute';
                canvas.style.left = '0';
                canvas.style.top = `${this.offsetHeight - 30}px`;
                this.appendChild(canvas);

                let rc = rough.canvas(canvas);

                // Define a variable to track the last progress at which the line was drawn
                let lastProgressUpdate = 0;
                const progressUpdateInterval = 0.1; // 10% progress intervals

                function drawLine(newWidth) {
                    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
                    rc.line(0, 10, newWidth, 10, {
                        stroke: '#F8F8F8', strokeWidth: 4, roughness: 2.5
                    });
                }

                let animation = gsap.fromTo({ width: 0 }, {
                    width: 0
                }, {
                    width: canvas.offsetWidth,
                    duration: 1,
                    ease: "expoScale(0.5,7,power1.inOut)",
                    onUpdate: function () {
                        let currentProgress = this.progress();
                        // Only update the drawing at defined progress intervals
                        if (currentProgress - lastProgressUpdate >= progressUpdateInterval) {
                            let currentWidth = this.targets()[0].width;
                            drawLine(currentWidth); // Redraw the line
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
