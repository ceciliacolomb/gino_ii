const NERO = "0x000000";
const TASTO_ GIOCA = PP.key_codes.SPACE;

function preload(s) {}

function create (s) {}

function mostra_messaggio (s) {
    PP.shapes.test_styled_add (s,
        LARGHEZZA/2, ALTEZZA / 3,
        "GAME OVER",
        64, "Arial", "bold; NERO, null, 0.5, 0.5

    );
}

function update (s) {
    if (PP.interactive.is_key_just_down (s, TASTO_GIOCA)) {
        PP.scenes.start("gino")
    }
}      

function destroy (s) {}

PP.scenes.add. ("fine", preload, create, update, destroy)

