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
    const clonWrapper = document.querySelector(".clonWrapper");

    if (originalBox && clonWrapper) {
        // 1. Initial Setup
        const clonnedBox = originalBox.cloneNode(true);

        gsap.set(clonWrapper, {
            position: "fixed",
            width: "48px",
            height: "48px",
            pointerEvents: "none",
            willChange: "transform",
            zIndex: 10,
        });

        clonWrapper.appendChild(clonnedBox);
        gsap.set(originalBox, { opacity: 0 });

        // 2. Preparar el Flip State
        const state = Flip.getState(clonnedBox);
        // Hacer el cambio
        gsap.set(clonWrapper, {
            width: "100%",
            height: "100vh"
        });
        // Hacer animacion pero dejar pausada
        flipAnimation = Flip.from(state, {
            duration: 0.2,
            ease: "none",
            paused: true,
        });
        // 3. ScrollTrigger para controlar flipAnimation
        ScrollTrigger.create({
            trigger: ".main",
            start: "top top",
            end: ( ) => `+=${window.innerHeight * 1.0}`, // Adjust distance as needed
            pin: true, // Often helpful for full-screen transitions
            scrub: true,
            onUpdate: (self) => {
    // 1. Sincronizar la animación de Flip con el scroll
                flipAnimation.progress(self.progress);

  // 2. Lógica de intercambio de opacidad
            if (self.progress >= 1) {
            gsap.set(clonnedBox, { opacity: 0 });
            gsap.set(originalBox, { opacity: 1 });
        } else {
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
