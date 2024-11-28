import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import {MTLLoader} from 'three/addons/loaders/MTLLoader.js';
import {Mutex} from  "async-mutex";
import * as THREE from 'three';

/*
./models/noodles/untitled.obj 
Object { x: 0.8170360326766968, y: 1.0228829383850098, z: 0.8712199926376343 }
ResourceManager.js:165:11
./models/beer/untitled.obj 
Object { x: 0.6014919877052307, y: 1.0625779628753662, z: 0.5864269733428955 }
ResourceManager.js:165:11
./models/marmelade/untitled.obj 
Object { x: 0.7957850098609924, y: 1.0734679698944092, z: 0.771880030632019 }
ResourceManager.js:165:11
./models/oranges/untitled.obj 
Object { x: 0.8222839832305908, y: 1.0455700159072876, z: 0.8059319853782654 }
ResourceManager.js:165:11
./models/fish/untitled.obj 
Object { x: 0.35002601146698, y: 0.432763010263443, z: 1.050063967704773 }
ResourceManager.js:165:11
./models/veal/untitled.obj 
Object { x: 0.7230499982833862, y: 0.5725870132446289, z: 1.0645970106124878 }
ResourceManager.js:165:11
./models/cream/untitled.obj 
Object { x: 0.8697140216827393, y: 0.774461030960083, z: 1.0762289762496948 }
ResourceManager.js:165:11
./models/bottle/untitled.obj 
Object { x: 0.37404799461364746, y: 1.0582730770111084, z: 0.36680999398231506 }
ResourceManager.js:165:11
./models/gipfel/untitled.obj 
Object { x: 0.5444480180740356, y: 0.7385240197181702, z: 1.0706089735031128 }
ResourceManager.js:165:11
./models/bananas/untitled.obj 
Object { x: 1.0906329154968262, y: 0.5997430086135864, z: 1.0997059345245361 }
ResourceManager.js:165:11
./models/hamburger/untitled.obj 
Object { x: 1.0029709339141846, y: 0.8146580457687378, z: 1.0312830209732056 }
ResourceManager.js:165:11
./models/mayo/untitled.obj 
Object { x: 0.2522429823875427, y: 1.067291021347046, z: 0.6470019817352295 }
*/

export const SizeLibrary = {
	"./models/noodles/untitled.obj":{x:0.8170360326766968,y:1.0228829383850098,z:0.8712199926376343},
	"./models/beer/untitled.obj":{x:0.6014919877052307,y:1.0625779628753662,z:0.5864269733428955},
	"./models/marmelade/untitled.obj":{x:0.7957850098609924,y:1.0734679698944092,z:0.771880030632019},
	"./models/oranges/untitled.obj":{x:0.8222839832305908,y:1.0455700159072876,z:0.8059319853782654},
	"./models/fish/untitled.obj":{x:0.35002601146698,y:0.432763010263443,z:1.050063967704773},
	"./models/veal/untitled.obj":{x: 0.46025699377059937, y: 0.40573498606681824, z: 1.0914740562438965},
	"./models/cream/untitled.obj":{x:0.8697140216827393,y:0.774461030960083,z:1.0762289762496948},
	"./models/bottle/untitled.obj":{x:0.37404799461364746,y:1.0582730770111084,z:0.36680999398231506},
	"./models/gipfel/untitled.obj":{x: 0.8161660432815552, y: 0.37909001111984253, z: 1.069471001625061},
	"./models/bananas/untitled.obj":{ x: 1.1100809574127197, y: 0.5067099928855896, z: 1.101212978363037},
	"./models/hamburger/untitled.obj":{x:1.0029709339141846,y:0.8146580457687378,z:1.0312830209732056},
	"./models/mayo/untitled.obj":{x:0.2522429823875427,y:1.067291021347046,z:0.6470019817352295},
	"./models/coffee/untitled.obj":{x: 0.47267499566078186, y: 0.9074970483779907, z: 0.5207270383834839}
}




export class ResourceManager {

	constructor(){
		this.materials={};
		this.textures={};
		this.meshes={};

		this.mutex = new Mutex();
	}

	async loadObj(file,mtlFile){
		let object=await this.mutex.runExclusive(async ()=>{


			if(this.meshes[file]){
				return this.meshes[file].clone(true);
			}


			/*
			new MTLLoader()
				.setPath( 'models/obj/male02/' )
				.load( 'male02.mtl', function ( materials ) {

					materials.preload();

					new OBJLoader()
						.setMaterials( materials )
						.setPath( 'models/obj/male02/' )
						.load( 'male02.obj', function ( object ) {

							object.position.y = - 0.95;
							object.scale.setScalar( 0.01 );
							scene.add( object );

						}, onProgress );

				} );
				*/

			let mtlLoader = new MTLLoader();
			let materials =await new Promise((resolve,reject)=>{
				mtlLoader
					.load( mtlFile, function ( materials ) {
						resolve(materials);
					});
			});
			materials.preload();
			let objLoader = new OBJLoader();
			let object = await new Promise((resolve,reject)=>{
			objLoader
				.setMaterials( materials )
				.load( file, function ( object ) {

					resolve(object);

				} );
			})

			//center all the children

			for(let i=0;i<object.children.length;i++){
				object.children[i].geometry.center();
			}


			// make all the children cast shadows
			for(let i=0;i<object.children.length;i++){
				object.children[i].castShadow=true;
				object.children[i].receiveShadow=true;
			}


			this.meshes[file]=object;

			// print out proportions
			let bbox = new THREE.Box3().setFromObject(object)
			let size={x:bbox.max.x-bbox.min.x,y:bbox.max.y-bbox.min.y,z:bbox.max.z-bbox.min.z};



			return object;
		});





		return object.clone(true);
	}

	async loadTexture(file){
		return await this.mutex.runExclusive(async ()=>{

			if(this.textures[file]){
				return this.textures[file].clone();
			}

			let texture = new THREE.TextureLoader().load(file);
			this.textures[file]=texture;
			return texture;
		});
	}


	

}

