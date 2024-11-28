import {useState} from 'react';
import {useEffect} from 'react';
import Button from 'react-bootstrap/Button';
import {VideoPlayer} from './VideoPlayer.jsx';
import {PlayFill} from 'react-bootstrap-icons';

export function SelectorMenu({ options, selected, setSelected }) {

	const [selectedItem, setSelectedItem] = useState(null);

	const [stage, setStage] = useState(null);
	const stages= ["Preprocessing","Nerf Reconstruction","Neus Reconstruction","Geometry Refinement","Texture Refinment", "Decimation"];

	useEffect(()=>{
		//simulate processing, increase stage percent ever 20ms and at 100, set next stage
		if(stage=="start"){


			const stageObjs=stages.map((stage)=>{return {name:stage,percent:0}});


			setStage(stageObjs);
			var interVal=setInterval(()=>{
				let nextStage=stageObjs.find((stageObj)=>stageObj.percent<100);

				if(nextStage){
					nextStage.percent+=1;
					setStage(structuredClone(stageObjs));
				}

				else{
					if(stage!=="start"){
						stage.finished=true;
					}
					setStage(structuredClone(stageObjs));
					clearInterval(interVal);
				}
			},10);

			console.log("start",interVal);


		}



	},[stage])


	const center={
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		height: '100vh',
		width: '100vw',
		//fancy css background
		background: 'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%)',
		background: "#1a1a1a",/* Dark metallic base */
		backgroundImage:`
		linear-gradient(90deg, rgba(0, 255, 255, 0.2) 1px, transparent 1px),
		linear-gradient(180deg, rgba(0, 255, 255, 0.2) 1px, transparent 1px),
		linear-gradient(45deg, rgba(0, 255, 100, 0.1) 25%, transparent 25%, transparent 75%, rgba(0, 255, 100, 0.1) 75%, rgba(0, 255, 100, 0.1)),
		linear-gradient(-45deg, rgba(100, 100, 255, 0.1) 25%, transparent 25%, transparent 75%, rgba(100, 100, 255, 0.1) 75%, rgba(100, 100, 255, 0.1))
		`,
		backgroundSize: "50px 50px, 50px 50px, 100px 100px, 100px 100px", /* Grid and crosshatch scales */
		backgroundColor: "#0d0d0d", /* Deep cyber-metal look */
		color: "white", /* Text glow color */
	}
	const dialog={
		//rounded corners
		borderRadius: "10px",
		padding: "20pt",
		background:"black",
		minWidth: "50%",
		width: "100%", /* Fill the available width of the device */
		maxWidth: "500pt", /* Maximum width constraint */
		margin: "0 auto", /* Center the div when the device width exceeds max-width */
		maxHeight: "100%",
		overflow: "scroll",
	}

	const items={
		banana:{
			image:"banane.png",
			name:"Banane",
			images:"/dc/raw/bananas/images/banane",
			dir:"/dc/raw/bananas/",
		},
		beer:{
			image:"beer.png",
			name:"Bier",
			images:"/dc/raw/beer/images/beer",
			dir:"/dc/raw/beer/",
		},
		marmelade:{
			image:"marmelade2.jpg",
			name:"Marmelade",
			images:"/dc/raw/marmelade/images/marmelade",
			dir:"/dc/raw/marmelade/",
		},
		bottle:{
			image:"bottle.png",
			name:"Flasche",
			images:"/dc/raw/bottle/images/bottle",
			dir:"/dc/raw/bottle/",
		},
		coffee:{
			image:"coffee.png",
			name:"Zahnpasta",
			images:"/dc/raw/coffee/images/coffee",
			dir:"/dc/raw/coffee/",
		},
		gipfel:{
			image:"gipfel.png",
			name:"Gipfeli",
			images:"/dc/raw/gipfel/images/gipfel",
			dir:"/dc/raw/gipfel/",
		},
		fish:{
			image:"fish.png",
			name:"Fisch",
			images:"/dc/raw/fish/images/fish",
			dir:"/dc/raw/fish/",
		},
	}

	const imageContainer={
		display: "flex",
		flexWrap: "wrap",
		justifyContent: "center",
		maxWidth: "100pt",
		maxHeight: "100pt",
		minWidth: "100pt",
		minHeight: "100pt",

		margin: "5pt",
		backgroundColor: "white",
	}
	const fixedImage={
		objectFit: "scale-down",
		maxWidth: "100pt",
		maxHeight: "100pt",
	}
	const smallImage={
		objectFit: "scale-down",
		maxWidth: "150pt",
		maxHeight: "150pt",
	}

	const itemToPlaylist=(item,stageName)=>{
		const its = [200, 400, 800, 1000,   5000];

		const mapper={
			"Preprocessing":"images",
			"Nerf Reconstruction":"nerf",
			"Neus Reconstruction":"neus",
			"Geometry Refinement":"geometry",
			"Texture Refinment":"texture",
		}
		const playlist = its.map((it) => {
			return item.dir +mapper[stageName]+"/"+ "it"+it+"-val.mp4";
		})
		return [item.dir+mapper[stageName]+"/"+"output.mp4"];
	}

	//black, slightly rounded, drop shadow, bold large font, centered
	const gameStartButton={
		background: "rebeccapurple",
		borderRadius: "10pt",
		boxShadow: "5pt 5pt 5pt black",
		color: "white",
		fontSize: "20pt",
		fontWeight: "bold",
		textAlign: "center",
		padding: "10pt",
		margin: "10pt",
	}

	return (

		<div style={center}>
			<div className="selector" style={dialog}>
				<div role="button" style={gameStartButton} onClick={() => {setSelected(1);}}>
					<PlayFill size={40} style={{marginRight: "3pt"}} /> Spiel Starten
				</div>

				{stage&&stage!="start"?
					<>
						<h4>Bild wird verarbeitet:</h4>
						{Object.keys(stage).map((key,index)=>{
							return <div key={index}>
								<h5>{stage[key].name}</h5>
								<div style={{width:"100%",backgroundColor:"black",height:"20pt",borderRadius:"10pt"}}>
									<div style={{width:stage[key].percent+"%",backgroundColor:"green",height:"20pt",borderRadius:"10pt"}}></div>
								</div>
								{stage[key].percent==100?(<div className="p-1 m-1">
									{
										stage[key].name=="Preprocessing"?(
											<>
												<img src={items[selectedItem].images+".png"} style={smallImage}/>
												<img src={items[selectedItem].images+"_depth.png"} style={smallImage}/>
												<img src={items[selectedItem].images+"_rgba.png"} style={smallImage}/>
												<img src={items[selectedItem].images+"_normal.png"} style={smallImage}/>
											</>
										)
										:
											stage[key].name=="Decimation"?
												<h5>Finished!</h5>
												:
										<>
											<VideoPlayer playlist={itemToPlaylist(items[selectedItem],stage[key].name)} />
										</>


									}



								</div>)

								:null
								}
							</div>
						})
						}

					</>
					:
					<>
						<div className="d-flex d-flex justify-content-center"><h2>Oder Bild wählen:</h2></div>
						<div className="d-flex  flex-column justify-content-center align-items-center">
							{/*scrollable gallery*/
								Object.keys(items).map((item, index) => {
									return (
										<div key={index} style={imageContainer} role="button">
											<img src={"images/"+items[item].image} alt={items[item].name} style={fixedImage} onClick={() => {
												setStage("start");
												setSelectedItem(item)
											}
												} />
										</div>
									);
								})
							}

						</div>
					</>
				}



			</div>
		</div>
	);
}
