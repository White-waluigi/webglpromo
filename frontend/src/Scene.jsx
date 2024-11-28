import {useEffect, useState,useRef} from 'react'
import {Engine} from './engine/Engine.js'
import {TinCanSceneBuilder} from './engine/scenes/TinCanSceneBuilder.js'
import {ShadowSceneBuilder} from './engine/scenes/ShadowSceneBuilder.js'


export function Scene() {

	const [loading, setLoading] = useState(true);


	const container = useRef(null);

	useEffect(() => {

		
		let engine = new Engine(container.current);
		let sceneBuilder = new TinCanSceneBuilder();
		let scene = sceneBuilder.buildScene(engine);
		engine.init(scene).then(() => {
			setLoading(false);
			engine.startLoop();
		});

		return () => {
			engine.destroy();
		}

	}, [])




	return (
		<div style={{backgroundColor:"black",color:"white",width:"100%",height:"100%"}}>

			{loading && 
			<div className="mx-auto my-auto mt-5">
			<h1>Loading...</h1>
			</div>
				}

			<div ref={container} className="glContainer" />
		</div>
	)
}
