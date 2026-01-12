document.addEventListener("DOMContentLoaded", (event) => {
    gsap.registerPlugin(ScrollTrigger, Flip);

    const lenis = new Lenis();
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);


    let flipAnimation = null;
    const originalBox = document.querySelector(".box");
    const spaceSection = document.querySelector(".space");

    if (originalBox && spaceSection) {
        // 1. Initial Setup
        const rect = originalBox.getBoundingClientRect();
        const clonnedBox = originalBox.cloneNode(true);
        const centerX = rect.left + rect.width / 2 + 60;
        const centerY = rect.top + rect.height / 2 ;

        gsap.set(clonnedBox, {
            position: "fixed",
            left : centerX - originalBox.offsetWidth / 2 + "px",
            top: centerY - originalBox.offsetHeight + "6px",
            width: "98px",
            height: "98px",
            pointerEvents: "none",
            willChange: "transform",
            zIndex: 10,
        });

        spaceSection.appendChild(clonnedBox);
        gsap.set(originalBox, { opacity: 0 });

        // 2. Prepare the Flip State
        // Capture state BEFORE the change
        const state = Flip.getState(clonnedBox);

        // Make the change (the "end" state of the flip)
        gsap.set(clonnedBox, {
            left: 0,
            top: 0,
            width: "100%",
            height: "100vh" // Assuming you want full screen
        });

        // Create the timeline/animation but leave it paused
        flipAnimation = Flip.from(state, {
            duration: 0.2,
            ease: "none",
            paused: true,
        });

        // 3. ScrollTrigger to scrub the flipAnimation
        ScrollTrigger.create({
            trigger: ".main",
            start: "top top",
            end: ( ) => `+=${window.innerHeight * 1.2}`, // Adjust distance as needed
            pin: true, // Often helpful for full-screen transitions
            scrub: true,
            onUpdate: (self) => {
    // 1. Sincronizar la animación de Flip con el scroll
                flipAnimation.progress(self.progress);

  // 2. Lógica de intercambio de opacidad
            if (self.progress >= 1) {
        // Cuando llega al final: ocultamos el clon, mostramos el original
            gsap.set(clonnedBox, { opacity: 0 });
            gsap.set(originalBox, { opacity: 1 });
        } else {
        // Mientras se hace scroll hacia arriba: revertimos el estado
            gsap.set(clonnedBox, { opacity: 1 });
            gsap.set(originalBox, { opacity: 0 });
        }
},
onLeaveBack: () => {
    flipAnimation.progress(0);
    gsap.set(clonnedBox, { opacity: 1 });
    gsap.set(originalBox, { opacity: 0 });
}
        });
    }
});