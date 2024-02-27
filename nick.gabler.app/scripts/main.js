window.onload = function () {
    gsap.to('#title', {
        opacity: 1,
        duration: 1,
        ease: 'power1.inOut',
        onComplete: () => {
            gsap.to('#social-links a', {
                opacity: 1,
                duration: 0.5,
                stagger: 0.2,
                ease: 'power1.inOut',
            });
        }
    })
};
