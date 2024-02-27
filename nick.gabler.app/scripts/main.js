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
            let canvas = document.createElement('canvas');
            canvas.width = this.offsetWidth;
            let height = 20; // Adjust height as needed
            canvas.height = height;
            canvas.style.position = 'absolute';
            canvas.style.left = '0';
            canvas.style.top = `${this.offsetHeight - 30}px`;
            this.appendChild(canvas);

            let rc = rough.canvas(canvas);

            let lastWidth = 0; // Variable to store the last width at which the line was drawn
            const redrawThreshold = 10; // Set the threshold for redrawing the line, e.g., 10 pixels

            function drawLine(newWidth) {
                // Check if the change in width is enough to redraw the line
                if (Math.abs(newWidth - lastWidth) >= redrawThreshold) {
                    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
                    rc.line(0, 10, newWidth, 10, {
                        stroke: '#F8F8F8', strokeWidth: 4, roughness: 2.5
                    });
                    lastWidth = newWidth; // Update the lastWidth with the newWidth
                }
            }

            gsap.fromTo({width: 0}, {
                width: 0
            }, {
                width: canvas.offsetWidth,
                duration: 1,
                ease: "none",
                onUpdate: function () {
                    let currentWidth = this.targets()[0].width;
                    drawLine(currentWidth); // Redraw the line conditionally
                },
                yoyo: true
            });

        });

        link.addEventListener('mouseout', function () {
            let canvas = this.querySelector('canvas');
            if (canvas) {
                this.removeChild(canvas);
            }
        });
    });
};
