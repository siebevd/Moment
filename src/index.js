import React from 'react';
import ReactDOM from 'react-dom';
import MarkdownEditor from './components/MarkdownEditor.jsx';
import styles from './app.css';


class App extends React.Component {

	render() {
		return (
			<div className={styles.container}>
					<MarkdownEditor />
					<div className="img">
					</div>
				</div>
		)
	}
}

ReactDOM.render(	<App />, document.getElementById('root'))
