/* =========================================================
   HALLOWEEN NIGHT
   JAVASCRIPT
========================================================= */


/* =========================================================
   COUNTDOWN
========================================================= */

const targetDate =
    new Date(
        "October 31, 2026 22:00:00"
    ).getTime();


function updateCountdown() {

    const now =
        new Date().getTime();

    const distance =
        targetDate - now;


    const days =
        document.getElementById("days");

    const hours =
        document.getElementById("hours");

    const minutes =
        document.getElementById("minutes");

    const seconds =
        document.getElementById("seconds");


    if (
        distance <= 0
    ) {

        days.innerText = "00";
        hours.innerText = "00";
        minutes.innerText = "00";
        seconds.innerText = "00";

        return;

    }


    days.innerText =
        Math.floor(
            distance /
            (1000 * 60 * 60 * 24)
        )
        .toString()
        .padStart(2, "0");


    hours.innerText =
        Math.floor(
            (
                distance %
                (1000 * 60 * 60 * 24)
            )
            /
            (1000 * 60 * 60)
        )
        .toString()
        .padStart(2, "0");


    minutes.innerText =
        Math.floor(
            (
                distance %
                (1000 * 60 * 60)
            )
            /
            (1000 * 60)
        )
        .toString()
        .padStart(2, "0");


    seconds.innerText =
        Math.floor(
            (
                distance %
                (1000 * 60)
            )
            /
            1000
        )
        .toString()
        .padStart(2, "0");

}


setInterval(
    updateCountdown,
    1000
);


updateCountdown();



/* =========================================================
   GOOGLE SHEETS
========================================================= */

/*
   NUOVO URL DELLA WEB APP
*/

const scriptURL =
    "https://script.google.com/macros/s/AKfycbze5GIdLeGpa0koj-Am7ipmz7oNKYQ7v2bSRG-z_Hx7iOq4XWH9dystssiYd9rsMI5z/exec";


const form =
    document.forms[
        "submit-to-google-sheet"
    ];


const msg =
    document.getElementById(
        "msg"
    );


const submitBtn =
    document.getElementById(
        "submit-btn"
    );


let isSubmitting =
    false;



/* =========================================================
   VALIDAZIONE TELEFONO
========================================================= */

function isValidPhone(phone) {

    const cleaned =
        phone.replace(
            /[\s\-().]/g,
            ""
        );


    return /^\+?[0-9]{8,15}$/.test(
        cleaned
    );

}



/* =========================================================
   ERRORE INPUT
========================================================= */

function showInputError(input) {

    input.style.borderColor =
        "#ff2222";


    input.style.boxShadow =
        "0 0 12px rgba(255,0,0,0.55)";

}


function clearInputError(input) {

    input.style.borderColor =
        "";

    input.style.boxShadow =
        "";

}



/* =========================================================
   INVIO FORM
========================================================= */

