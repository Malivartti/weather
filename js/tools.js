export function timeConverter(value) {
    const date = new Date(value * 1000)
    let hours = date.getHours()
    let minutes = date.getMinutes()
    minutes = (minutes < 10) ? '0' + minutes : minutes
    hours = (hours < 10) ? '0' + hours : hours
    return hours + ':' + minutes
}

export function timeForecastConverter(value) {
	const date = new Date(value * 1000)
	let temhours = date.getHours(); 
  	return {
		time: `${(temhours < 10) ? '0' + temhours : temhours}:${("0" + date.getMinutes()).slice(-2)}`,
		day: date.toLocaleString('en-US', {day: "numeric"}) + ' ' + date.toLocaleString('en-US', {month: "short"})
	}
}

