import React, { useState ,useEffect,useRef} from 'react'

export function VideoPlayer({playlist}) {

	const [currentlyPlaying, setCurrentlyPlaying] = useState(playlist[0]);


	const player=useRef(null);
	const playNext=()=>{
		let currentIndex=playlist.indexOf(currentlyPlaying);
		if(currentIndex<playlist.length-1){
			setCurrentlyPlaying(playlist[currentIndex+1]);
		}
		else{
			setCurrentlyPlaying(playlist[0]);
		}
		//reset the player
		player.current.load();

	}


	return (
		<div>
			<video width="320" height="240" controls ref={player} autoPlay onEnded={playNext} ref={player}>

				<source src={currentlyPlaying} type="video/mp4"/>
				Your browser does not support the video tag.
			</video>
		</div>
	)


}
