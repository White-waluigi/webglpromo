import * as THREE from 'three';
import { Entity } from './Entity.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
export class RigidBody extends Entity {


	constructor (shape,params,position=new THREE.Vector3(0,0,0),stationary=false,{visible=true,speed=new THREE.Vector3(0,0,0),restitution=0.5,friction=1.8,mass=null,angularSpeed}={}) {

		super();
		this.renderMeshes=[];
		this.shapes=["box","sphere","cylinder"];

		if(this.shapes.indexOf(shape) == -1) {
			throw new Error("Invalid shape: " + shape);
		}
		this.shape = shape;
		this.params = params;
		this.stationary = stationary;
		this.ammoBody = null;

		this.position = position;

		this.engine=null;

		this.color=null;
		this.speed = speed;

		//rotational speed
		this.angularSpeed = angularSpeed??new THREE.Vector3(0,0,0);
		this.restitution = restitution;
		this.friction = friction;
		this.mass = mass;

		this.transformBuffer=null;

		this.mesh=null;
		if(params.mesh){
			this.mesh = params.mesh;
		}

		if(params.texture){
			this.texture = params.texture;
		}



		this.offsetTranslate = new THREE.Vector3(0,0,0);
		this.offsScale = new THREE.Vector3(1,1,1);

		this.visible=visible;

		this.debugMesh=null;
		this.am= null;
	}

	async init(engine) {
		this.engine=engine;

		engine.registerCallback("onUpdate", this.onUpdate.bind(this));


		this.color = Math.pow(Math.random(),1.22) * 0xffffff;
		//create the render mesh
		//

		if(this.mesh){
			let file= this.mesh.file;
			let rm=await this.engine.resourceManager.loadObj(file,this.mesh.mtlFile)
			rm={renderMesh:rm,offsetTranslate: new THREE.Vector3(0,0,0)}
			//adjust the scale and translate the object
			let bbox = new THREE.Box3().setFromObject(rm.renderMesh)
			let size={x:bbox.max.x-bbox.min.x,y:bbox.max.y-bbox.min.y,z:bbox.max.z-bbox.min.z};

			//this.offsetScale = new THREE.Vector3(this.params.width/size.x,this.params.height/size.y,this.params.depth/size.z);
			//rm.offsetTranslate=new THREE.Vector3(bbox.max.x - size.x/2,bbox.max.y - size.y/2,bbox.max.z - size.z/2);
			//this.renderMesh.scale.copy(this.offsetScale);

			//outline debug mesh

			if(this.shape == "box") {
				this.params={width:size.x,height:size.y,depth:size.z};
			}
			else if(this.shape == "sphere") {
				this.params={radius:size.x/2};
			}
			else if(this.shape == "cylinder") {
				this.params={radius:size.x/2,height:size.y};
			}
			this.renderMeshes.push(rm)

		}
		if(this.shape == "box") {

			let {width, height, depth} = this.params;

			//random color


			let rm = new THREE.Mesh(new THREE.BoxGeometry(width,height,depth), new THREE.MeshBasicMaterial({color: this.color,wireframe:this.mesh!=null}));
			this.renderMeshes.push({renderMesh:rm,offsetTranslate: new THREE.Vector3(0,0,0)})




		}
		else if(this.shape == "sphere") {
			let {radius} = this.params;
			let rm= new THREE.Mesh(new THREE.SphereGeometry(radius,32,32), new THREE.MeshBasicMaterial({color: this.color,wireframe:this.mesh!=null}));
			this.renderMeshes.push({renderMesh:rm,offsetTranslate: new THREE.Vector3(0,0,0)})
		}
		else if(this.shape == "cylinder") {
			let {radius, height} = this.params;
			let rm= new THREE.Mesh(new THREE.CylinderGeometry(radius,radius,height,32), new THREE.MeshBasicMaterial({color: this.color,wireframe:this.mesh!=null}));
			this.renderMeshes.push({renderMesh:rm,offsetTranslate: new THREE.Vector3(0,0,0)})
		}

		this.renderMeshes=[this.renderMeshes[0]];


		if(this.texture && !this.mesh){
			let texture = await engine.resourceManager.loadTexture(this.texture.file);
			texture.wrapS = THREE.RepeatWrapping;
			texture.wrapT = THREE.RepeatWrapping;
			texture.repeat.set(this.texture.scalex,this.texture.scaley);
			for(let rm of this.renderMeshes){
				rm.renderMesh.material = new THREE.MeshPhongMaterial({map:texture});
				rm.renderMesh.castShadow = true;
				rm.renderMesh.receiveShadow = true;
			}
		}


		for(let rm of this.renderMeshes){
			rm.renderMesh.visible=this.visible;
		}

		//create the physics mesh
		let am=engine.ammo.ammo;
		this.am=am;
		let transform =new am.btTransform();
		transform.setIdentity();
		transform.setOrigin(new am.btVector3(this.position.x,this.position.y,this.position.z));

		let mass = this.stationary ? 0 : this.mass;

		let localInertia = new am.btVector3(0,0,0);
		let shape = null;
		if(this.shape == "box") {
			let {width, height, depth} = this.params;
			shape = new am.btBoxShape(new am.btVector3(width/2,height/2,depth/2));
		}
		else if(this.shape == "sphere") {
			let {radius} = this.params;
			shape = new am.btSphereShape(radius);
		}else if(this.shape == "cylinder") {
			let {radius, height} = this.params;
			shape = new am.btCylinderShape(new am.btVector3(radius,height/2,radius));
		}




		let motionState = new am.btDefaultMotionState(transform);

		shape.calculateLocalInertia(mass,localInertia);

		//set margin
		shape.setMargin(0.05);

		let rbInfo = new am.btRigidBodyConstructionInfo(mass,motionState,shape,localInertia);
		this.ammoBody = new am.btRigidBody(rbInfo);
		this.ammoBody.setRestitution(this.restitution);
		this.ammoBody.setFriction(this.friction);
		//set speed
		this.ammoBody.setLinearVelocity(new am.btVector3(this.speed.x,this.speed.y,this.speed.z));
		//set angular speed
		this.ammoBody.setAngularVelocity(new am.btVector3(this.angularSpeed.x,this.angularSpeed.y,this.angularSpeed.z));
		//set mass
		if(this.mass !== null) {
			//this.ammoBody.setMassProps(this.mass,new am.btVector3(0,0,0));
		}
		this.engine.ammo.physicsWorld.addRigidBody(this.ammoBody);

		//let transform = new this.engine.ammo.ammo.btTransform();
		this.transformBuffer = new am.btTransform();






		//	syncPosition();


	}



