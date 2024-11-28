import { useState } from 'react'

import { Scene } from './Scene.jsx'

import { SelectorMenu } from './SelectorMenu.jsx'

//import bootstrap css
import 'bootstrap/dist/css/bootstrap.min.css'
import ReactGA from "react-ga4";

ReactGA.initialize("G-FF16F8HBHL");

function App() {
	const [selected, setSelected] = useState(null)

	return (
		<>

			{selected?
				<Scene/>
				:
				<SelectorMenu selected={selected} setSelected={setSelected} options="tincan" />
			}
		</>
	)
}

export default App
