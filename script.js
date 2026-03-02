const BASE_URL = "https://restcountries.com/v3.1/name"
const BASE_BORDER_URL = "https://restcountries.com/v3.1/alpha"
const spinner = document.body.querySelector(".spinner");
hide_unhide(spinner)

function hide_unhide(element) {
	if (/hidden/g.test(element.getAttribute("class"))) {
		element.setAttribute("class", element.getAttribute("class").replaceAll(/\s*hidden\s*/g, " ").trim());
	} else {
		element.setAttribute("class", element.getAttribute("class").trim() + " hidden");
	}
}

async function search_name() {
	hide_unhide(spinner);
	var countryname = document.body.querySelector("#country-input");
	if (!countryname) return;
	countryname = countryname.value.trim();
	try {
		const response = await fetch(`${BASE_URL}/${countryname}`)
		if (response.status != 200) return;
		update_display();
		const data = await response.json();
		update_display(data[0]);
	} catch (err) {
		console.error("Failed to search country name...", err);
	} finally {
		hide_unhide(spinner);
	}
}

async function get_borders(country_borders) {
	var str = "";
	for (border of country_borders) {
		const response = await fetch(`${BASE_BORDER_URL}/${border}`)
		if (response.status != 200) return;
		const data = await response.json();
		str += `
			<div class="border">
				<p><strong>Border:</strong> ${data[0].name.common}</p>
				<img src="${data[0].flags.svg}" alt="${data[0].name.common} flag" style="width: 10em;">
			</div>
		`
	}
	return str;
}

function update_display(data = undefined) {
	if (!data) {
		document.body.querySelector("section#country-info").innerHTML = "";
	} else {
		get_borders(data.borders).then(borders => {
			document.body.querySelector("section#country-info").innerHTML = `
				<h2>${data.name.common}</h2>
				<p><strong>Capital:</strong> ${data.capital[0]}</p>
				<p><strong>Population:</strong> ${data.population.toLocaleString()}</p>
				<p><strong>Region:</strong> ${data.region}</p>
				<img src="${data.flags.svg}" alt="${data.name.common} flag">
			`
			document.body.querySelector("section#bordering-countries").innerHTML = borders;
		})
	}
}

document.body.querySelector("#search-btn").addEventListener("click", search_name);
document.addEventListener("keydown", e => {
	if (e.keyCode == 13) {
		search_name();
	}
})