	onUpdate(frame) {
		this.syncTransform();
	}
	onRender() {
	}

	addToScene(scene) {
		for(let rm of this.renderMeshes){
			scene.threeScene.add(rm.renderMesh);
		}
	}

	setPosition(position) {
		this.ammoBody.getMotionState().getWorldTransform(this.transformBuffer);
		this.transformBuffer.setOrigin(new this.am.btVector3(position.x,position.y,position.z));
		this.ammoBody.getMotionState().setWorldTransform(this.transformBuffer);
		this.ammoBody.setCenterOfMassTransform(this.transformBuffer);
	}
	setVelocity(velocity) {
		this.ammoBody.setLinearVelocity(new this.am.btVector3(velocity.x,velocity.y,velocity.z));
	}
	setAngularVelocity(angularVelocity) {
		this.ammoBody.setAngularVelocity(new this.am.btVector3(angularVelocity.x,angularVelocity.y,angularVelocity.z));
	}
	setVisible(visible) {
		for(let rm of this.renderMeshes){
			rm.renderMesh.visible=visible;
		}
	}


	syncTransform() {
		this.ammoBody.getMotionState().getWorldTransform(this.transformBuffer);
		let origin = this.transformBuffer.getOrigin();


		for(let rm of this.renderMeshes){
			rm.renderMesh.position.set(
				origin.x(),
				origin.y(),
				origin.z()
			);

			let rotation = this.transformBuffer.getRotation();
			rm.renderMesh.quaternion.set(rotation.x(),rotation.y(),rotation.z(),rotation.w());
		}

	}


}

