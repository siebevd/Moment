import React from 'react';
import { getNewPhoto } from '../utils/api.js';


class RandomImage extends React.Component {

	state = {}

	componentWillMount() {
		getNewPhoto()
			.then((data)=> {
				// Save the image
				this.setState({
					image: data.urls.regular
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
			</div>
		)
	}
}

export default RandomImage;
