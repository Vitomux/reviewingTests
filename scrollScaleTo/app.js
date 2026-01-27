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

        gsap.set( originalBox, { opacity: 0 } ); // desvanecemos nuestro objetivo
        const rectSpace = space.getBoundingClientRect( ); // obtenemos coordenadas y espacialidad de nuestro div padre
        const rectClon = clonWrapper.getBoundingClientRect( );
        const rectTarget = originalBox.getBoundingClientRect( );


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
                width: "100%",
                height: rectSpace.height, // Le damos las direcciones de expansion a nuestro clon 
                left: rectTarget.left,        // Que adopte la altura de space, que se expanda hacia los lados del target y sea empujado desde el top del clon
                right: rectTarget.right, // asi aseguramos expansion limpia y matematicamente correcta hasta alcanzar objetivo
                top: rectClon.top,
        });

        flipAnimation = Flip.from( state, {
                duration: 2,
                ease: "power3.in",
                paused: true,
        });

        ScrollTrigger.create( {
                trigger: space,
                start: "center",
                end: ( ) => `+=${  ( rectSpace.height * 1) - rectClon.bottom }`, // la altura de space (div padre) menos el espacio entre el fondo de nuestro clon (div hijo) y el top del viewport nos dan como resultado la distancia entre el clon y la proxima seccion (nuestro objetivo)
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

