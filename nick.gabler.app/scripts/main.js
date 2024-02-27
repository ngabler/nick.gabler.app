window.onload = function () {
    let tl = gsap.timeline();
    tl.to('#title', {
        opacity: 1,
        duration: 1,
        ease: "expoScale(0.5,7,power1.inOut)",
    });
    tl.to('#social-links a', {
        opacity: 1,
        duration: 0.5,
        stagger: 0.2,
        ease: "expoScale(0.5,7,power1.inOut)",
    });
    document.querySelectorAll('#social-links a').forEach(link => {
        link.style.position = 'relative'; // Necessary for positioning the canvas correctly
        link.addEventListener('mouseover', function () {
            // Create a canvas element
            let canvas = document.createElement('canvas');
            canvas.width = this.offsetWidth;
            // Fixed: Define height before using it
            let height = 20; // Adjust height as needed
            canvas.height = height;
            canvas.style.position = 'absolute';
            canvas.style.left = '0';
            canvas.style.top = `${this.offsetHeight - 5}px`; // Position just above the bottom edge of the link
            this.appendChild(canvas);

            // Initialize Rough.js on the canvas
            let rc = rough.canvas(canvas);

            // Updated: Moved the drawLine function inside the mouseover event and included the height variable
            function drawLine(newWidth) {
                // Clear previous drawing
                canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

                // Draw a new line with Rough.js, using newWidth for dynamic width during animation
                rc.line(0, 10, newWidth, 10, {
                    stroke: '#F8F8F8', strokeWidth: 3, roughness: 2.5
                });
            }

            // GSAP animation to simulate line drawing, fixed to use the newWidth argument in drawLine
            gsap.fromTo({width: 0}, {
                width: 0
            }, {
                width: canvas.offsetWidth,
                duration: 2,
                ease: "none",
                onUpdate: function () {
                    let currentWidth = this.targets()[0].width;
                    drawLine(currentWidth); // Redraw the line with updated width
                },
                repeat: -1, // Repeat indefinitely
                yoyo: true // Go back and forth
            });

        });

        link.addEventListener('mouseout', function () {
            // Remove the canvas when not hovered
            let canvas = this.querySelector('canvas');
            if (canvas) {
                this.removeChild(canvas);
            }
        });
    });
};
