import {Scene} from "../Scene.js";
import {OrbitalCamera} from "../entities/OrbitalCamera.js";
import {RigidBody} from "../entities/RigidBody.js";
import {AmbientLight} from "../entities/AmbientLight.js";
import {DirectionalLight} from "../entities/DirectionalLight.js";
import {Skybox} from "../entities/Skybox.js";
import * as THREE from "three";
import {SizeLibrary} from "../ResourceManager.js";
import {BallShooter} from "../entities/BallShooter.js";
import {DebugPlane} from "../entities/DebugPlane.js";


export class TinCanSceneBuilder{


	constructor(numCanLayers){

		this.numCanLayers = numCanLayers;

		/*
		bananas  bottle    hamburger  marmelade  noodles   veal
beans    fish      mayo       oranges   
beer     cream     gipfel    
*/
		this.objFiles = [
			{
				file:"./models/fish/untitled.obj",
				mtlFile:"./models/fish/untitled.mtl",
				shape:"box"
			},
			{
				file:"./models/beer/untitled.obj",
				mtlFile:"./models/beer/untitled.mtl",
				shape:"cylinder"
			},
			{
				file:"./models/bottle/untitled.obj",
				mtlFile:"./models/bottle/untitled.mtl",
				shape:"cylinder"
			},
			{
				file:"./models/bananas/untitled.obj",
				mtlFile:"./models/bananas/untitled.mtl",
				shape:"box"
			},
			{
				file:"./models/cream/untitled.obj",
				mtlFile:"./models/cream/untitled.mtl",
				shape:"cylinder"
			},
			{
				file:"./models/gipfel/untitled.obj",
				mtlFile:"./models/gipfel/untitled.mtl",
				shape:"box"
			},
			{
				file:"./models/hamburger/untitled.obj",
				mtlFile:"./models/hamburger/untitled.mtl",
				shape:"cylinder"
			},
			{
				file:"./models/marmelade/untitled.obj",
				mtlFile:"./models/marmelade/untitled.mtl",
				shape:"cylinder"
			},
			{
				file:"./models/mayo/untitled.obj",
				mtlFile:"./models/mayo/untitled.mtl",
				shape:"box"
			},
			{
				file:"./models/noodles/untitled.obj",
				mtlFile:"./models/noodles/untitled.mtl",
				shape:"cylinder"
			},
			{
				file:"./models/oranges/untitled.obj",
				mtlFile:"./models/oranges/untitled.mtl",
				shape:"box"
			},
			{
				file:"./models/veal/untitled.obj",
				mtlFile:"./models/veal/untitled.mtl",
				shape:"box"
			},
			{
				file:"./models/coffee/untitled.obj",
				mtlFile:"./models/coffee/untitled.mtl",
				shape:"box"
			}
		];
	}


	buildScene(engine){

		let scene = new Scene();

		let camera = new OrbitalCamera();

		scene.addEntity(camera);

		let ambientLight = new AmbientLight(0xAAAAff, 0.7);
		scene.addEntity(ambientLight);


		let directionalLight = new DirectionalLight(new THREE.Vector3(0,10,0),0xffffff,new THREE.Vector3( -10, -10, 5 ),2);
		scene.addEntity(directionalLight);


		let ground = new RigidBody("box", {width: 100, height: 2, depth: 100,texture:{file:"models/textures/wood.jpg",scalex:10,scaley:10}},new THREE.Vector3(0,-1,0),true);
		scene.addEntity(ground);


		let brickWidth = 2;
		let brickHeight = 1;
		let brickDepth = 1;

		let numBricksWide = 10;
		let numBricksHigh = 10;

		let bricks=[]

		/*
		for(let i = 0; i < numBricksWide; i++){
			for(let j = 0; j < numBricksHigh; j++){
				let shifted= j%2;
				let x = 0
				let y = j * brickHeight+1*3;
				let z = (i + shifted * 0.5) * (brickWidth+0.1)+3;

				let randMesh = this.objFiles[Math.floor(Math.random() *this.objFiles.length)];


				let brick = new RigidBody("box", {width: brickWidth, height: brickHeight, depth: brickDepth,mesh:
					randMesh
				}, new THREE.Vector3(x,y,z),false,{friction:0.4});
				scene.addEntity(brick);
				bricks.push(brick);


			}
		}
		*/

		// build a pyramid of cans
		// the pillars should be spaced 1.2 units apart

		let pillars = [2,4,6,10,15,10,6,4,2];
		//let pillars= [1,1,1,1]


		for(let i = 0; i < pillars.length; i++){
			let heightSoFar = 0;
			for(let j = 0; j < pillars[i]; j++){
				let selectedMesh = this.objFiles[Math.floor(Math.random() * this.objFiles.length)];
				//look up the size of the mesh
				let size = SizeLibrary[selectedMesh.file];
				
				heightSoFar+=size.y/2;

				let x = 0
				let y = heightSoFar;
				let z = i * 1.2;



				let can = new RigidBody(selectedMesh.shape, {mesh:selectedMesh}, new THREE.Vector3(x,y,z),false,{friction:0.4,mass:6/(j+1)});
				scene.addEntity(can);

				heightSoFar += size.y/2;



			}

		}




		//shoot a ball straight towards the bricks

		/*
		let positionInFrontOfBricks = new THREE.Vector3(20,10,10);
		let ball = new RigidBody("sphere", {radius: 0.5,texture:{file:"models/textures/rabatt.png",scalex:2,scaley:2}}, positionInFrontOfBricks,false,{speed: new THREE.Vector3(-30,0,0),mass:10,angularSpeed:new THREE.Vector3(0,0,10)});
		scene.addEntity(ball);
		*/

		let ballShooter = new BallShooter(camera);
		scene.addEntity(ballShooter);




		let skybox = new Skybox("models/textures/lake.png");

		scene.addEntity(skybox);



		scene.setCamera(camera);
		return scene;
	}





}
