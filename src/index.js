import React from 'react';
import ReactDOM from 'react-dom';
import MarkdownEditor from './components/MarkdownEditor.jsx';
import RandomImage from './components/RandomImage.jsx';
import styles from './app.css';


class App extends React.Component {

	render() {
		return (
			<div className="container">
				<MarkdownEditor />
				<RandomImage />
			</div>
		)
	}
}

ReactDOM.render(<App />, document.getElementById('root'))
