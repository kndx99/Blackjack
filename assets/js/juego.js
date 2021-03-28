/**
 * Lo siguiete es una funcion autoinvocada, la cual se define y se ejecuta al mismo tiempo
 * Esto se le conoce tambien como un modulo, y es una medida de seguridad para el navegador
 * Ya que las variables y constantes dentro del codigo no seran visibles para el usuario
 */
const miModulo = (() => {
    "use strict";

    let deck = [];
    let puntosJugadores = [];
    const tipos = ["C", "H", "D", "S"],
        especiales = ["A", "J", "Q", "K"];

    // Referencias del HTML
    const btnPedir = document.querySelector("#btnPedir"),
        btnDetener = document.querySelector("#btnDetener"),
        btnNuevo = document.querySelector("#btnNuevo"),
        btnAyuda = document.querySelector("#btnAyuda"),
        divCartasJugador = document.querySelectorAll(".divCartas"),
        puntosHTML = document.querySelectorAll("small");

    const inicializarJuego = (numJugadores = 2) => {
        deck = crearDeck();
        puntosJugadores = [];
        for (let i = 0; i < numJugadores; i++) {
            puntosJugadores.push(0);
        }
        // Por cada elemento que sea de la clase smalll y .divCartas, limpia lo que tenga dentro del tag correspondiente
        puntosHTML.forEach((elem) => (elem.innerText = 0));
        divCartasJugador.forEach((elem) => (elem.innerHTML = ""));
    };

    /**
     * Funcion que permite crear el efecto de desvanecer
     * @param {Object} element
     */
    function unfade(element) {
        var op = 0.1;
        var timer = setInterval(function () {
            if (op >= 1) {
                clearInterval(timer);
            }
            element.style.opacity = op;
            element.style.filter = "alpha(opacity=" + op * 100 + ")";
            op += op * 0.1;
        }, 10);
    }

    /**
     * Funcion que limpia el deck, y basado en los arrays tipos y especiales, forman el nombre de archivo de cada carta en el deck, luego, el deck es barajado de manera aleatoria
     * @returns un deck barajado
     */
    const crearDeck = () => {
        deck = [];
        // Cartas del 2 al 10 con cada tipo
        for (let i = 2; i <= 10; i++) {
            for (let tipo of tipos) {
                deck.push(i + tipo);
            }
        }
        // Cartas A, J, Q y K con cada tipo
        for (let tipo of tipos) {
            for (let esp of especiales) {
                deck.push(esp + tipo);
            }
        }
        return _.shuffle(deck);
    };

    /**
     * Funcion simple que nos retorna una carta de estar disponible
     * @returns una carta o un mensaje de error
     */
    const pedirCarta = () => {
        if (deck.length > 0) {
            return deck.pop();
        } else {
            throw "No hay cartas en el deck";
        }
    };

    /**
     * Funcion que contiene un algoritmo que nos dice el valor de la carta
     * @param {carta} carta
     * @returns el valor de la carta
     */
    const valorCarta = (carta) => {
        const letra = carta.substring(0, carta.length - 1);
        return !isNaN(letra) ? letra * 1 : letra === "A" ? 11 : 10;
    };

    /**
     * Esto sirve para acumular puntoss
     * @param {carta} carta
     * @param {int} turno
     * @returns
     */
    const acumularPuntos = (carta, turno) => {
        puntosJugadores[turno] = puntosJugadores[turno] + valorCarta(carta);
        puntosHTML[turno].innerText = puntosJugadores[turno];
        return puntosJugadores[turno];
    };

    const crearCarta = (carta, turno) => {
        const imgCarta = document.createElement("img");
        imgCarta.src = `/assets/cartas/${carta}.png`;
        imgCarta.classList.add("carta");
        imgCarta.style.opacity = 0;
        unfade(imgCarta);
        divCartasJugador[turno].append(imgCarta);
    };

    const determinarGanador = () => {
        // Desestructuracion de arreglos
        const [puntosMinimos, puntosComputadora] = puntosJugadores;
        setTimeout(() => {
            if (puntosComputadora === puntosMinimos) {
                alert("Empate");
            } else if (puntosMinimos > 21) {
                alert("Computadora gana");
            } else if (puntosComputadora > 21) {
                alert("Jugador Gana");
            } else {
                alert("Computadora Gana");
            }
        }, 500);
    };

    const turnoComputadora = (puntosMinimos) => {
        let puntosComputador = 0;
        do {
            const carta = pedirCarta();
            puntosComputador = acumularPuntos(
                carta,
                puntosJugadores.length - 1
            );
            crearCarta(carta, puntosJugadores.length - 1);
        } while (puntosComputador < puntosMinimos && puntosMinimos <= 21);
        determinarGanador();
    };

    const reset = () => {
        console.clear();
        inicializarJuego();
        bloqueoBotones(false);
    };

    const bloqueoBotones = (bool) => {
        btnPedir.disabled = bool;
        btnDetener.disabled = bool;
    };

    btnPedir.addEventListener("click", () => {
        const carta = pedirCarta();
        const puntosJugador = acumularPuntos(carta, 0);
        crearCarta(carta, 0);

        if (puntosJugador > 21) {
            console.warn("Perdiste");
            bloqueoBotones(true);
            turnoComputadora(puntosJugador);
        } else if (puntosJugador === 21) {
            console.warn("Ganaste");
            bloqueoBotones(true);
            turnoComputadora(puntosJugador);
        }
    });

    btnDetener.addEventListener("click", () => {
        btnPedir.disabled = true;
        btnDetener.disabled = true;
        turnoComputadora(puntosJugadores[0]);
    });

    btnNuevo.addEventListener("click", () => {
        reset();
    });

    btnAyuda.addEventListener("click", () => {
        alert(
            "El objetivo de este juego es sumar 21 puntos o no pasarse de esta cifra, pero siempre sobrepasando el valor que tiene el oponente (La PC) para ganar la partida. Las cartas del 2 al 10 valen su valor natural; las cartas J, Q y K también valen 10 y el A's 11."
        );
    });

    // Esto es el valor de retorno, el cual sera publico fuera del modulo
    return {
        nuevoJuego: inicializarJuego,
    };
})();
