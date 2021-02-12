/**
 * Lo siguiete es una funcion autoinvocada, la cual se define y se ejecuta al mismo tiempo
 * Esto se le conoce tambien como un modulo, y es una medida de seguridad para el navegador
 * Ya que las variables y constantes dentro del codigo no seran visibles para el usuario 
 */
const miModulo = (() => {
    'use strict'

    let deck = [];
    let puntosJugadores = [];
    const tipos = ['C', 'H', 'D', 'S'],
        especiales = ['A', 'J', 'Q', 'K'];

    // Referencias del HTML
    const btnPedir = document.querySelector('#btnPedir'),
        btnDetener = document.querySelector('#btnDetener'),
        btnNuevo = document.querySelector('#btnNuevo'),
        divCartasJugador = document.querySelectorAll('.divCartas'),
        puntosHTML = document.querySelectorAll('small');

    /**
     * Esta funcion se encarga de inicializar el juego con el numero de jugadores indicado
     * @param {int} numJugadores 
     */
    const inicializarJuego = (numJugadores = 2) => {
        deck = crearDeck();
        puntosJugadores = []
        for (let i = 0; i < numJugadores; i++) {
            puntosJugadores.push(0);
        }
        puntosHTML.forEach(elem => elem.innerText = 0);
        divCartasJugador.forEach(elem => elem.innerHTML = '');
    }

    /**
     * Esta funcion se encarga de realizar un efecto de transicion a las cartas que aparecen en el juego
     * @param {*} element 
     */
    function unfade(element) {
        var op = 0.1;
        var timer = setInterval(function() {
            if (op >= 1) {
                clearInterval(timer);
            }
            element.style.opacity = op;
            element.style.filter = 'alpha(opacity=' + op * 100 + ")";
            op += op * 0.1;
        }, 10);
    }

    /**
     * Con base en los arrelgos 'tipos' y 'especiales' se hacen las combinaciones de todas las cartas posibles en el deck y se almacenan para poder ser usados por el juego. Ademas hace uso de la libreria underscore para mezclar el deck
     */
    const crearDeck = () => {
        deck = [];
        for (let i = 2; i <= 10; i++) {
            for (let tipo of tipos) {
                deck.push(i + tipo);
            }
        }
        for (let tipo of tipos) {
            for (let esp of especiales) {
                deck.push(esp + tipo);
            }
        }
        return _.shuffle(deck);
    }

    /**
     * Self-explanatory: saca una carta del deck y la retorna, de no haber cartas en el deck, muestra un aviso con lo ocurrido
     */
    const pedirCarta = () => {
        if (deck.length > 0) {
            return deck.pop();
        } else {
            throw 'No hay cartas en el deck';
        }
    };

    /**
     * Recibe una carta y muestra su valor
     * @param {carta} carta 
     */
    const valorCarta = (carta) => {
        const letra = carta.substring(0, carta.length - 1);
        return !isNaN(letra) ? letra * 1 : letra === 'A' ? 11 : 10;
    }

    const acumularPuntos = (carta, turno) => {
        puntosJugadores[turno] = puntosJugadores[turno] + valorCarta(carta);
        puntosHTML[turno].innerText = puntosJugadores[turno];
        return puntosJugadores[turno];
    }

    const crearCarta = (carta, turno) => {
        const imgCarta = document.createElement('img');
        imgCarta.src = `/assets/cartas/${carta}.png`;
        imgCarta.classList.add('carta');
        imgCarta.style.opacity = 0;
        unfade(imgCarta);
        divCartasJugador[turno].append(imgCarta);
    }

    const determinarGanador = () => {
        // Desestructuracion de arreglos
        const [puntosMinimos, puntosComputadora] = puntosJugadores;
        setTimeout(() => {
            if (puntosComputadora === puntosMinimos) {
                alert('Empate');
            } else if (puntosMinimos > 21) {
                alert('Computadora gana')
            } else if (puntosComputadora > 21) {
                alert('Jugador Gana');
            } else {
                alert('Computadora Gana')
            }
        }, 500);
    }

    const turnoComputadora = (puntosMinimos) => {
        let puntosComputador = 0;
        do {
            const carta = pedirCarta();
            puntosComputador = acumularPuntos(carta, puntosJugadores.length - 1);
            crearCarta(carta, puntosJugadores.length - 1);
        } while ((puntosComputador < puntosMinimos) && (puntosMinimos <= 21));
        determinarGanador();
    }

    const reset = () => {
        console.clear();
        inicializarJuego();
        bloqueoBotones(false);
    }

    const bloqueoBotones = (bool) => {
        btnPedir.disabled = bool;
        btnDetener.disabled = bool;
    }

    btnPedir.addEventListener('click', () => {
        const carta = pedirCarta();
        const puntosJugador = acumularPuntos(carta, 0);
        crearCarta(carta, 0)

        if (puntosJugador > 21) {
            console.warn('Perdiste');
            bloqueoBotones(true);
            turnoComputadora(puntosJugador);
        } else if (puntosJugador === 21) {
            console.warn('Ganaste');
            bloqueoBotones(true);
            turnoComputadora(puntosJugador);
        }
    });

    btnDetener.addEventListener('click', () => {
        btnPedir.disabled = true;
        btnDetener.disabled = true;
        turnoComputadora(puntosJugadores[0]);
    });

    btnNuevo.addEventListener('click', () => {
        reset();
    });

    // Esto es el valor de retorno, el cual sera publico fuera del modulo
    return {
        nuevoJuego: inicializarJuego
    };
})();