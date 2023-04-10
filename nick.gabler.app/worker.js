self.addEventListener('message', (e) => {
    const { stars, mouseX, mouseY, canvasWidth, canvasHeight, scrollX, scrollY } = e.data;
    const updatedStars = stars.map((star) => {
        const x = star.x + ((star.initialMouseX - canvasWidth / 2) * 0.001 * star.speed) + (mouseX - canvasWidth / 2) * 0.001 * star.speed - scrollX * 0.001 * star.speed;
        const y = star.y + ((star.initialMouseY - canvasHeight / 2) * 0.001 * star.speed) + (mouseY - canvasHeight / 2) * 0.001 * star.speed - scrollY * 0.001 * star.speed;
        return { ...star, x, y };
    });

    self.postMessage(updatedStars);
});
