
/* Con classList.add podemos cambiar la clase de nuestro elemento asignando mediante javascript una clase nueva.
No está ejemplificado pero podemos cambiar propiedades con documentElement.style.setProperty( ) */

const loader = document.getElementById('screenLoader'); 
const tittle = document.getElementById('tittle');

const loadingPagge = ( ) => {
    loader.classList.add('remove-loader')  // al elemento loader le asignamos una nueva clase (remove-loader)
    tittle.classList.add('appear-tittle') // lo mismo con tittle, las transisiones y se manejan via CSS
}
//desde setTimeout llamamos la función 1 segundo despues de cargar la pagina

setTimeout( ( ) => { 
    loadingPagge( )
}, 1000 );

//-------------------------------------------------------

/* Estos conceptos son avanzados, cursor es un div de posicion absoluta y tamaño fijo en el body de nuestra pagina */

const cursor = document.getElementById('cursor');

// Armaremos un objeto con las settings de nuestro cursor para poder acceder a estos valores eventualmente.

let settings = {
    mouseX: 0, // Posición del mouse en el eje x
    mouseY: 0, // Posición del mouse en el eje y
    xPos: 0, // Posición del elemento "cursor" en x
    yPos: 0, // Posición del elemento "cursor" en y
    speed: 12
}

// offsetWidth devuelve el ancho total de un elemento en píxeles, X
// offsetHeight devuelve el alto total de un elemento en píxeles, Y

let cursorWidth = cursor.offsetWidth // de esta manera conseguimos el ancho y alto de nuestro cursor
let cursorHeight = cursor.offsetHeight

/* Acá vamos a llamar y utilizar valores de nuestro objeto settings como propiedades de movimiento de nuestro cursor */

function animate( ){
    /* Para movernos en los ejes X-Y declaramos que la posicion del "cursor"  en x (xPOs) y en y (yPos) son iguales a si mismas + la resta de la posición del mouse contra la posicion del "cursor" dividida por la velocidad */
    
    settings.xPos += ( settings.mouseX - settings.xPos ) / settings.speed 
    settings.yPos += ( settings.mouseY - settings.yPos ) / settings.speed 

    /* Cambiamos el estilo trasladando la posicion de nuestro elemento, para centrar el elemento con el mouse, dividimos el ancho de nuestro elemento y se lo restamos a su posición en el eje correspondiente */
    cursor.style.transform = `translate( ${ settings.xPos - cursorWidth / 2 }px, ${ settings.yPos - cursorHeight / 2 }px )`
    
    requestAnimationFrame( animate ) // para que la animación se invoque constantemente, llamamos dentro de la misma ésta API
}

animate( )

/* esto es el corazon de la funcion, de acá sacamos los valores que mueven todo al asignarle a nuestro objeto valores reales a partir de los eventos de la pagina donde e.pageX y e.pareY son coordenadas actualizadas de la posición del mouse */

document.addEventListener('mousemove', e =>{
settings.mouseX = e.pageX
settings.mouseY = e.pageY
console.log(e);
})
