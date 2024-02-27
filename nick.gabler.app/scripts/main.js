window.onload = function () {
    gsap.from('#title', {
        opacity: 0,
        duration: 1,
        onComplete: () => {
            // After the title animation completes, animate each link
            gsap.from('#social-links a', {
                opacity: 0, // Animate opacity to 1
                duration: 0.5, // Each animation takes 0.5 seconds
                stagger: 0.2, // Delay each subsequent animation by 0.2 seconds
                ease: 'power1.inOut', // This eases both the start and end of the animation
            });
        }
    })
};
