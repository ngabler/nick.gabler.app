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
        let extraPadding = padding; // Extra padding around the title for the canvas background
        let titleRect = title.getBoundingClientRect();

        canvas.width = window.innerWidth;
        // Set the canvas height based on the title's height plus extra padding
        canvas.height = titleRect.height + extraPadding * 2;

        // Adjust the canvas top position to move it up by half the extra padding to center it vertically around the title
        canvas.style.top = `${titleRect.top - extraPadding}px`;
        canvas.style.left = `0px`; // Ensure canvas is aligned to the left edge of the viewport
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

    function updateCanvasSize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight; // Adjust the canvas height to fill the screen or container as needed
        let titleRect = title.getBoundingClientRect();
        canvas.style.top = `${titleRect.top - padding}px`; // Adjust canvas position based on title position
        canvas.style.left = `0px`; // Ensure canvas starts from the left edge of the viewport
    }

    function drawRectangle(newWidth, newHeight, newOpacity) {
        // Ensure height is dynamically updated based on title position
        let titleRect = title.getBoundingClientRect();
        let centerY = titleRect.top + titleRect.height / 2 + (strokeWidth + padding) - canvas.getBoundingClientRect().top;

        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

        newWidth = Math.max(0, newWidth); // Ensure width is not negative
        newHeight = Math.max(0, newHeight); // Ensure height is not negative

        // Calculate new X and Y considering the title's position
        let newX = (canvas.width - newWidth) / 2; // Center horizontally in the canvas
        let newY = centerY - newHeight / 2; // Align vertically with the title

        let options = {
            fill: `rgba(200, 16, 46, ${newOpacity})`,
            stroke: `rgba(248, 248, 248, ${newOpacity})`,
            strokeWidth: strokeWidth,
            roughness: roughness,
            hachureAngle: hachureAngle,
            hachureGap: hachureGap,
            fillWeight: fillWeight,
            fillStyle: 'zigzag'
        };

        rc.rectangle(newX, newY, newWidth, newHeight, options);
    }

    updateCanvasSize();
    window.addEventListener('resize', function () {
        updateCanvasSize();
        // Optionally, redraw the rectangle if needed to adjust to new dimensions
        drawRectangle(boxAnim.width, boxAnim.height, boxAnim.opacity);
    });

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
