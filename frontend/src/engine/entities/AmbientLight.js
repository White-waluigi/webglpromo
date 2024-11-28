import { Entity } from './Entity.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import {MTLLoader} from 'three/addons/loaders/MTLLoader.js';
import * as THREE from 'three';

export class AmbientLight extends Entity {


	constructor(color, intensity) {
		super();
		this.color = color;
		this.intensity = intensity;
	}

	init(engine) {
		this.threeObject = new THREE.AmbientLight(this.color, this.intensity);
	}

	addToScene(scene) {

		/*
		new MTLLoader()
			.setPath( 'models/male02/' )
			.load( 'male02.mtl', function ( materials ) {

				materials.preload();

				new OBJLoader()
					.setMaterials( materials )
					.setPath( 'models/male02/' )
					.load( 'male02.obj', function ( object ) {

						object.position.y = - 0.95;
						object.scale.setScalar( 1 );
						scene.threeScene.add( object );

					} );

			} );
			*/

		async function loadMan(){

		}
		loadMan()
		scene.threeScene.add(this.threeObject);
	}



}
