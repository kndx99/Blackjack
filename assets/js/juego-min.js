const miModulo = (() => { "use strict"; let e = [],
        t = []; const a = ["C", "H", "D", "S"],
        r = ["A", "J", "Q", "K"],
        n = document.querySelector("#btnPedir"),
        o = document.querySelector("#btnDetener"),
        l = document.querySelector("#btnNuevo"),
        s = document.querySelector("#btnAyuda"),
        c = document.querySelectorAll(".divCartas"),
        d = document.querySelectorAll("small"),
        u = (a = 2) => { e = i(), t = []; for (let e = 0; e < a; e++) t.push(0);
            d.forEach(e => e.innerText = 0), c.forEach(e => e.innerHTML = "") }; const i = () => { e = []; for (let t = 2; t <= 10; t++)
                for (let r of a) e.push(t + r); for (let t of a)
                for (let a of r) e.push(a + t); return _.shuffle(e) },
        p = () => { if (e.length > 0) return e.pop(); throw "No hay cartas en el deck" },
        m = (e, a) => (t[a] = t[a] + (e => { const t = e.substring(0, e.length - 1); return isNaN(t) ? "A" === t ? 11 : 10 : 1 * t })(e), d[a].innerText = t[a], t[a]),
        f = (e, t) => { const a = document.createElement("img");
            a.src = `/assets/cartas/${e}.png`, a.classList.add("carta"), a.style.opacity = 0,
                function(e) { var t = .1,
                        a = setInterval(function() { t >= 1 && clearInterval(a), e.style.opacity = t, e.style.filter = "alpha(opacity=" + 100 * t + ")", t += .1 * t }, 10) }(a), c[t].append(a) },
        y = e => { let a = 0;
            do { const e = p();
                a = m(e, t.length - 1), f(e, t.length - 1) } while (a < e && e <= 21);
            (() => { const [e, a] = t;
                setTimeout(() => { a === e ? alert("Empate") : e > 21 ? alert("Computadora gana") : a > 21 ? alert("Jugador Gana") : alert("Computadora Gana") }, 500) })() },
        v = e => { n.disabled = e, o.disabled = e }; return n.addEventListener("click", () => { const e = p(),
            t = m(e, 0);
        f(e, 0), t > 21 ? (console.warn("Perdiste"), v(!0), y(t)) : 21 === t && (console.warn("Ganaste"), v(!0), y(t)) }), o.addEventListener("click", () => { n.disabled = !0, o.disabled = !0, y(t[0]) }), l.addEventListener("click", () => { console.clear(), u(), v(!1) }), s.addEventListener("click", () => { alert("El objetivo de este juego es sumar 21 puntos o no pasarse de esta cifra, pero siempre sobrepasando el valor que tiene el oponente (La PC) para ganar la partida. Las cartas del 2 al 10 valen su valor natural; las cartas J, Q y K también valen 10 y el A's 11.") }), { nuevoJuego: u } })();