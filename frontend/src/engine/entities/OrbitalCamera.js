//import Threejs
import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
// OrbitControls
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// import Stats
import Stats from 'three/examples/jsm/libs/stats.module'
// import dat.GUI
import { GUI } from 'dat.gui'


import {Entity} from "./Entity.js"

export class OrbitalCamera extends Entity {


	constructor(){
		super();
		this.threeCamera=null
		this.controls=null

	}

	init(engine){

		this.threeCamera= new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.2, 2000 );



		this.threeCamera.position.x = 20.93347151795136;
		this.threeCamera.position.y = 7.71749841110396;
		this.threeCamera.position.z = 3.796801574737623;

		this.threeCamera.rotation.x = -1.5810903135786416;
		this.threeCamera.rotation.y = 1.351039128979933;
		this.threeCamera.rotation.z = 1.5813439617643126;

		//this.controls = new OrbitControls( this.threeCamera, engine.renderer.domElement );
		//this.controls.target.y = 2;


		this.engine=engine
		this.engine.registerCallback("onResize", this.onResize.bind(this));
		this.engine.registerCallback("onUpdate", this.onUpdate.bind(this));
		//initial position and rotation
		/*
		 *
		 * Camera Position:  
Object { x: 20.93347151795136, y: 7.31749841110396, z: 3.796801574737623 }
OrbitalCamera.js:67:10
Camera Rotation:  
Object { isEuler: true, _x: -1.5810903135786416, _y: 1.351039128979933, _z: 1.5813439617643126
		 *
		 *
		 * */



		

	}
	onResize(){
		this.threeCamera.aspect = window.innerWidth / window.innerHeight;
		this.threeCamera.updateProjectionMatrix();
	}

	onUpdate(frame){
		//this.controls.update(frame.clockDelta);
	}


}
