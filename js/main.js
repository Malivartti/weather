import {UI_ELEMENTS} from './view.js'

const tabs_name = ['result-now', 'result-detailed', 'result-forecast']
const serverUrl = 'https://api.openweathermap.org/data/2.5/weather';
const apiKey = 'f660a2fb1e4bad108d6160b7f58c555f';
let favorite_cities_list = ['Los Angeles', 'New York', 'London', 'Paris', 'Moscow', 'Beijing', 'Tokyo']

UI_ELEMENTS.SWITCH_TABS.forEach(item => item.onclick = function() {
	const tab_index = tabs_name.indexOf(item.id)

	UI_ELEMENTS.CONTENT_TABS.forEach(item => item.classList.remove('active-content'))
	UI_ELEMENTS.CONTENT_TABS[tab_index].classList.add('active-content')
	UI_ELEMENTS.SWITCH_TABS.forEach(item => item.classList.remove('active-tab'))
	item.classList.add('active-tab')
})


function loadCity(cityName) {
	const url = `${serverUrl}?q=${cityName}&appid=${apiKey}&units=metric`;
	return fetch(url)
		.then(response => response.json())
}

function setCity() {
	getCity(this.firstElementChild.value)
}

function setFavoriteCity() {
	getCity(this.firstElementChild.textContent)
}

function getCity(city) {
	loadCity(city)
		.then(item => {
			if (!item.name) throw new Error('Not found this city');

			UI_ELEMENTS.SET_CITY.forEach(set_item => set_item.textContent = item.name)
			UI_ELEMENTS.SET_DEGREE.forEach(set_item => set_item.textContent = Math.round(item.main.temp) + '°')
			UI_ELEMENTS.SET_WEATHER_ICON.src = `http://openweathermap.org/img/wn/${item.weather[0].icon}@4x.png`
			UI_ELEMENTS.LIKE_BTN.style.fill = favorite_cities_list.includes(item.name) ? 'black' : 'none'
			UI_ELEMENTS.SET_FEEL_LIKE.textContent = Math.round(item.main.feels_like) + '°'
			UI_ELEMENTS.SET_WEATHER.textContent = item.weather[0].main
			UI_ELEMENTS.SET_SUNRISE.textContent = timeConverter(item.sys.sunrise)
			UI_ELEMENTS.SET_SUNSET.textContent = timeConverter(item.sys.sunset)
		})
		.catch(item => alert(item))
		.finally(UI_ELEMENTS.FORM.reset())
}

function addFavoriteCity() {
	const city_name = this.previousElementSibling.textContent
	if (!favorite_cities_list.includes(city_name)) {
		UI_ELEMENTS.LIKE_BTN.style.fill = 'black'
		favorite_cities_list.push(city_name)
		showFavoriteCities()
	}
}

function removeFavoriteCity() {
	this.parentElement.remove()
	favorite_cities_list.splice(favorite_cities_list.indexOf(this.previousElementSibling.textContent), 1)
}

function showFavoriteCities() {
	UI_ELEMENTS.FAVORITE_CITIES.innerHTML = ''
	favorite_cities_list.forEach(item => {
		const clone_el = tmpl.content.cloneNode(true)
		clone_el.querySelector('.item-name').textContent = item
		clone_el.querySelector('.favorite-item').addEventListener('click', setFavoriteCity)
		clone_el.querySelector('.remove_btn').addEventListener('click', removeFavoriteCity)
		UI_ELEMENTS.FAVORITE_CITIES.append(clone_el)
	})
}

function timeConverter(value) {
    const date = new Date(value)
    let hours = date.getHours()
    let minutes = date.getMinutes()
    minutes = (minutes < 10) ? '0' + minutes : minutes
    hours = (hours < 10) ? '0' + hours : hours
    return hours + ':' + minutes
}



UI_ELEMENTS.FORM.addEventListener('submit', setCity)
UI_ELEMENTS.LIKE_BTN.addEventListener('click', addFavoriteCity)
getCity('moscow')
showFavoriteCities()