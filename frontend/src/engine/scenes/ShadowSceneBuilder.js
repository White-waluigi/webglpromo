import {Scene} from "../Scene.js";
import {OrbitalCamera} from "../entities/OrbitalCamera.js";
import {RigidBody} from "../entities/RigidBody.js";
import {AmbientLight} from "../entities/AmbientLight.js";
import {DirectionalLight} from "../entities/DirectionalLight.js";
import {ShadowTest} from "../entities/ShadowTest.js";
import * as THREE from "three";

export class ShadowSceneBuilder{


	constructor(){

	}


	buildScene(engine){
		
		let scene = new Scene();

		let camera = new OrbitalCamera();
		scene.addEntity(camera);


		let shadowTest = new ShadowTest();
		scene.addEntity(shadowTest);


		scene.setCamera(camera);

		return scene;
	}





}

