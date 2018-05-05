import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { getNewPhoto } from "utils/api.js";
import CONFIG from "../../../config.js";
import SettingsIcon from "components/svg/SettingsIcon.jsx";
import "./Background.css";

class Background extends React.Component {
	state = {};

	componentWillMount() {
		getNewPhoto().then(data => {
			console.log("what is the data", data);

			// TODO: should this be moved to the api part?
			// tell unsplash that the image is "downloaded",
			// which is needed to comply with the unsplash api
			fetch(
				`${data.links.download_location}?client_id=${CONFIG.unsplash.apiKey}`
			)
				.then(res => res.json())
				.then(data => console.log("data", data))
				.catch(e => console.log("ERR", e));
			// Save the image
			this.setState({
				image: data.urls.regular,
				user: data.user
			});

			// localStorage.setItem('photos', JSON.stringify(data));
		});
	}
	render() {
		let styles = {};

		if (this.state.image) {
			styles["backgroundImage"] = `url(${this.state.image})`;
		}

		const containerClasses = classNames("background", {
			fullscreenBg: this.props.fullscreen
		});

		return (
			<div className={containerClasses} style={styles}>
				<div className="controlBtns">
					<button
						className="fullViewToggleBtn"
						onClick={this.props.toggleFull}
					/>
					<SettingsIcon className="settingsBtn" />
				</div>
				{this.state.user && (
					<div className="imgCredit">
						Photo by{" "}
						<a
							href={`https://unsplash.com/@${
								this.state.user.username
							}?utm_source=moment&utm_medium=referral&utm_campaign=api-credit`}
						>
							{this.state.user.name}
						</a>{" "}
						/{" "}
						<a
							href={`https://unsplash.com?utm_source=moment&utm_medium=referral&utm_campaign=api-credit`}
						>
							Unsplash
						</a>
					</div>
				)}
			</div>
		);
	}
}

Background.propTypes = {
	fullscreen: PropTypes.bool.isRequired,
	toggleFull: PropTypes.func.isRequired
};

export default Background;
