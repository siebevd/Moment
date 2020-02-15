import CONFIG from "../../config.js";

const queryPhotos = (query) => {
	if (query && query !== "") {
		query = query.trim();
		console.log("QUERY PHOTOS WITH", query)
		return fetch(
			`https://api.unsplash.com/search/photos?query=${query}&count=30&client_id=${
				CONFIG.unsplash.apiKey
			}`
		)
			.then(res => res.json())
			.then(data => {
				data = data.results;
				// Grab the latest photo
				let newPhoto = data.pop();
	
				localStorage.setItem("photos", JSON.stringify(data));
				return newPhoto;
			});
	}

	console.log("RANDOM")
	
	return fetch(
		`https://api.unsplash.com/photos/random?count=30&client_id=${
			CONFIG.unsplash.apiKey
		}`
	)
		.then(res => res.json())
		.then(data => {
			console.log("DATA", data)
			// Grab the latest photo
			let newPhoto = data.pop();

			localStorage.setItem("photos", JSON.stringify(data));
			return newPhoto;
		})
}

const getNextPhoto = () => {
	// Check if we already got photos set
	let storedPhotos = JSON.parse(localStorage.getItem("photos"));

	if (storedPhotos && storedPhotos.length > 0) {
		// We already have images
		let newPhoto = storedPhotos.pop();
		// Save the updated photos
		localStorage.setItem("photos", JSON.stringify(storedPhotos));
		// Return the new photo
		return newPhoto;
	}
}

export const getNewPhoto = () => {
	var query = localStorage.getItem("unsplashQueryText");
	var nextPhoto = getNextPhoto();
	console.log("Got next photo", nextPhoto)
	if (!nextPhoto) {
		return queryPhotos(query)
	} else {
		return Promise.resolve(nextPhoto)
	}
};
