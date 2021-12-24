import {UI_ELEMENTS} from './view.js'
import {timeConverter, timeForecastConverter} from './tools.js'

const serverUrl = 'https://api.openweathermap.org/data/2.5/weather';
const apiKey = 'eee1cd17e13322cf43e90f619f3b4197';
const tabs_name = ['result-now', 'result-detailed', 'result-forecast']
let favorite_cities_list = ['Los Angeles', 'New York', 'London', 'Paris', 'Moscow', 'Beijing', 'Tokyo']

if (localStorage.getItem('cities') === null) {
	getCity('Moscow')
	updateLocalStorage()
} else setLocalStorage()

UI_ELEMENTS.FORM.addEventListener('submit', setCity)
UI_ELEMENTS.LIKE_BTN.addEventListener('click', addFavoriteCity)
renderFavoriteCities()


UI_ELEMENTS.SWITCH_TABS.forEach(item => item.addEventListener('click', () => {
	const tab_index = tabs_name.indexOf(item.id)

	UI_ELEMENTS.CONTENT_TABS.forEach(item => item.classList.remove('active-content'))
	UI_ELEMENTS.CONTENT_TABS[tab_index].classList.add('active-content')
	UI_ELEMENTS.SWITCH_TABS.forEach(item => item.classList.remove('active-tab'))
	item.classList.add('active-tab')
}))

function updateLocalStorage() {
	localStorage.setItem('cities', favorite_cities_list)
}

function setLocalStorage() {
	favorite_cities_list = []
	if (localStorage.getItem('cities') != '') {
		localStorage.getItem('cities').split(',').forEach(item => favorite_cities_list.push(item))
	}
	
	getCity(localStorage.getItem('currentCity'))
}

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
			UI_ELEMENTS.SET_WEATHER_ICON.src = `https://openweathermap.org/img/wn/${item.weather[0].icon}@4x.png`
			UI_ELEMENTS.LIKE_BTN.style.fill = favorite_cities_list.includes(item.name) ? 'black' : 'none'
			UI_ELEMENTS.SET_FEEL_LIKE.textContent = Math.round(item.main.feels_like) + '°'
			UI_ELEMENTS.SET_WEATHER.textContent = item.weather[0].main
			UI_ELEMENTS.SET_SUNRISE.textContent = timeConverter(item.sys.sunrise)
			UI_ELEMENTS.SET_SUNSET.textContent = timeConverter(item.sys.sunset)

			renderForecast(item.id)
			localStorage.setItem('currentCity', item.name)
		})
		.catch(alert)
		.finally(UI_ELEMENTS.FORM.reset())
}

function renderFavoriteCities() {
	UI_ELEMENTS.FAVORITE_CITIES.innerHTML = ''
	favorite_cities_list.forEach(item => {
		const clone_el = tmpl.content.cloneNode(true)
		clone_el.querySelector('.item-name').textContent = item
		clone_el.querySelector('.favorite-item').addEventListener('click', setFavoriteCity)
		clone_el.querySelector('.remove_btn').addEventListener('click', removeFavoriteCity)
		UI_ELEMENTS.FAVORITE_CITIES.append(clone_el)
	})
}


function addFavoriteCity() {
	const city_name = this.previousElementSibling.textContent
	if (!favorite_cities_list.includes(city_name)) {
		UI_ELEMENTS.LIKE_BTN.style.fill = 'black'
		favorite_cities_list.push(city_name)
	} else {
		UI_ELEMENTS.LIKE_BTN.style.fill = 'none'
		favorite_cities_list.splice(favorite_cities_list.indexOf(city_name), 1)
	}
	updateLocalStorage()
	renderFavoriteCities()
}

function removeFavoriteCity() {
	favorite_cities_list.splice(favorite_cities_list.indexOf(this.previousElementSibling.textContent), 1)
	updateLocalStorage()
	renderFavoriteCities()
}

function renderForecast(cityId) {
	const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?id=${cityId}&appid=${apiKey}&units=metric`
	fetch(forecastUrl)
		.then(response => response.json())
		.then(items => {
			UI_ELEMENTS.FORECAST_LIST.innerHTML = ''
			items.list.forEach(item => {
				const dataForecast = timeForecastConverter(item.dt)
				const clone_el = tmpl2.content.cloneNode(true)

				clone_el.querySelector('.day').textContent = dataForecast.day
				clone_el.querySelector('.hour').textContent = dataForecast.time
				clone_el.querySelector('.temperature').textContent = `Temperature: ${Math.round(item.main.temp)}°` 
				clone_el.querySelector('.feel').textContent = `Feels like: ${Math.round(item.main.feels_like)}°` 
				clone_el.querySelector('.weather').textContent = item.weather[0].main
				clone_el.querySelector('.pic').src = `http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`

				UI_ELEMENTS.FORECAST_LIST.append(clone_el)
			})
		})
}

