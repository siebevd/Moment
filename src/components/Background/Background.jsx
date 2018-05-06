import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import SettingsIcon from "components/svg/SettingsIcon.jsx";
import RefreshIcon from "components/svg/RefreshIcon.jsx";
import LockIcon from "components/svg/LockIcon.jsx";
import Settings from "components/Settings/Settings.jsx";
import "./Background.css";

class Background extends React.Component {
	state = {};

	/**
	 * Render
	 */

	render() {
		let styles = {};

		const image = this.props.lockedImage || this.props.image;

		console.log("what is image", image);

		if (image) {
			styles["backgroundImage"] = `url(${image.url})`;
		}

		const containerClasses = classNames("background", {
			fullscreenBg: this.props.fullscreen
		});

		return (
			<div className={containerClasses} style={styles}>
				{/*<Settings />*/}
				<div className="controlBtns">
					<button
						className="controlBtn fullViewToggleBtn"
						onClick={this.props.toggleFull}
					/>
					{/*<SettingsIcon className="settingsBtn" />*/}
					<div className="rightBtns">
						<RefreshIcon
							className="controlBtn refreshBtn"
							onClick={this.props.updateImage}
						/>
						<LockIcon
							className={classNames("controlBtn", "lockBtn", {
								lockedBtn: !!this.props.lockedImage
							})}
							onClick={this.props.lockImage}
						/>
					</div>
				</div>
				{image &&
					image.contributor && (
						<div className="imgCredit">
							Photo by{" "}
							<a
								href={`https://unsplash.com/@${
									image.contributor.username
								}?utm_source=moment&utm_medium=referral&utm_campaign=api-credit`}
							>
								{image.contributor.name}
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
	toggleFull: PropTypes.func.isRequired,
	updateImage: PropTypes.func.isRequired,
	lockImage: PropTypes.func.isRequired,
	lockedImage: PropTypes.object,
	image: PropTypes.object
};

export default Background;