form.addEventListener(
    "submit",
    function(e) {

        e.preventDefault();


        /* =============================================
           EVITA DOPPIO INVIO
        ============================================= */

        if (
            isSubmitting
        ) {

            return;

        }


        isSubmitting =
            true;


        submitBtn.disabled =
            true;



        /* =============================================
           DATI FORM
        ============================================= */

        const year =
            Number(
                form.Anno.value
            );


        const phone =
            form.Telefono.value.trim();


        clearInputError(
            form.Anno
        );


        clearInputError(
            form.Telefono
        );



        /* =============================================
           CONTROLLO ANNO
        ============================================= */

        if (
            !Number.isInteger(year) ||
            year < 1900 ||
            year > 2026
        ) {

            showInputError(
                form.Anno
            );


            msg.innerText =
                "⚠️ Inserisci un anno di nascita valido.";


            msg.style.color =
                "#ff3333";


            isSubmitting =
                false;


            submitBtn.disabled =
                false;


            return;

        }



        /* =============================================
           CONTROLLO TELEFONO
        ============================================= */

        if (
            !isValidPhone(phone)
        ) {

            showInputError(
                form.Telefono
            );


            msg.innerText =
                "📱 Inserisci un numero di telefono valido.";


            msg.style.color =
                "#ff3333";


            isSubmitting =
                false;


            submitBtn.disabled =
                false;


            return;

        }



        /* =============================================
           STATO INVIO
        ============================================= */

        submitBtn.innerHTML =
            "🕷️ INVIO IN CORSO...";


        msg.innerText =
            "⏳ Stiamo registrando la tua partecipazione...";


        msg.style.color =
            "#aaa";



        /* =============================================
           INVIO A GOOGLE APPS SCRIPT
        ============================================= */

        fetch(
            scriptURL,
            {
                method: "POST",

                body:
                    new FormData(form)
            }
        )


        .then(
            response => {

                if (
                    !response.ok
                ) {

                    throw new Error(
                        "Errore HTTP " +
                        response.status
                    );

                }


                return response.text();

            }
        )


        .then(
            text => {

                console.log(
                    "Risposta Google:",
                    text
                );


                const result =
                    text.trim();


                /* =====================================
                   DUPLICATO
                ===================================== */

                if (
                    result ===
                    "duplicate"
                ) {

                    msg.innerText =
                        "🎃 Sei già iscritto alla lista!";


                    msg.style.color =
                        "#ffb52e";


                    localStorage.setItem(
                        "registered",
                        "yes"
                    );

                }


                /* =====================================
                   REGISTRAZIONE COMPLETATA
                ===================================== */

                else if (
                    result ===
                    "success"
                ) {

                    msg.innerText =
                        "👻 ISCRIZIONE COMPLETATA! Ci vediamo il 31 ottobre.";


                    msg.style.color =
                        "#ff7518";


                    showHalloweenEffect();


                    localStorage.setItem(
                        "registered",
                        "yes"
                    );

                }


                /* =====================================
                   ERRORE RESTITUITO DA GOOGLE
                ===================================== */

                else {

                    throw new Error(
                        "Risposta inattesa: " +
                        result
                    );

                }


                /* =====================================
                   RESET
                ===================================== */

                form.reset();


                submitBtn.disabled =
                    false;


                submitBtn.innerHTML =
                    "<span>👻</span> PARTECIPA ALLA NOTTE <span>🎃</span>";


                isSubmitting =
                    false;


                /* Nasconde il form dopo
                   una breve animazione */

                setTimeout(
                    () => {

                        form.style.display =
                            "none";

                    },
                    1200
                );

            }
        )


        .catch(
            error => {

                console.error(
                    "Errore invio:",
                    error
                );


                msg.innerText =
                    "💀 Qualcosa è andato storto. Riprova tra poco.";


                msg.style.color =
                    "#ff3333";


                submitBtn.disabled =
                    false;


                submitBtn.innerHTML =
                    "<span>👻</span> PARTECIPA ALLA NOTTE <span>🎃</span>";


                isSubmitting =
                    false;

            }
        );

    }
);



/* =========================================================
   EFFETTO HALLOWEEN DOPO ISCRIZIONE
========================================================= */

function showHalloweenEffect() {

    const particlesContainer =
        document.getElementById(
            "particles"
        );


    /* Controllo di sicurezza */

    if (
        !particlesContainer
    ) {

        return;

    }


    const symbols = [

        "🎃",
        "👻",
        "🦇",
        "🕷️",
        "🕸️",
        "☠️"

    ];


    for (
        let i = 0;
        i < 50;
        i++
    ) {

        const particle =
            document.createElement(
                "div"
            );


        particle.className =
            "halloween-particle";


        particle.innerText =
            symbols[
                Math.floor(
                    Math.random() *
                    symbols.length
                )
            ];


        particle.style.left =
            Math.random() *
            100 +
            "vw";


        particle.style.top =
            (
                55 +
                Math.random() *
                45
            ) +
            "vh";


        particle.style.setProperty(
            "--random-x",
            (
                Math.random() *
                240 -
                120
            )
        );


        particle.style.animationDelay =
            Math.random() *
            0.7 +
            "s";


        particlesContainer.appendChild(
            particle
        );


        setTimeout(
            () => {

                particle.remove();

            },
            2500
        );

    }

}



/* =========================================================
   CONTROLLO LOCAL STORAGE
========================================================= */

if (
    localStorage.getItem(
        "registered"
    ) === "yes"
) {

    form.style.display =
        "none";


    msg.innerHTML = `

        <p style="
            color:#ff7518;
            font-size:0.8rem;
            line-height:1.6;
        ">

            🎃 Sei già iscritto alla lista!

            <br>

            <span style="
                color:#777;
                font-size:0.7rem;
            ">

                Ci vediamo il 31 ottobre...

            </span>

        </p>

    `;

}