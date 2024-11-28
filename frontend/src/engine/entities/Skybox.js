import * as THREE from 'three';

export class Skybox{

	constructor(texture){
		this.texture = texture;
		this.renderMesh;
		this.loadedTexture=null;
	}

	async init(engine){

		this.loadedTexture = await engine.resourceManager.loadTexture(this.texture);

		// create inside out sphere

		this.renderMesh= new THREE.Mesh(
			new THREE.SphereGeometry(500, 60, 40),
			new THREE.MeshBasicMaterial({
				map: this.loadedTexture,
				side: THREE.BackSide
			})
		);







	}

	addToScene(scene){
		scene.threeScene.add(this.renderMesh);
	}



}
