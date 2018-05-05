import React from "react";
import ReactDOM from "react-dom";
import MarkdownEditor from "components/MarkdownEditor/MarkdownEditor.jsx";
import Background from "components/Background/Background.jsx";
import styles from "./app.css";

class App extends React.Component {
	state = {
		fullBackground: false
	};

	/**
	 * Event Handlers
	 */

	toggleFull = () => {
		console.log("toggle the state");
		this.setState(oldState => ({
			fullBackground: !oldState.fullBackground
		}));
	};

	/**
	 * Render
	 */

	render() {
		return (
			<div className="container">
				<MarkdownEditor />
				<Background
					fullscreen={this.state.fullBackground}
					toggleFull={this.toggleFull}
				/>
			</div>
		);
	}
}

ReactDOM.render(<App />, document.getElementById("root"));
