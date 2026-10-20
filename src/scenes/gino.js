const TERRA = 0xB96E54;
const VERDE = 0x72A11D;
const ROSSO = 0xE44A4A;
const MARRONE = 0x8B5A2B;

const TASTO_SALTO= PP.key_codes.SPACE;
const TASTO_SX= pp.key_codes.LEFT;
const TASTO_DESTRA= pp.key_codes.RIGHT;

const VEL_INIZIALE= 400;
const ACCELERAZIONE= 20;
const VEL_FUOCO = 600;
const VEL_SALTO= 1000;
const DISTANZA_MAX = 600;
const VEL_CORSA= 400;

const A_TERRENO = 96;
const Y_TERRENO = 624;

const X_GINO = 200;
const L_GINO = 81;
const A_GINO = 84;
const L_FUNGO = 90;
const A_FUNGO = 63;

const L_LIVELLO = 3840;
const ANTICIPO_CAMERA = 200;
const X_FUNGHI = {900, 1700, 1800, 2600, 3100}

const L_PIATTAFORMA = 192;
const A_PIATTAFORMA = 21;
const X_PIATTAFORMA = 1740;
const Y_PIATTAFORMA = 456;

let terreno;
let gino;
let funghi= [];
let piattaforma;

let vel_fungo= VEL_INIZIALE;
let parte_finita= false;


function preload(s) {
    img_sfondo= PP.assets.image.load(s,"assets/images/sfondo.png");
    img_gino= PP.assets.image.load(s,"assets/images/gino.png");
    img_fungo= PP.assets.image.load(s,"assets/images/fungo.png");
    img_fuoco= PP.assets.image.load(s,"assets/images/fuoco.png");
    img_terreno= PP.assets.image.load(s,"assets/images/terreno.png");
}

function create(s) {
    PP.assets.image.add(s, img_sfondo, 0, 0, 0, 0,);
    crea_terreno(s);
    crea_gino(s);
    crea_fungo(s);
    crea_piattaforma(s);
    crea_fine(s);
    crea_camera(s);
    crea_piattaforma(s);
}

function crea_piattaforma(s) {
    piattaforma = PP.shapes.rectangle_add(s, 
        X_PIATTAFORMA, Y_PIATTAFORMA,
        L_PIATTAFORMA, A_PIATTAFORMA, 
        MARRONE, 1
    );
    PP.physics.add(s, piattaforma, PP.physics.type.STATIC);
    PP.physics.add_collider(s, gino, piattaforma);
}

function crea_camera(s) {
    PP.physics.set_world_bounds (s, 0, 0, L_LIVELLO, ALTEZZA);
    PP.camera.set_bounds(s, 0, 0, L_LIVELLO, ALTEZZA);
    PP.camera.start_follow(s, gino, -ANTICIPO_CAMERA, 0);
}

function crea_terreno(s) {
    terreno= PP.shapes.rectangle_add(s, img_terreno,
        LARGHEZZA / 2, Y_TERRENO + A_TERRENO / 2, 
        L_LIVELLO, A_TERRENO, TERRA, 1
    );
    PP.physics.add(s, terreno, PP.physics.type.STATIC);
}

function crea_gino(s) {
        gino = PP.shapes.rectangle_add (s,img_gino,
        X_GINO,
        Y_TERRENO - A_GINO / 2, 
        0.5,
        0.5);
    PP.physics.add(s,gino, PP.physics.type.DYNAMIC);
    PP.physics.set_collide_world_bounds(gino,true); 
    PP.physics.add_collider(s,gino,terreno);
    PP.physics.set_collision_rectangle(gino, 51, 72, 15, 12);
}

function crea_funghi(s) {
    for (let i =0; i< X_FUNGHI.length; i++){
        let f= PP.shapes.rectangle_add (s,
        X_FUNGHI[i],
        Y_TERRENO - A_FUNGO / 2, 
        L_FUNGO, A_FUNGO, ROSSO, 1
    );
    PP.physics.add(s, fungo, PP.physics.type.DYNAMIC);
    PP.physics.set_allow_gravity(fungo, false);
    PP.physics.set_velocity_x(fungo,- VEL_FUNGO);
    PP.physics.add_overlap_f(s,gino,f,fine_partita);
    funghi.push(f);
}


function crea_fine(s) {
    testo_fine= PP.shapes.text_styled_add(s,
        LARGHEZZA/2,
        ALTEZZA/3,
        "GAME OVER",
        64,
        "Arial",
        "bold",
        NERO,
        null,
        0.5,
        0.5
    );
    testo_rigioca= PP.shapes.text_styled_add(s,
        LARGHEZZA/2,
        ALTEZZA/2,
        "RIGIOCA (SPAZIO)",
        40,
        "Arial",
        "bold",
        NERO,
        null,
        0.5,
        0.5
    );
    testo_rigioca.visibility.hidden= true;
    testo_fine.visibility.hidden= true;
}

function ricomincia(s) {
    if (PP.interactive.kb.is_key_just_down(s, TASTO_SALTO)) {
        partita_finita= false;
        vel_fungo= VEL_INIZIALE;
        resetta_fungo();
        testo_fine.visibility.hidden= true;
        testo_rigioca.visibility.hidden= true;
    }
}


function update(s) {
    if (parte_finita) {
        if (PP.interactive.kb.is_key_just_down(s, TASTO_SALTO))
            ricomincia(s)
        return;
    }
    salta(s);
    cammina(s);
}

function fine_partita(s, a, b) {
    partita_finita= true;
    PP.physics.set_velocity_x(b,0);
    PP.physics.set_velocity_x(a,0);
    testo_fine.visibility.hidden = false;
    testo_rigioca.visibility.hidden = false;
}
 
function salta(s) {
    if(PP.interactive.kb.is_key_just_down(s, TASTO_SALTO) &&
        PP.physics.is_on_ground(gino))
    {
        PP.physics.set_velocity_y(gino, -VEL_SALTO);
    }
}

function cammina(s) {
    if (PP.interactive.kb.is_key_down(s, TASTO_SX)) {
        PP.physics.set_velocity_x(gino, -VEL_CORSA);
    } else if (PP.interactive.kb.is_key_down(s, TASTO_DESTRA)) {
        PP.physics.set_velocity_x(gino, VEL_CORSA);
    } else {
        PP.physics.set_velocity_x(gino, 0);
    }
}

function controlla_fungo (){
    if (fungo.geometry.body_x<-L_FUNGO){
        vel_fungo+= ACCELERAZIONE;
        resetta_fungo();  
    }
}

function resetta_fungo(){
    fungo.geometry.body_x= LARGHEZZA + L_FUNGO/2 + DISTANZA_MAX * Math.random();
    PP.physics.set_velocity_x(fungo, -vel_fungo);
}



function destroy(s) {}

PP.scenes.add("gino", preload, create, update, destroy);