//import Threejs
import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
// OrbitControls
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// import Stats
import Stats from 'three/examples/jsm/libs/stats.module'
// import dat.GUI
import { GUI } from 'dat.gui'
import {ResourceManager} from "./ResourceManager.js"

import Ammo from 'ammojs-typed'

// import required THREE.js modules
export class Engine {

	constructor(parentNode) {
		this.parentNode = parentNode;
		this.renderer=null;
		this.textureLoader=null;
		this.stats=null;
		this.stopped=false;

		this.callbacks = {
			"onInput":[],
			"onResize":[],
			"onRender":[],
			"onUpdate":[],
			"onLoad":[],
			"onShutdown":[]
		};

		this.ammo={
			gravityConstant:-9.807,
			collisionConfiguration:null,
			dispatcher:null,
			broadphase:null,
			solver:null,
			softBodySolver:null,
			pyhsicsWorld:null,
			ammo:null,
			defaultMargin:0.05

		};

	}

	async init(scene) {
		// init graphics



		this.renderer = new THREE.WebGLRenderer({antialias: true});
		// Purple Clear Color
		this.renderer.setClearColor(/*this is purple*/0x800080);



		//on resize
		window.addEventListener('resize', this.resize.bind(this));
		this.resize();

		//add to DOM
		this.parentNode.appendChild(this.renderer.domElement);
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

		this.textureLoader = new THREE.TextureLoader();


		//add stats
		this.stats = new Stats();
		this.stats.domElement.style.position = 'absolute';
		this.stats.domElement.style.top = '0px';
		this.parentNode.appendChild(this.stats.domElement);

		/*
			// add input handler
		document.addEventListener('keydown', (event) => {
			let bound= this.onInput.bind(this);
			bound(event);
		});
		document.addEventListener('keyup', (event) => {
			let bound= this.onInput.bind(this);
			bound(event);
		});margin
		document.addEventListener('mousedown', (event) => {
			let bound= this.onInput.bind(this);
			bound(event);
		});
		document.addEventListener('mouseup', (event) => {
			let bound= this.onInput.bind(this);
			bound(event);
		});
		*/

		//init ammo


		this.ammo.ammo=await Ammo.bind(window)();

		/*
						collisionConfiguration = new Ammo.btSoftBodyRigidBodyCollisionConfiguration();
				dispatcher = new Ammo.btCollisionDispatcher( collisionConfiguration );
				broadphase = new Ammo.btDbvtBroadphase();
				solver = new Ammo.btSequentialImpulseConstraintSolver();
				softBodySolver = new Ammo.btDefaultSoftBodySolver();
				physicsWorld = new Ammo.btSoftRigidDynamicsWorld( dispatcher, broadphase, solver, collisionConfiguration, softBodySolver);
				physicsWorld.setGravity( new Ammo.btVector3( 0, gravityConstant, 0 ) );
				physicsWorld.getWorldInfo().set_m_gravity( new Ammo.btVector3( 0, gravityConstant, 0 ) );
				*/

		this.ammo.collisionConfiguration = new this.ammo.ammo.btDefaultCollisionConfiguration();
		this.ammo.dispatcher = new this.ammo.ammo.btCollisionDispatcher(this.ammo.collisionConfiguration);
		this.ammo.broadphase = new this.ammo.ammo.btDbvtBroadphase();
		this.ammo.solver = new this.ammo.ammo.btSequentialImpulseConstraintSolver();
		this.ammo.physicsWorld = new this.ammo.ammo.btDiscreteDynamicsWorld(this.ammo.dispatcher, this.ammo.broadphase, this.ammo.solver, this.ammo.collisionConfiguration);
		this.ammo.physicsWorld.setGravity(new this.ammo.ammo.btVector3(0, this.ammo.gravityConstant, 0));


		this.resourceManager=new ResourceManager(this.textureLoader);

		// initialize scene

		this.scene = scene;
		this.scene.init(this)
		await this.load()

		this.inputMap={
			mouseClick:false,
			mousePos:[0,0]
		}

		this.parentNode.addEventListener("click",this.onInput.bind(this));

	}

