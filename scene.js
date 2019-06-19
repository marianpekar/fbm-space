// Noise / Fractal Brownian Motion
let options = {
    x_offset: 0,
    y_offset: 0,
    z_offset: 0,
    x_scale: 0.0001,
    y_scale: 0.0001,
    z_scale: 0.01,
    octaves: 8,
    persistence: 3,
    freeze: false,
    resetCamera: function() {
        moveCameraToInitialPosition();
        velocity = 0;
    },
    lockCamera: false,
    offset_increment_scale: 1 //change the speed of animation
}

// Animation
const ANIMATE = true;
const ANIMATION_SPEED = 60 // Frames Per Second;
const OFFSET_INCREMENT = 0.0004;

// World
// WARNING: the bigger the world size, the more objects will be generated on load.
const WORLD_SIZE = 22;
const GEOMETRY_SIZE = 0.03;
const ROTATE_GEOMETRIES = true;      
const SCENE_BG_COLOR = new THREE.Color( 0x021121 );
const GEOMETRY_COLOR = new THREE.Color( 0x2e6ec9 );
const FOG_DENSITY = 0.09;

// Camera
const FOV = 100;

// Controls
const ENABLE_CONTROLS = true;
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

    if(ANIMATE)
        startUpdatingPositions();
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

    moveCameraToInitialPosition();
}

function moveCameraToInitialPosition() {
    camera.position.z = WORLD_SIZE - WORLD_SIZE / 2;
    camera.rotation.x = camera.rotation.y = camera.rotation.z = 0;
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
    positions = noise.CreateFBMCube( WORLD_SIZE, 
                                     options.x_offset + offset, options.y_offset + offset, options.z_offset + offset, 
                                     options.x_scale, options.y_scale, options.z_scale, options.octaves, options.persistence );
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
    if(options.lockCamera)
        return;

    mouse.x = ( event.clientX - windowHalf.x );
    mouse.y = ( event.clientY - windowHalf.y );
}

function onKeyDown( event ) {
    if(options.lockCamera) 
        return;

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
    if(!options.lockCamera)
        moveCamera();

    if(!options.freeze)
        rotateGeometries();

    renderer.render( scene, camera );
    requestAnimationFrame( animate );        
}

function rotateGeometries() {
    for( let i = 0; i < geometries.length; i++ ) {
        geometries[i].rotation.x += ( Math.random() * ( 3 - 1 ) + 1 ) / 100;
        geometries[i].rotation.y += ( Math.random() * ( 3 - 1 ) + 1 ) / 100;
    }
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

function startUpdatingPositions() {
    let i = 0;
    window.setInterval( function() {
        setGeometryPositions();
        generatePositions( i );

        if(!options.freeze) {
            i += OFFSET_INCREMENT * options.offset_increment_scale;
        }
    }, 1000 / ANIMATION_SPEED );
}