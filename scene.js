// Noise / Fractal Brownian Motion
const X_OFFSET = 0;
const Y_OFFSET = 0;
const Z_OFFSET = 0;
const X_SCALE = 0.0001;
const Y_SCALE = 0.001;
const Z_SCALE = 0.1;
const OCTAVES = 8;
const PERSISTENCE = 3;

// World
// WARNING: the bigger the world size, the more objects will be generated on load.
const WORLD_SIZE = 24;
const GEOMETRY_SIZE = 0.025;      
const SCENE_BG_COLOR = new THREE.Color( 0x021121 );
const GEOMETRY_COLOR = new THREE.Color( 0x2e6ec9 );
const FOG_DENSITY = 0.08;

// Camera
const FOV = 100; 

// Controls
const MOUSE_SENSITIVITY = 0.002;
const VELOCITY_INCREMENTAL = 0.001;
const KEY_UP = 38; 
const KEY_DOWN = 40;
const KEY_W = 87;
const KEY_S = 83;

let noise = new Noise();
let camera, velocity = 0, scene, renderer, positions = [], geometries = [];

let width = window.innerWidth;
let height = window.innerHeight;
let windowHalf = new THREE.Vector2( width / 2, height / 2 );

let lookDirection = new THREE.Vector3;
let mouse = new THREE.Vector2;
let target = new THREE.Vector2;

setup();
animate();

function setup() {
    setRenderer();
    setScene();
    setCamera();
    addLights();
    generatePositions();
    createGeometries();
    setGeometryPositions();
    addEventListeners();
}

function setRenderer() {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize( width, height );
    document.body.appendChild( renderer.domElement );
}

function setScene() {
    scene = new THREE.Scene();         
    scene.background = SCENE_BG_COLOR;
    scene.fog = new THREE.FogExp2( SCENE_BG_COLOR, FOG_DENSITY );
}

function setCamera() {
    camera = new THREE.PerspectiveCamera( FOV, width/height, 0.01, 10000 );
    camera.updateProjectionMatrix();

    camera.position.z = WORLD_SIZE - WORLD_SIZE / 2;
}

function addLights() {
    let ambientLight = new THREE.AmbientLight( 0xfefefe );
    scene.add( ambientLight );

    let pointLightOne = new THREE.PointLight( 0xfefefe, 1);
    pointLightOne.position.y = WORLD_SIZE + 2;
    scene.add( pointLightOne );

    let pointLightTwo= new THREE.PointLight( 0xfefefe, 0.8);
    pointLightTwo.position.z = -WORLD_SIZE - 2;
    scene.add( pointLightTwo );

    let pointLightThree= new THREE.PointLight( 0xfefefe, 0.7);
    pointLightThree.position.y = WORLD_SIZE - 2;
    scene.add( pointLightThree );
}

function generatePositions(offset = 0) {
    positions = noise.CreateFBMCube( WORLD_SIZE, X_OFFSET + offset, Y_OFFSET + offset, Z_OFFSET + offset, X_SCALE, Y_SCALE, Z_SCALE, OCTAVES, PERSISTENCE );
}

function setGeometryPositions() {
    for( let i = 0; i < geometries.length; i++) {
        geometries[i].position.set( positions[ i ].x * WORLD_SIZE, positions[ i ].y * WORLD_SIZE, positions[ i ].z * WORLD_SIZE );
    }
}

function createGeometries() {

    let material = new THREE.MeshPhongMaterial({
        color: new THREE.Color( GEOMETRY_COLOR ),
        shininess:  10,
        flatShading:  true,
      });

    for( let i = 0; i < positions.length; i++ ) {
        let geometry = new THREE.Mesh( new THREE.IcosahedronGeometry( GEOMETRY_SIZE, 1 ), material );

        geometries.push( geometry );
        scene.add( geometry );
    }
}

function addEventListeners() {
    document.addEventListener( 'mousemove', onMouseMove, false );
    document.addEventListener( 'keydown', onKeyDown, false );
    window.addEventListener( 'resize', onResize, false );
}

function onMouseMove( event ) {
    mouse.x = ( event.clientX - windowHalf.x );
    mouse.y = ( event.clientY - windowHalf.y );
}

function onKeyDown( event ) {
    if( event.keyCode == KEY_UP || event.keyCode == KEY_W )
        velocity -= VELOCITY_INCREMENTAL;

    if( event.keyCode == KEY_DOWN || event.keyCode == KEY_S )
        velocity += VELOCITY_INCREMENTAL;    
}

function onResize() {
    width = window.innerWidth;
    height = window.innerHeight;
    windowHalf.set( width / 2, height / 2 );

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize( width, height );
}

function animate() {
    moveCamera();

    for( let i = 0; i < geometries.length; i++ ) {
        geometries[i].rotation.x += ( Math.random() * ( 3 - 1 ) + 1 ) / 100;
        geometries[i].rotation.y += ( Math.random() * ( 3 - 1 ) + 1 ) / 100;
    }

    renderer.render( scene, camera );
    requestAnimationFrame( animate );        
}

function moveCamera() {
    target.x = ( 1 - mouse.x ) * MOUSE_SENSITIVITY;
    target.y = ( 1 - mouse.y ) * MOUSE_SENSITIVITY;

    camera.rotation.x += MOUSE_SENSITIVITY * ( target.y - camera.rotation.x );
    camera.rotation.y += MOUSE_SENSITIVITY * ( target.x - camera.rotation.y );
    camera.getWorldDirection( lookDirection );
    camera.position.x -= lookDirection.x * velocity;
    camera.position.y -= lookDirection.y * velocity;
    camera.position.z -= lookDirection.z * velocity;
}