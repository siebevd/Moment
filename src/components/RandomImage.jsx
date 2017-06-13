import React from 'react';
import { getNewPhoto } from '../utils/api.js';


class RandomImage extends React.Component {

	state = {}

	componentWillMount() {
		getNewPhoto()
			.then((data)=> {
				// Save the image
				this.setState({
					image: data.urls.regular,
					user: data.user
				})

				// localStorage.setItem('photos', JSON.stringify(data));
			});
	}
	render = () => {

		let styles = {};

		if (this.state.image) {
				styles['backgroundImage'] = `url(${this.state.image})`;
		}

		return (
			<div className="img" style={styles}>
				{this.state.user && <div className="imgCredit">
					Photo by <a href={`https://unsplash.com/@${this.state.user.username}?utm_source=moment&utm_medium=referral&utm_campaign=api-credit`}>{this.state.user.name}</a> / <a href={`https://unsplash.com?utm_source=moment&utm_medium=referral&utm_campaign=api-credit`}>Unsplash</a>
				</div>}
			</div>
		)
	}
}

export default RandomImage;
