import * as THREE from 'three';
import { RigidBody } from './RigidBody.js';

export class BallShooter{
	constructor(camera){

		this.balls=[]
		this.currentBallId=0
		this.camera=camera
		this.raycaster = new THREE.Raycaster();
	}


	async init(engine){

		// add 10 balls
		for(let i=0;i<10;i++){
			let ball = new RigidBody("sphere", {visible:false,radius: 0.5,texture:{file:"models/textures/rabatt.png",scalex:2,scaley:2}}, new THREE.Vector3(0,-999,0),false,{speed: new THREE.Vector3(-30,0,0),mass:3,angularSpeed:new THREE.Vector3(0,0,10)});
			this.balls.push(ball)
		}

		engine.registerCallback("onUpdate", this.onUpdate.bind(this));

		for(let ball of this.balls){
			await ball.init(engine);
		}

	}

	addToScene(scene) {
		for(let ball of this.balls){
			ball.addToScene(scene)
		}
	}

	onUpdate(frame){

		if(frame.inputMap.mouseClick){
			//spawn a ball towards the bricks
			//get camera position
			//

			let mc=frame.inputMap.mouseCoords
			this.raycaster.setFromCamera(new THREE.Vector2(mc[0],mc[1]), this.camera.threeCamera);

			let cameraPosition = this.camera.threeCamera.position.clone();
			let cameraDirection = this.camera.threeCamera.getWorldDirection(new THREE.Vector3());

			let raypos=this.raycaster.ray.direction.clone()
			raypos.add(this.raycaster.ray.origin)



			let ball = this.balls[this.currentBallId];
			ball.setPosition(raypos);
			ball.setVelocity(this.raycaster.ray.direction.clone().multiplyScalar(30));
			ball.setAngularVelocity(new THREE.Vector3(Math.random()*3-1.5,0,10));
			ball.setVisible(true);


			this.currentBallId++;
			this.currentBallId = this.currentBallId % this.balls.length;
		}


	}
}
