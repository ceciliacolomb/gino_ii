const L_LIVELLO = 3840;
const A_TERRENO = 96;
const Y_TERRENO = 624;
const X_GINO = 200;
const L_GINO = 81;
const A_GINO = 84;
const L_FUNGO = 90;
const A_FUNGO = 63;
const X_FUNGHI = [900, 1700, 1800, 2600, 3100];
const X_PIATTAFORMA = 1740;
const Y_PIATTAFORMA = 456;
const A_BANDIERA = 138;
const X_BANDIERA = L_LIVELLO - 100;

const VEL_SALTO = 1000;
const VEL_FUNGO = 100;
const VEL_CORSA = 400;
const ANTICIPO_CAMERA = 200;
const PARALLAX_NUVOLE = 0.2;
const PARALLAX_COLLINE = 0.4;
const PARALLAX_CESPUGLI = 0.7;

const TASTO_SX = PP.key_codes.LEFT;
const TASTO_DX = PP.key_codes.RIGHT;
const TASTO_SALTO = PP.key_codes.SPACE;

let img_nuvole;
let img_colline;
let img_cespugli;
let img_terreno;
let img_piattaforma;
let img_bandiera;
let ss_gino;
let ss_fungo;

let nuvole;
let colline;
let cespugli;
let terreno;
let gino;
let funghi;

let partita_finita;
let animazione;

function preload(s) {
  img_nuvole = PP.assets.image.load(s,
    "assets/images/nuvole.png");
  img_colline = PP.assets.image.load(s,
    "assets/images/colline.png");
  img_cespugli = PP.assets.image.load(s,
    "assets/images/cespugli.png");
  img_terreno = PP.assets.image.load(s,
    "assets/images/terreno.png");
  img_piattaforma = PP.assets.image.load(s,
    "assets/images/piattaforma.png");
  img_bandiera = PP.assets.image.load(s,
    "assets/images/bandiera.png");
  ss_gino = PP.assets.sprite.load_spritesheet(s,
    "assets/images/gino_spritesheet.png",
    L_GINO, A_GINO);
  ss_fungo = PP.assets.sprite.load_spritesheet(s,
    "assets/images/fungo_spritesheet.png",
    L_FUNGO, A_FUNGO);
}

function create(s) {
  partita_finita = false;
  animazione = "";
  funghi = [];
  crea_sfondo(s);
  crea_terreno(s);
  crea_gino(s);
  crea_funghi(s);
  crea_piattaforma(s);
  crea_bandiera(s);
  crea_camera(s);
}

function crea_sfondo(s) {
  nuvole = crea_layer(s, img_nuvole);
  colline = crea_layer(s, img_colline);
  cespugli = crea_layer(s, img_cespugli);
}

function crea_layer(s, img) {
  let layer = PP.assets.tilesprite.add(s, img,
    0, 0, LARGHEZZA, ALTEZZA, 0, 0);
  layer.tile_geometry.scroll_factor_x = 0;
  return layer;
}

function crea_terreno(s) {
  terreno = PP.assets.tilesprite.add(s, img_terreno,
    0, Y_TERRENO, L_LIVELLO, A_TERRENO, 0, 0);
  PP.physics.add(s, terreno, PP.physics.type.STATIC);
}

function crea_gino(s) {
  gino = PP.assets.sprite.add(s, ss_gino,
    X_GINO, Y_TERRENO - A_GINO / 2, 0.5, 0.5);
  PP.physics.add(s, gino, PP.physics.type.DYNAMIC);
  PP.physics.set_collide_world_bounds(gino, true);
  PP.physics.add_collider(s, gino, terreno);
  PP.physics.set_collision_rectangle(gino, 51, 72, 15, 12);
  PP.assets.sprite.animation_add(gino, "fermo",
    0, 0, 1, 0);
  PP.assets.sprite.animation_add(gino, "corsa",
    1, 12, 20, -1);
  PP.assets.sprite.animation_add(gino, "salto",
    13, 13, 1, 0);
}

