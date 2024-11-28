// import required THREE.js modules
import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

export class Scene {
	constructor(parentNode,skyboxtextures) {
		this.entities = [];
		this.camera
	}


	init(engine) {
		// create new Three.js scene
		this.threeScene = new THREE.Scene();


		// register callbacks
		engine.registerCallback("onRender", this.onRender.bind(this));
		engine.registerCallback("onLoad", this.onLoad.bind(this));
		this.engine = engine;

	}

	async onLoad() {
		let proms=[];
		// add entities to scene
		this.entities.forEach(entity => {
			let prom=async ()=>{
				await entity.init(this.engine);
				entity.addToScene(this);
			}

			proms.push(prom());
		});

		await Promise.all(proms);

	}

	onRender() {
	}


	getRenderingCamera() {
		return this.camera.threeCamera;
	}

	addEntity(entity) {
		this.entities.push(entity);
	}

	setCamera(camera) {
		this.camera = camera;
	}

}
