window.onload = function () {
    let tl = gsap.timeline();

    // Title opacity animation
    tl.to('#title', {
        opacity: 1,
        duration: 1,
        ease: "expoScale(0.5,7,none)",
    });

    // After the title is fully visible, draw a rough.js box behind it
    tl.add(() => {
        let title = document.getElementById('title');
        let canvas = document.createElement('canvas');
        document.body.appendChild(canvas); // Append canvas to the body or a specific container
        canvas.width = title.offsetWidth + 20; // Adding some padding to ensure the box fully encompasses the title
        canvas.height = title.offsetHeight + 20; // Adding some padding for the same reason
        canvas.style.zIndex = '-1'; // Send the canvas to the back
        title.style.position = 'relative';
        title.style.zIndex = '1'; // Ensure the title is above the canvas


        // Adjust the canvas position to align with the title element. You might need to adjust these values.
        let titleRect = title.getBoundingClientRect();
        canvas.style.left = `${titleRect.left - 10}px`; // Align the box with the title
        canvas.style.top = `${titleRect.top - 10}px`; // Align the box with the title
        canvas.style.pointerEvents = 'none'; // Make sure the canvas doesn't capture mouse events

        let rc = rough.canvas(canvas);
        // Draw a filled rectangle with no stroke around the title
        rc.rectangle(0, 0, canvas.width, canvas.height, {
            fill: '#bcd4e6',
            stroke: 'none',
            fillStyle: 'hachure', // Use hachure fill style
            hachureAngle: 45, // Angle of the hachure lines
            hachureGap: 4, 
        });
    }, "+=0"); // This ensures the drawing starts right after the title opacity animation

    // Social links opacity animation
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

                let animation = gsap.fromTo({width: 0}, {
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
