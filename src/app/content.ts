let blocklist = [];
let blockingEnabled;

chrome.storage.sync.get(['yemeksepetiFoodBlockerState'], (items) => {
	blocklist = items['yemeksepetiFoodBlockerState'].blocklist;
	blockingEnabled = items['yemeksepetiFoodBlockerState'].blockingEnabled;

	(function() {
		setTimeout(() => {
			if (blockingEnabled) {
				initializeRestaurantListener();
				initializeFoodListener();
			}
		}, 2000);
 	})();
});

function initializeRestaurantListener() {
	blocklist.forEach(x => {
		const restaurants = document.querySelectorAll(`.restaurantName[href*='${x}']`);
		console.log(restaurants);
		console.log(x);
		restaurants.forEach(z => {
			const parent = z.parentElement.parentElement.parentElement.parentElement;
			if (parent && parent.parentElement) {
				//parent.parentElement.style.background = 'grey';
				parent.parentElement.removeChild(parent);
			}
		});
	})
}

function initializeFoodListener() {
	const foods = document.querySelectorAll('.product');

	foods.forEach((z: HTMLDivElement) => {
		if (blocklist.some(v => z.innerText.toLowerCase().includes(v))) {
			const parent = z.parentElement.parentElement;
			if (parent && parent.parentElement) {
				//parent.parentElement.style.background = 'grey';
				parent.parentElement.removeChild(parent);
			}
		}
	});
}
