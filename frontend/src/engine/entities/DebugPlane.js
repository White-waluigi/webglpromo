import {Entity} from './Entity.js'
import * as THREE from 'three';

//common colors
const commonColors = {
	red:0xff0000,
	green:0x00ff00,
	blue:0x0000ff,
	yellow:0xffff00,
	white:0xffffff,
	black:0x000000,
	purple:0x800080,
	orange:0xffa500,
	brown:0xa52a2a,
	grey:0x808080,
	gray:0x808080,
	teal:0x008080,
	cyan:0x00ffff,
	magenta:0xff00ff
		
		

};
export class DebugPlane extends Entity {
	constructor({pos=new THREE.Vector3(0,0,0),axis="x",color="random"}={}){
		super();
		this.mesh=null;
		this.pos=pos;
		this.axis=axis;

		this.material=null;

		this.color=color;
		if(this.color=="random"){
			this.color = Math.pow(Math.random(),1.22) * 0xffffff;
		}
	}
	init(engine){
		this.engine=engine;

		this.material = new THREE.MeshBasicMaterial( {color:this.color, side: THREE.DoubleSide} );

		//create a plane
		let geometry = new THREE.PlaneGeometry( 1, 1, 1, 1 );
		//allign the plane with the axis
		if(this.axis=="x"){
			geometry.rotateY( Math.PI / 2 );
		}
		else if(this.axis=="z"){
			geometry.rotateX( Math.PI / 2 );
		}


		this.mesh = new THREE.Mesh( geometry, this.material );

		this.mesh.position.copy(this.pos);


	}
	addToScene(scene){
		scene.threeScene.add(this.mesh);
	}
}
