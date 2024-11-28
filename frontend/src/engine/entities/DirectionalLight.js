
import {Entity} from './Entity.js';
import * as THREE from 'three';

export class DirectionalLight extends Entity{
	constructor(pos,color,direction, intensity){
		super();
		this.position = pos;
		this.color = color;
		this.direction = direction;
		this.intensity = intensity;
		this.threeLight = null;

	}

	init(engine){
		this.threeLight = new THREE.DirectionalLight(this.color,this.intensity);
		this.threeLight.position.set(this.position.x,this.position.y,this.position.z);
		this.threeLight.target.position.set(this.direction.x,this.direction.y,this.direction.z);
		this.threeLight.castShadow = true;
		//Set up shadow properties for the light
		this.threeLight.shadow.mapSize.width = 2048; // default
		this.threeLight.shadow.mapSize.height = 2048; // default
		this.threeLight.shadow.camera.near = 0.5; // default
		this.threeLight.shadow.camera.far = 500; // default

		let d = 30;
		this.threeLight.shadow.camera.left = -d;
		this.threeLight.shadow.camera.right = d;
		this.threeLight.shadow.camera.top = d;
		this.threeLight.shadow.camera.bottom = -d;

		//helper
		this.helper = new THREE.DirectionalLightHelper( this.threeLight, 5 );

	}


	addToScene(scene){

		scene.threeScene.add(this.threeLight);

	}

}
