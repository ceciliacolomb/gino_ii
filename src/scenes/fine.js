const NERO = "0x000000";
const TASTO_GIOCA = PP.key_codes.SPACE;

function preload(s) {}

function create(s) {
  mostra_messaggio(s);
  mostra_rigioca(s);
}

function mostra_messaggio(s) {
  let messaggio = PP.game_state.get_variable("messaggio");
  PP.shapes.text_styled_add(s,
    LARGHEZZA / 2, ALTEZZA / 3, messaggio,
    64, "Arial", "bold", NERO, null, 0.5, 0.5);
}

function mostra_rigioca(s) {
  PP.shapes.text_styled_add(s,
    LARGHEZZA / 2, ALTEZZA / 2, "RIGIOCA (SPAZIO)",
    40, "Arial", "bold", NERO, null, 0.5, 0.5);
}

function update(s) {
  if (PP.interactive.kb.is_key_just_down(s, TASTO_GIOCA)) {
    PP.scenes.start("gino");
  }
}

function destroy(s) {}

PP.scenes.add("fine", preload, create, update, destroy);