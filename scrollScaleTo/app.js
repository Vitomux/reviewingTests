document.addEventListener("DOMContentLoaded", (event) => {
    gsap.registerPlugin(ScrollTrigger, Flip);

    const lenis = new Lenis( );
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add( ( time) => {
        lenis.raf( time * 1000 );
    });
    gsap.ticker.lagSmoothing( 0 );


    let flipAnimation = null;
    const originalBox = document.querySelector(".box"); // caja objetivo
    const clonWrapper = document.querySelector(".clonWrapper"); // contenedor de nuestro clon
    const space = document.querySelector(".space") // div padre



    if ( originalBox && clonWrapper ) {
        const clonnedBox = originalBox.cloneNode(true); // clonamos nuestro objetivo ().box)
        clonWrapper.appendChild( clonnedBox ); // lo ubicamos dentro del wrapper
        const rectClon = clonWrapper.getBoundingClientRect( ); // el espacio y coordenadas que habita nuestro clon
        gsap.set( originalBox, { opacity: 0 } ); // desvanecemos nuestro objetivo


        gsap.set( clonWrapper, { 
            position: "fixed",
            width: "48px",
            height: "48px",
            pointerEvents: "none",
            willChange: "transform",
            zIndex: 10,
        });


        const state = Flip.getState( clonWrapper ); // el estado actual de nuestro clon
        gsap.set( clonWrapper, {   
                width: "100%", // Le damos las direcciones de expansion a nuestro clon 
                height: space.offsetHeight, // crece con la altura real de su div padre
                top: rectClon.top, // empujado por el espacio entre el top viewport y el clon
                left: 0,
                right: 0
        });

        flipAnimation = Flip.from( state, {
                duration: 1,
                ease: "power3.in",
                paused: true,
        });

        ScrollTrigger.create( {
                trigger: space,
                start: "center top",
                end: ( ) => `+=${ space.offsetHeight   -  rectClon.bottom } `, // la altura completa de space (div padre) menos el espacio entre el fondo de nuestro clon (div hijo) y el top del viewport nos dan como resultado la distancia entre el clon y la proxima seccion (nuestro objetivo)
                pin: true,
                scrub: true,
                markers: true,
                onUpdate: ( self ) => {  // a medida que se actualiza el scroll, sucede nuestra animación
                    flipAnimation.progress( self.progress ); 
                    if ( self.progress >= 1) {                         
                        gsap.set( clonnedBox, { opacity: 0 } );   // seteamos la opacidad de nuestro clon, 
                        gsap.set( originalBox, { opacity: 1 } );   // al encontrarse con nuestro objetivo cambian de opacidades
                    } else {
                        gsap.set( clonnedBox, { opacity: 1 } );
                        gsap.set( originalBox, { opacity: 0 } );
                    }
                },
                onLeaveBack: ( ) => { // ------------- En caso de subir el scroll, vuelven a las opacidades originales 
                        flipAnimation.progress( 0 );
                        gsap.set( clonnedBox, { opacity: 1 } );
                        gsap.set( originalBox, { opacity: 0 } );
                    }
        });
    }
}); 

