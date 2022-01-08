const { fetchData, fetchLocation } = require("./helpers");

let prepareForm = () => {
      let editForm = document.getElementById("searchForm");

      if (!editForm) return;

      let countrySection = editForm.querySelector("#country-section");
      let countryInput = countrySection.querySelector("#country");
      let countriesListing = countrySection.querySelector(".listing");

      let stateSection = editForm.querySelector("#state-section");
      let stateInput = stateSection.querySelector("#state");
      let statesListing = stateSection.querySelector(".listing");

      let citySection = editForm.querySelector("#city-section");
      let cityInput = citySection.querySelector("#city");
      let citiesListing = citySection.querySelector(".listing");

      (() => {
            // partner age set up
            let partner_age_from = editForm.querySelector("#partner_age_from");
            let partner_age_to = editForm.querySelector("#partner_age_to");

            partner_age_from.addEventListener("change", function () {
                  let age_from = this.value;
                  partner_age_to
                        .querySelectorAll("option")
                        .forEach((option) => {
                              if (option.value < age_from)
                                    option.setAttribute("disabled", "disabled");
                              else option.removeAttribute("disabled");
                        });
            });

            partner_age_to.addEventListener("change", function () {
                  let age_to = this.value;
                  partner_age_from
                        .querySelectorAll("option")
                        .forEach((option) => {
                              if (option.value > age_to)
                                    option.setAttribute("disabled", "disabled");
                              else option.removeAttribute("disabled");
                        });
            });

            // @ts-ignore
            let age_from = Number(partner_age_from.value) || 0;
            partner_age_to.querySelectorAll("option").forEach((option) => {
                  if (Number(option.value) < age_from)
                        option.setAttribute("disabled", "disabled");
            });

            // @ts-ignore
            let age_to = Number(partner_age_to.value) || 0;
            if (!age_to) return;
            partner_age_from.querySelectorAll("option").forEach((option) => {
                  if (Number(option.value) > age_to)
                        option.setAttribute("disabled", "disabled");
            });
      })();

      (async () => {
            let country_code =
                  // @ts-ignore
                  countrySection.querySelector("#country_id").value;
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
                        citySection.querySelector("#city_id").value =
                              city.index;

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