	async load(){
		await this.emitCallbackAsync("onLoad", null);
	}



	registerCallback(name, callback) {
		if(name in this.callbacks) {
			this.callbacks[name].push(callback);
		}else {
			throw new Error("Invalid Callback Name");
		}
	}

	emitCallback(name, args) {


		if(name in this.callbacks) {
			for(let c of this.callbacks[name]) {
				c(args);
			}
		}else {
			throw new Error("Invalid Callback Name");
		}
	}

	async emitCallbackAsync(name, args) {
		if(name in this.callbacks) {
			await Promise.all(this.callbacks[name].map(async (c) => {
				await c(args);
			}));

		}else {
			throw new Error("Invalid Callback Name");
		}
	}


	//processing inputs




	onInput(eve) {


		this.inputMap={
			mouseClick:true,
			mouseCoords:[
				( event.clientX / window.innerWidth ) * 2 - 1,
				- ( event.clientY / window.innerHeight ) * 2 + 1
			]
		}



		/* controls Map 
		 * WASD => Forward, Left, Backward, Right
		 * Tap/Click => TAP DOWN/ TAP UP
		 * RMB => RMB DOWN/ LMB UP
		 *
		 * */

		/*
		const inputs={
			forward: false,
			left: false,
			backward: false,
			right: false,
			tap: false,
			lmb: false
		};

		let map={
			"w": "forward",
			"a": "left",
			"s": "backward",
			"d": "right",
		};

		if(eve.type === "keydown" || eve.type === "keyup") {
			if(eve.key in map) {
				inputs[map[eve.key]] = (eve.type === "keydown");
			}
		}else if(eve.type === "mousedown" || eve.type === "mouseup") {
			if(eve.button === 0) {
				inputs["tap"] = (eve.type === "mousedown");
			}else if(eve.button === 2) {
				inputs["lmb"] = (eve.type === "mousedown");
			}
		}

		this.emitCallback("onInput", inputs);
		*/

	}

	loop(time){
		let delta = time - this.lastTime;
		this.lastTime = time;

		let frame ={
			time: time,
			delta: delta,
			numFrames: this.numFrames++,
			clockDelta:this.clock.getDelta(),
			inputMap:this.inputMap
		};

		this.stats.update();


		this.updatePhysics(frame.clockDelta);

		this.emitCallback("onUpdate", frame);
		this.emitCallback("onRender", frame);
		this.renderer.render(this.scene.threeScene, this.scene.getRenderingCamera());

		/*
			this.inputMap={
				mouseClick:false,
				mousePos:[0,0]
			}
			*/

		this.inputMap={
			mouseClick:false,
			mouseCoords:[0,0]
		}

		if(!this.stopped)
			requestAnimationFrame(this.loop.bind(this));
	}


	// rendering and logic loop
	startLoop() {
		this.lastTime = 0;
		this.clock=new THREE.Clock();
		this.numFrames = 0;
		requestAnimationFrame(this.loop.bind(this));
	}

	updatePhysics(deltaTime) {
		this.ammo.physicsWorld.stepSimulation( deltaTime, 140 );
	}

	//resize
	resize() {
		this.renderer.setSize(window.innerWidth, window.innerHeight);

		this.emitCallback("onResize", {width: window.innerWidth, height: window.innerHeight});
	}


	destroy() {
		this.stopLoop();
		//remove event listeners
		window.removeEventListener('resize', this.resize.bind(this));
		document.removeEventListener('keydown', this.onInput.bind(this));
		document.removeEventListener('keyup', this.onInput.bind(this));
		document.removeEventListener('mousedown', this.onInput.bind(this));
		document.removeEventListener('mouseup', this.onInput.bind(this));
		this.parentNode.removeChild(this.renderer.domElement);

	}

	stopLoop(){

		this.emitCallback("onShutdown", null);
		this.stopped=true;
		this.renderer.dispose();

	}



}
