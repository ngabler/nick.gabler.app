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
    let colors = [];
    for (let r = 0; r < 256; r += 32) {
        for (let g = 0; g < 256; g += 32) {
            for (let b = 0; b < 256; b += 32) {
                colors.push("rgb(" + r + ", " + g + ", " + b + ")");
            }
        }
    }

    function resizeCanvas() {
        canvas.width = window.innerWidth * window.devicePixelRatio;
        canvas.height = window.innerHeight * window.devicePixelRatio;
        canvas.style.width = window.innerWidth + 'px';
        canvas.style.height = window.innerHeight + 'px';
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
    }, {
        passive: false
    });
    class StaticStar {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.1;
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }
        draw(ctx) {
            ctx.fillStyle = this.color;
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.beginPath();
            ctx.arc(0, 0, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
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
        draw(ctx) {
            if (mouseMoved) {
                this.moveX = ((this.initialMouseX - canvas.width / 2) * 0.002 * this.speed) + (mouseX - canvas.width / 2) * 0.002 * this.speed;
                this.moveY = ((this.initialMouseY - canvas.height / 2) * 0.002 * this.speed) + (mouseY - canvas.height / 2) * 0.002 * this.speed;
                this.x += this.moveX;
                this.y += this.moveY;
            }
            this.moveX = ((this.initialMouseX - canvas.width / 2) * 0.002 * this.speed) + (mouseX - canvas.width / 2) * 0.002 * this.speed;
            this.moveY = ((this.initialMouseY - canvas.height / 2) * 0.002 * this.speed) + (mouseY - canvas.height / 2) * 0.002 * this.speed;
            this.x += this.moveX;
            this.y += this.moveY;
            super.draw(ctx);
            if (this.x - this.size < 0) {
                ctx.save();
                ctx.translate(canvas.width, 0);
                super.draw(ctx);
                ctx.restore();
            }
            if (this.y - this.size < 0) {
                ctx.save();
                ctx.translate(0, canvas.height);
                super.draw(ctx);
                ctx.restore();
            }
            if (this.x - this.size < 0 && this.y - this.size < 0) {
                ctx.save();
                ctx.translate(canvas.width, canvas.height);
                super.draw(ctx);
                ctx.restore();
            }
            if (this.x + this.size > canvas.width) {
                ctx.save();
                ctx.translate(-canvas.width, 0);
                super.draw(ctx);
                ctx.restore();
            }
            if (this.y + this.size > canvas.height) {
                ctx.save();
                ctx.translate(0, -canvas.height);
                super.draw(ctx);
                ctx.restore();
            }
            if (this.x + this.size > canvas.width && this.y + this.size > canvas.height) {
                ctx.save();
                ctx.translate(-canvas.width, -canvas.height);
                super.draw(ctx);
                ctx.restore();
            }
            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }
    }
    resizeCanvas();
    const MAX_DYNAMIC_STARS = 512;
    let numStars = Math.floor((window.innerWidth * window.innerHeight) * 0.001);
    if (numStars > MAX_DYNAMIC_STARS) {
        numStars = MAX_DYNAMIC_STARS;
    }
    const stars = Array(numStars).fill().map(() => new Star()).sort((a, b) => a.size - b.size);
    const staticStars = Array(numStars * 10).fill().map(() => new StaticStar());
    staticStars.forEach((star) => star.draw(offscreenCtx));

    function animate() {
        if (mouseMoved) {
            mouseX = newMouseX;
            mouseY = newMouseY;
            mouseMoved = false;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(offscreenCanvas, 0, 0, canvas.width, canvas.height);
        stars.sort((a, b) => a.size - b.size).forEach((star) => star.draw(ctx));
        requestAnimationFrame(animate);
    }
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            resizeCanvas();

            // Clear the offscreen canvas.
            offscreenCtx.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);

            // Recreate static stars based on the new canvas size and draw them to the offscreen canvas.
            const numStaticStars = Math.floor((window.innerWidth * window.innerHeight) * 0.001);
            staticStars.length = 0; // Empty the array
            staticStars.push(...Array(numStaticStars).fill().map(() => new StaticStar()));
            staticStars.forEach((star) => star.draw(offscreenCtx));

            // Recreate the dynamic stars based on the new canvas size.
            let numStars = Math.floor((window.innerWidth * window.innerHeight) * 0.001);
            if (numStars > MAX_DYNAMIC_STARS) {
                numStars = MAX_DYNAMIC_STARS;
            }
            stars.length = 0; // Empty the array
            stars.push(...Array(numStars).fill().map(() => new Star()));

        }, 100);
    });
    animate();
});
