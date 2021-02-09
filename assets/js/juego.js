let deck = [];
let tipos = ['C', 'H', 'D', 'S']
let especiales = ['A', 'J', 'Q', 'K'];

let puntosJugador = 0,
    puntosComputador = 0;

const jugador = prompt('Cual es su nombre?');
const smalls = document.querySelectorAll('small');
const btnPedir = document.querySelector('#btnPedir');
const btnDetener = document.querySelector('#btnDetener');
const btnNuevo = document.querySelector('#btnNuevo');
const nombreJugador = document.querySelector('#jugador');
const divCartasPC = document.querySelector('#computadora-cartas');
const divCartasJugador = document.querySelector('#jugador-cartas');

function unfade(element) {
    var op = 0.1; // initial opacity
    var timer = setInterval(function() {
        if (op >= 1) {
            clearInterval(timer);
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op += op * 0.1;
    }, 10);
}

const crearDeck = () => {
    deck = [];
    for (let i = 2; i <= 10; i++) {
        for (let tipo of tipos) {
            deck.push(i + tipo);
        }
    }
    for (let esp of especiales) {
        for (tipo of tipos) {
            deck.push(esp + tipo);
        }
    }
    deck = _.shuffle(deck);
}

const pedirCarta = () => {
    if (deck.length > 0) {
        return deck.pop();
    } else {
        throw 'No hay cartas en el deck';
    }
};

const valorCarta = (carta) => {
    let letra = carta.substring(0, carta.length - 1)
    return !isNaN(letra) ? letra * 1 : letra === 'A' ? 11 : 10;
}

const turnoComputadora = (puntosMinimos) => {

    do {
        const carta = pedirCarta();

        puntosComputador = puntosComputador + valorCarta(carta);
        smalls[1].innerText = puntosComputador;

        const imgCarta = document.createElement('img');
        imgCarta.src = `/assets/cartas/${carta}.png`;
        imgCarta.classList.add('carta');
        divCartasPC.append(imgCarta);


        if (puntosMinimos > 21) {
            console.warn('Gana la PC');
            break;
        }
    } while ((puntosComputador < puntosMinimos) && (puntosMinimos <= 21));

    setTimeout(() => {
        mensajeFinal();
    }, 500);


}

const reset = () => {
    console.clear();
    crearDeck();
    bloqueoBotones(false);
    puntosComputador = 0;
    puntosJugador = 0;
    smalls[0].innerText = puntosJugador;
    smalls[1].innerText = puntosComputador;
    divCartasJugador.innerHTML = '';
    divCartasPC.innerHTML = '';
}

const bloqueoBotones = (bool) => {
    btnPedir.disabled = bool;
    btnDetener.disabled = bool;
}

btnPedir.addEventListener('click', () => {
    const carta = pedirCarta();
    puntosJugador = puntosJugador + valorCarta(carta);
    smalls[0].innerText = puntosJugador;

    const imgCarta = document.createElement('img');
    imgCarta.src = `/assets/cartas/${carta}.png`;
    imgCarta.classList.add('carta');
    imgCarta.style.opacity = 0;
    unfade(imgCarta);
    divCartasJugador.append(imgCarta);

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

btnNuevo.addEventListener('click', () => {
    reset();
});

btnDetener.addEventListener('click', () => {
    btnPedir.disabled = true;
    btnDetener.disabled = true;
    turnoComputadora(puntosJugador);
});

const mensajeFinal = () => {
    const mensaje = puntosComputador === puntosJugador ? 'Empate' :
        puntosJugador > 21 ? 'Gana PC' :
        ((puntosJugador < puntosComputador) && (puntosComputador <= 21)) ? 'Gana PC' : `Gana ${jugador}`;

    if (confirm(mensaje)) {
        reset();
    }
}

nombreJugador.innerText = jugador + ':';
crearDeck();