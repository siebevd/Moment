
getNewPhotos();
// 1. Do we already have  photos saved?
let photos = JSON.parse(localStorage.getItem('photos'));
let photoDom = document.querySelector('.img');
let textDom = document.querySelector('.text');

// Get the photos
if (!photos) {
	console.log('lets update the photos', photos);
	getNewPhotos()
		.then((data)=>{
			setPicture();
		})
} else {
	setPicture();
}

// Set the events
textDom.addEventListener('keyup', ()=>{
	console.log('the text has changed', textDom.innerHTML);
	localStorage.setItem('text',textDom.innerHTML)
})

textDom.innerHTML = localStorage.getItem('text') ? localStorage.getItem('text') : 'Hey There!';
textDom.focus();


function setPicture(){
	let latestPhotos = JSON.parse(localStorage.getItem('photos'));
	// Grab the first picture
	console.log('this is the photo', latestPhotos);
	let photo = latestPhotos.shift();

	console.log('this is the photo', photo);
	photoDom.style.backgroundImage = `url(${photo.urls.regular})`;

	if (latestPhotos.length < 0) {
		// No pics left, so lets remove so we can do an api call the next time
		localStorage.removeItem('photos');
	} else {
		// update the saved photos
		localStorage.setItem('photos', JSON.stringify(latestPhotos));
	}


}


function getNewPhotos(){
	return fetch('https://api.unsplash.com/photos/random?count=30&client_id=4d258685b5794a9487732ad70a2cbe74382150a79c06d1792d2ea04fc7d6d7fb')
					.then((res)=>res.json())
					.then((data)=>{
						console.log('update', data);
						localStorage.setItem('photos', JSON.stringify(data));

					});
}
