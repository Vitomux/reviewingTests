document.addEventListener("DOMContentLoaded", (event) => {
    gsap.registerPlugin(ScrollTrigger, Flip);

    //                Setear Lenis scroll 
 // -----------------------------------------------//
    
    const lenis = new Lenis( );
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add( ( time) => {
        lenis.raf( time * 1000 );
    });
    gsap.ticker.lagSmoothing( 0 );


        //            Elementos
 // -----------------------------------------------//

    let flipAnimation = null;
    const originalBox = document.querySelector(".box"); // caja objetivo
    const clonWrapper = document.querySelector(".clonWrapper"); // contenedor de nuestro clon
    const space = document.querySelector(".space") // div padre


    //                Configuración
 // -----------------------------------------------//

    if ( originalBox && clonWrapper ) {
        const clonnedBox = originalBox.cloneNode(true); // clonamos nuestro objetivo ().box)
        clonWrapper.appendChild( clonnedBox ); // lo ubicamos dentro del wrapper
        gsap.set( originalBox, { opacity: 0 } ); // desvanecemos nuestro objetivo
        const rectSpace = space.getBoundingClientRect( ); // obtenemos coordenadas y espacialidad de nuestro div padre

        // ----Configuramos desde GSAP el estado del objeto a animar ( wrapper que contiene el clon ) ----//

        gsap.set( clonWrapper, { 
            position: "fixed",
            width: "48px",
            height: "48px",
            pointerEvents: "none",
            willChange: "transform",
            zIndex: 10,
        });


        //----- Configuramos nuestra animación con Flip y el estado de esta ---------- //

        const state = Flip.getState( clonWrapper ); // el estado actual de nuestro clon

        // seteamos el estado final
        
        gsap.set( clonWrapper, {   
            width: "100%",
            height: rectSpace.height, // Le damos las direcciones de expansion a nuestro clon 
            left: rectSpace.left,        // desde las coordenadas de rectSpace ( coordenadas de nuestro padre )
            right: rectSpace.right, // asi aseguramos expansion limpia y matematicamente correcta hasta alcanzar objetivo
            top: rectSpace.top,
            });

        flipAnimation = Flip.from( state, {  // y las propiedades de nuestra animación Como vamos del principio al final
            duration: 1,
            ease: "none",
            paused: true,
        });

        ScrollTrigger.create( {
            trigger: ".main",
            start: "top top",
            end: ( ) => `+=${ window.innerHeight * 1 }`, // termina la animacion una vez alcanzada la altura de la pantalla
            pin: true,
            scrub: true,
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

onLeaveBack: () => { // ------------- En caso de subir el scroll, vuelven a las opacidades originales 
    flipAnimation.progress( 0 );
    gsap.set( clonnedBox, { opacity: 1 } );
    gsap.set( originalBox, { opacity: 0 } );
}
        });
    }
}); 

