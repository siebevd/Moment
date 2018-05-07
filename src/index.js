import React from "react";
import ReactDOM from "react-dom";
import CONFIG from "../config.js";
import { getNewPhoto } from "utils/api.js";
import MarkdownEditor from "components/MarkdownEditor/MarkdownEditor.jsx";
import Background from "components/Background/Background.jsx";

import styles from "./app.css";

class App extends React.Component {
	state = {
		fullBackground: !!localStorage.getItem("fullBackground"),
		lockedImage: JSON.parse(localStorage.getItem("lockedImage")) || null
	};

	/**
	 * Life Cycle
	 */

	componentDidMount() {
		if (!this.state.lockedImage) {
			this.updateImage();
		}
	}

	/**
	 * Event Handlers
	 */

	updateImage = () => {
		getNewPhoto().then(data => {
			// TODO: should this be moved to the api part?
			// tell unsplash that the image is "downloaded",
			// which is needed to comply with the unsplash api
			fetch(
				`${data.links.download_location}?client_id=${CONFIG.unsplash.apiKey}`
			)
				.then(res => res.json())
				.catch(e => console.log("ERR", e));

			// Save the image
			this.setState(oldState => {
				let newState = {
					image: {
						url: data.urls.regular,
						contributor: data.user,
						type: "unsplash" // store type for future reference (when we start adding in multiple types)
					}
				};

				if (oldState.lockedImage) {
					// if we already have a locked image
					newState.lockedImage = newState.image;
					// Don't forget to update local storage
					localStorage.setItem("lockedImage", JSON.stringify(newState.image));
				}
				return newState;
			});

			// localStorage.setItem('photos', JSON.stringify(data));
		});
	};

	lockImage = () => {
		this.setState(oldState => {
			let lockedImage = null;
			let image = oldState.image;
			if (!oldState.lockedImage) {
				// if we don't have a locked image set
				// store it in the state and on localstorage
				localStorage.setItem("lockedImage", JSON.stringify(this.state.image));
				lockedImage = oldState.image;
			} else {
				image = JSON.parse(localStorage.getItem("lockedImage"));
				localStorage.removeItem("lockedImage");
			}
			// update state
			return {
				lockedImage,
				image
			};
		});
	};

	toggleFull = () => {
		this.setState(oldState => {
			if (oldState.fullBackground) {
				// remove the key as we won't be fullscreen anymore
				localStorage.removeItem("fullBackground");
			} else {
				// set the full background
				localStorage.setItem("fullBackground", true);
			}
			return {
				fullBackground: !oldState.fullBackground
			};
		});
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
					image={this.state.image}
					updateImage={this.updateImage}
					lockImage={this.lockImage}
					lockedImage={this.state.lockedImage}
				/>
			</div>
		);
	}
}

ReactDOM.render(<App />, document.getElementById("root"));