function crea_funghi(s) {
  for (let i = 0; i < X_FUNGHI.length; i++) {
    let f = PP.assets.sprite.add(s, ss_fungo,
      X_FUNGHI[i], Y_TERRENO - A_FUNGO / 2, 0.5, 0.5);
    PP.physics.add(s, f, PP.physics.type.DYNAMIC);
    PP.physics.set_allow_gravity(f, false);
    PP.physics.set_velocity_x(f, -VEL_FUNGO);
    PP.physics.add_overlap_f(s, gino, f, fine_partita);
    PP.assets.sprite.animation_add(f, "cammina",
      0, 15, 20, -1);
    PP.assets.sprite.animation_play(f, "cammina");
    funghi.push(f);
  }
}

function crea_piattaforma(s) {
  let piattaforma = PP.assets.image.add(s, img_piattaforma,
    X_PIATTAFORMA, Y_PIATTAFORMA, 0.5, 0.5);
  PP.physics.add(s, piattaforma, PP.physics.type.STATIC);
  PP.physics.add_collider(s, gino, piattaforma);
}

function crea_bandiera(s) {
  let bandiera = PP.assets.image.add(s, img_bandiera,
    X_BANDIERA, Y_TERRENO - A_BANDIERA / 2, 0.5, 0.5);
  PP.physics.add(s, bandiera, PP.physics.type.STATIC);
  PP.physics.add_overlap_f(s, gino, bandiera, vittoria);
}

function crea_camera(s) {
  PP.physics.set_world_bounds(s, 0, 0, L_LIVELLO, ALTEZZA);
  PP.camera.set_bounds(s, 0, 0, L_LIVELLO, ALTEZZA);
  PP.camera.start_follow(s, gino, -ANTICIPO_CAMERA, 0);
}

function update(s) {
  if (partita_finita) {
    return;
  }
  cammina(s);
  salta(s);
  anima_gino();
  muovi_sfondo(s);
}

function cammina(s) {
  if (PP.interactive.kb.is_key_down(s, TASTO_SX)) {
    PP.physics.set_velocity_x(gino, -VEL_CORSA);
    gino.geometry.flip_x = true;
  } else if (PP.interactive.kb.is_key_down(s, TASTO_DX)) {
    PP.physics.set_velocity_x(gino, VEL_CORSA);
    gino.geometry.flip_x = false;
  } else {
    PP.physics.set_velocity_x(gino, 0);
  }
}

function salta(s) {
  if (PP.interactive.kb.is_key_just_down(s, TASTO_SALTO)
      && PP.physics.is_on_ground(gino)) {
    PP.physics.set_velocity_y(gino, -VEL_SALTO);
  }
}

function fine_partita(s, a, b) {
  termina("GAME OVER");
}

function vittoria(s, a, b) {
  termina("LIVELLO COMPLETATO");
}

function termina(messaggio) {
  if (partita_finita) {
    return;
  }
  partita_finita = true;
  PP.game_state.set_variable("messaggio", messaggio);
  PP.scenes.start("fine");
}

function anima_gino() {
  let nuova = "fermo";
  if (!PP.physics.is_on_ground(gino)) {
    nuova = "salto";
  } else if (PP.physics.get_velocity_x(gino) !== 0) {
    nuova = "corsa";
  }
  if (nuova !== animazione) {
    animazione = nuova;
    PP.assets.sprite.animation_play(gino, animazione);
  }
}

function muovi_sfondo(s) {
  let x = PP.camera.get_scroll_x(s);
  nuvole.tile_geometry.x = x * PARALLAX_NUVOLE;
  colline.tile_geometry.x = x * PARALLAX_COLLINE;
  cespugli.tile_geometry.x = x * PARALLAX_CESPUGLI;
}

function destroy(s) {}

PP.scenes.add("gino", preload, create, update, destroy);