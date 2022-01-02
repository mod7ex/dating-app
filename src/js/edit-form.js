const axios = require("axios").default;

let locationsUri = "/api/locations";

let fetchData = async (pattern, country = null, state = null) => {
      if (!pattern) return null;

      let uri = `${locationsUri}/countries`;

      if (country) {
            uri += `/${country}/states`;
            if (state) uri += `/${state}/cities`;
      }

      uri = `${uri}?pattern=${pattern.toLowerCase()}`;
      let resp = await axios.get(uri);
      return resp.data;
};

let fetchLocation = async (country_code, state_code, city_index) => {
      if (!country_code || !state_code || !city_index) return;

      let uri = `${locationsUri}/${country_code}/${state_code}/${city_index}`;

      let resp = await axios.get(uri);
      return resp.data;
};

let prepareForm = () => {
      let editForm = document.getElementById("editForm");

      if (!editForm) return;

      let countrySection = editForm.querySelector("#country-section");
      let timezoneArea = editForm.querySelector("#timezone");
      let countryInput = countrySection.querySelector("#country");
      let countriesListing = countrySection.querySelector(".listing");

      let stateSection = editForm.querySelector("#state-section");
      let stateInput = stateSection.querySelector("#state");
      let statesListing = stateSection.querySelector(".listing");

      let citySection = editForm.querySelector("#city-section");
      let cityInput = citySection.querySelector("#city");
      let citiesListing = citySection.querySelector(".listing");

      (async () => {
            let country_code =
                  // @ts-ignore
                  countrySection.querySelector("#country_id").value;
            // @ts-ignore
            let timezone_index = editForm.querySelector("#timezone_id").value;
            // @ts-ignore
            let state_code = stateSection.querySelector("#state_id").value;
            // @ts-ignore
            let city_index = citySection.querySelector("#city_id").value;

            if (!country_code) return;

            let location = await fetchLocation(
                  country_code,
                  state_code,
                  city_index
            );

            if (Object.keys(location).length == 0) return;

            // @ts-ignore
            countryInput.value = location.country.name;
            // @ts-ignore
            stateInput.value = location.state;
            // @ts-ignore
            cityInput.value = location.city;

            location.country.timezones.forEach((tz, i) => {
                  let option = document.createElement("option");
                  option.value = i;
                  option.innerHTML = tz.tzName;
                  option.selected = i == timezone_index;
                  timezoneArea.appendChild(option);
            });

            // partner age set up
            let partner_age_from = editForm.querySelector("#from");
            let partner_age_to = editForm.querySelector("#to");
            let age_from = partner_age_from.value;
            partner_age_to.querySelectorAll("option").forEach((option) => {
                  if (option.value < age_from)
                        option.setAttribute("disabled", "disabled");
            });

            partner_age_from.addEventListener("change", function () {
                  let age_from = this.value;
                  partner_age_to
                        .querySelectorAll("option")
                        .forEach((option) => {
                              if (option.value < age_from)
                                    option.setAttribute("disabled", "disabled");
                        });
            });
      })();

      // Country handling
      countryInput.addEventListener("input", async function () {
            // @ts-ignore
            let pattern = this.value.trim();

            if (!pattern) {
                  countriesListing.innerHTML = "";
                  countrySection
                        .querySelector(".options")
                        .classList.add("hidden");
                  return;
            }

            let countries = await fetchData(pattern);

            if (!countries.length) {
                  countriesListing.innerHTML = "";
                  countrySection
                        .querySelector(".options")
                        .classList.add("hidden");
                  return;
            }

            countriesListing.innerHTML = "";

            countrySection.querySelector(".options").classList.remove("hidden");

            countries.forEach((country) => {
                  let span = document.createElement("span");

                  span.classList.add("choice");
                  span.id = country.code;
                  span.innerHTML = country.name;

                  span.onclick = () => {
                        // @ts-ignore
                        countrySection.querySelector("#country_id").value =
                              country.code;

                        // set timezone
                        timezoneArea.innerHTML = "";
                        let option = document.createElement("option");
                        option.innerHTML = "--not selected--";
                        option.selected = true;
                        option.disabled = true;
                        timezoneArea.appendChild(option);
                        country.timezones.forEach((tz, i) => {
                              let option = document.createElement("option");
                              option.value = i;
                              option.innerHTML = tz.tzName;
                              timezoneArea.appendChild(option);
                        });

                        this.value = country.name;

                        countriesListing.innerHTML = "";
                        countrySection
                              .querySelector(".options")
                              .classList.add("hidden");
                  };

                  countriesListing.appendChild(span);
            });
      });

      // State/Region handling
      stateInput.addEventListener("input", async function () {
            // @ts-ignore
            let pattern = this.value.trim();

            // @ts-ignore
            let countryCode = countrySection.querySelector("#country_id").value;

            if (!pattern || !countryCode) {
                  statesListing.innerHTML = "";
                  stateSection
                        .querySelector(".options")
                        .classList.add("hidden");
                  return;
            }

            let states = await fetchData(pattern, countryCode);

            if (!states.length) {
                  statesListing.innerHTML = "";
                  stateSection
                        .querySelector(".options")
                        .classList.add("hidden");
                  return;
            }

            statesListing.innerHTML = "";

            stateSection.querySelector(".options").classList.remove("hidden");

            states.forEach((state) => {
                  let span = document.createElement("span");

                  span.classList.add("choice");
                  // why
                  span.id = state.code;
                  span.innerHTML = state.name;

                  span.onclick = () => {
                        // @ts-ignore
                        stateSection.querySelector("#state_id").value =
                              state.code;

                        this.value = state.name;

                        statesListing.innerHTML = "";
                        stateSection
                              .querySelector(".options")
                              .classList.add("hidden");
                  };

                  statesListing.appendChild(span);
            });
      });

      // City handling
      cityInput.addEventListener("input", async function () {
            // @ts-ignore
            let pattern = this.value.trim();

            // @ts-ignore
            let countryCode = countrySection.querySelector("#country_id").value;
            // @ts-ignore
            let stateCode = stateSection.querySelector("#state_id").value;

            if (!pattern || !countryCode || !stateCode) {
                  citiesListing.innerHTML = "";
                  citySection.querySelector(".options").classList.add("hidden");
                  return;
            }

            let cities = await fetchData(pattern, countryCode, stateCode);

            if (!cities.length) {
                  citiesListing.innerHTML = "";
                  citySection.querySelector(".options").classList.add("hidden");
                  return;
            }

            citiesListing.innerHTML = "";

            citySection.querySelector(".options").classList.remove("hidden");

            cities.forEach((city, i) => {
                  let span = document.createElement("span");

                  span.classList.add("choice");
                  // why
                  span.id = i;
                  span.innerHTML = city.name;

                  span.onclick = () => {
                        // @ts-ignore
                        citySection.querySelector("#city_id").value = i;

                        this.value = city.name;

                        citiesListing.innerHTML = "";
                        citySection
                              .querySelector(".options")
                              .classList.add("hidden");
                  };

                  citiesListing.appendChild(span);
            });
      });
};

prepareForm();
