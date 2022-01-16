const { fetchData, fetchLocation } = require("./helpers");

let prepareForm = () => {
      let searchForm = document.getElementById("searchForm");
      let editForm = document.getElementById("editForm");

      if (!editForm && !searchForm) return;

      let form = searchForm || editForm;

      (() => {
            let fields = ["partner_age", "weight", "height"];

            for (let input of fields) {
                  let field_from = form.querySelector(`#${input}_from`);
                  if (!field_from) continue;
                  let field_to = form.querySelector(`#${input}_to`);

                  field_from.addEventListener("change", function () {
                        let val = Number(this.value);
                        // console.log(typeof val);
                        field_to
                              .querySelectorAll("option.val")
                              .forEach((option) => {
                                    // @ts-ignore
                                    if (Number(option.value) < val)
                                          option.setAttribute(
                                                "disabled",
                                                "disabled"
                                          );
                                    else option.removeAttribute("disabled");
                              });
                  });

                  field_to.addEventListener("change", function () {
                        let val = Number(this.value);
                        // console.log(typeof val);
                        field_from
                              .querySelectorAll("option.val")
                              .forEach((option) => {
                                    // @ts-ignore
                                    if (Number(option.value) > val)
                                          option.setAttribute(
                                                "disabled",
                                                "disabled"
                                          );
                                    else option.removeAttribute("disabled");
                              });
                  });

                  // @ts-ignore
                  let field_value_from = Number(field_from.value) || 0;
                  field_to.querySelectorAll("option").forEach((option) => {
                        if (Number(option.value) < field_value_from)
                              option.setAttribute("disabled", "disabled");
                  });

                  // @ts-ignore
                  let field_value_to = Number(field_to.value) || 0;
                  if (!field_value_to) continue;
                  field_from.querySelectorAll("option").forEach((option) => {
                        if (Number(option.value) > field_value_to)
                              option.setAttribute("disabled", "disabled");
                  });
            }
      })();

      let countrySection = form.querySelector("#country-section");
      let countryInput = countrySection.querySelector("#country");
      let timezoneArea = form.querySelector("#timezone");
      let countriesListing = countrySection.querySelector(".listing");

      let stateSection = form.querySelector("#state-section");
      let stateInput = stateSection.querySelector("#state");
      let statesListing = stateSection.querySelector(".listing");

      let citySection = form.querySelector("#city-section");
      let cityInput = citySection.querySelector("#city");
      let citiesListing = citySection.querySelector(".listing");

      (async () => {
            let country_code =
                  // @ts-ignore
                  countrySection.querySelector("#country_id").value;
            // @ts-ignore
            let state_index = stateSection.querySelector("#state_id").value;
            // @ts-ignore
            let city_index = citySection.querySelector("#city_id").value;

            if (!country_code) return;

            let location = await fetchLocation(
                  country_code,
                  state_index,
                  city_index
            );

            if (Object.keys(location).length == 0) return;

            // @ts-ignore
            countryInput.value = location.country.name;
            // @ts-ignore
            stateInput.value = location.state.name || "";
            // @ts-ignore
            cityInput.value = location.city.name || "";

            if (!timezoneArea) return;

            // @ts-ignore
            let timezone_index = form.querySelector("#timezone_id").value;

            location.country.timezones.forEach((tz, i) => {
                  let option = document.createElement("option");
                  option.value = i;
                  option.innerHTML = tz.tzName;
                  option.selected = i == timezone_index;
                  timezoneArea.appendChild(option);
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

                        this.value = country.name;

                        countriesListing.innerHTML = "";
                        countrySection
                              .querySelector(".options")
                              .classList.add("hidden");

                        if (!timezoneArea) return;

                        //  ************** set timezone
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
                        //  **************
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
                              state.index;

                        // @ts-ignore
                        stateSection.querySelector("#state_code_id").value =
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
            let stateCode = stateSection.querySelector("#state_code_id").value; // ***

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
