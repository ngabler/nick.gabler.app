document.addEventListener('DOMContentLoaded', (event) => {
    const canvas = document.getElementById('bgCanvas');
    const ctx = canvas.getContext('2d');
    const offscreenCanvas = document.createElement('canvas');
    const offscreenCtx = offscreenCanvas.getContext('2d');
    let mouseX;
    let mouseY;
    let newMouseX;
    let newMouseY;
    let mouseMoved = false;
    const colors = [];
    for (let r = 0; r < 256; r += 32) {
        for (let g = 0; g < 256; g += 32) {
            for (let b = 0; b < 256; b += 32) {
                colors.push(`rgb(${r}, ${g}, ${b})`);
            }
        }
    }

    function resizeCanvas() {
        canvas.width = window.innerWidth * window.devicePixelRatio;
        canvas.height = window.innerHeight * window.devicePixelRatio;
        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerHeight}px`;
        offscreenCanvas.width = canvas.width;
        offscreenCanvas.height = canvas.height;
        mouseX = canvas.width / 2;
        mouseY = canvas.height / 2;
        newMouseX = mouseX;
        newMouseY = mouseY;
    }
    window.addEventListener('mousemove', (e) => {
        newMouseX = e.clientX * window.devicePixelRatio;
        newMouseY = e.clientY * window.devicePixelRatio;
        mouseMoved = true;
    });
    window.addEventListener('touchmove', (e) => {
        e.preventDefault();
        newMouseX = e.touches[0].clientX * window.devicePixelRatio;
        newMouseY = e.touches[0].clientY * window.devicePixelRatio;
        mouseMoved = true;
    }, { passive: false });

    class StaticStar {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.1;
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }
        draw(ctx) {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    class Star extends StaticStar {
        constructor() {
            super();
            this.size = Math.random() * Math.random() * Math.random() * 12 + 3;
            this.speed = this.size / 30;
            this.initialMouseX = Math.random() * canvas.width;
            this.initialMouseY = Math.random() * canvas.height;
            this.moveX = 0;
            this.moveY = 0;
        }
        updatePosition() {
            const speedFactor = 0.002 * this.speed;
            this.moveX = ((this.initialMouseX - canvas.width / 2) + (mouseX - canvas.width / 2)) * speedFactor;
            this.moveY = ((this.initialMouseY - canvas.height / 2) + (mouseY - canvas.height / 2)) * speedFactor;
            this.x += this.moveX;
            this.y += this.moveY;

            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }
        draw(ctx) {
            if (mouseMoved) this.updatePosition();
            super.draw(ctx);
        }
    }

    resizeCanvas();
    const MAX_DYNAMIC_STARS = 512;
    let numStars = Math.floor((window.innerWidth * window.innerHeight) * 0.001);
    numStars = Math.min(numStars, MAX_DYNAMIC_STARS);
    const stars = Array.from({ length: numStars }, () => new Star());
    const staticStars = Array.from({ length: numStars * 10 }, () => new StaticStar());
    staticStars.forEach((star) => star.draw(offscreenCtx));

    function animate() {
        if (mouseMoved) {
            mouseX = newMouseX;
            mouseY = newMouseY;
            mouseMoved = false;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(offscreenCanvas, 0, 0, canvas.width, canvas.height);
        stars.forEach((star) => star.draw(ctx));
        requestAnimationFrame(animate);
    }

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            resizeCanvas();

            offscreenCtx.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
            const numStaticStars = Math.floor((window.innerWidth * window.innerHeight) * 0.001) * 10;
            staticStars.length = 0; // Empty the array
            for (let i = 0; i < numStaticStars; i++) {
                staticStars.push(new StaticStar());
            }
            staticStars.forEach(star => star.draw(offscreenCtx));

            numStars = Math.floor((window.innerWidth * window.innerHeight) * 0.001);
            numStars = Math.min(numStars, MAX_DYNAMIC_STARS);
            stars.length = 0; // Empty the array
            for (let i = 0; i < numStars; i++) {
                stars.push(new Star());
            }

        }, 100);
    });
    animate();
});
