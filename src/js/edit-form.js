const axios = require("axios").default;

let locationsUri = "/api/locations/countries";

let fetchData = async (pattern, country = null, state = null) => {
      if (!pattern) return null;

      let uri = locationsUri;

      if (country) {
            uri += `/${country}/states`;
            if (state) uri += `/${state}/cities`;
      }

      uri = `${uri}?pattern=${pattern.toLowerCase()}`;
      let resp = await axios.get(uri);
      return resp.data;
};

let prepareForm = async () => {
      let editForm = document.getElementById("editForm");

      if (!editForm) return;

      let countrySection = editForm.querySelector("#country-section");
      let countryInput = countrySection.querySelector("#country");

      countryInput.addEventListener("input", async function () {
            let pattern = this.value.trim();

            if (!pattern) {
                  countrySection
                        .querySelector(".options")
                        .classList.add("hidden");
                  return;
            }

            let countries = await fetchData(pattern);

            let listing = countrySection.querySelector(".listing");

            listing.innerHTML = "";

            countrySection.querySelector(".options").classList.remove("hidden");

            countries.forEach((country) => {
                  let span = document.createElement("span");

                  span.classList.add("choice");
                  span.id = country.code;
                  span.innerHTML = country.name;

                  span.onclick = () => {
                        countrySection.querySelector("#country_id").value =
                              country.code;

                        this.value = country.name;

                        countrySection
                              .querySelector(".options")
                              .classList.add("hidden");
                  };

                  listing.appendChild(span);
            });
      });
};

prepareForm();
