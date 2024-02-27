window.onload = function () {
    let tl = gsap.timeline();
    tl.to('#title', {
        opacity: 1,
        duration: 1,
        ease: 'power1.inOut'
    });
    tl.to('#social-links a', {
        opacity: 1,
        duration: 0.5,
        stagger: 0.2,
        ease: 'power1.inOut'
    });
};

