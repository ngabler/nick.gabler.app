window.onload = function () {
    let tl = gsap.timeline();

    // Add the title animation to the timeline
    tl.to('#title', {
        opacity: 1,
        duration: 1,
        ease: 'power1.inOut'
    });

    // Add the social links animation to the timeline with correlated direction and fade
    tl.to('#social-links a', {
        opacity: 1,
        duration: 0.5,
        stagger: {
            each: 0.5,
            // Function to set initial properties based on index
            onStart: function(i, target, targets) {
                // Alternate starting x offset based on index; even indices start from left, odd from right
                let directionOffset = i % 2 === 0 ? -200: 200;
                gsap.set(target, { x: directionOffset, opacity: 0 });
            }
        },
        x: 0, // Animate to original position
        ease: "expoScale(0.5,7,power1.inOut)",
    });
};
