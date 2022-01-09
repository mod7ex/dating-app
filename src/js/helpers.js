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
      if (!country_code || !state_code || !city_index) return {};

      let uri = `${locationsUri}/${country_code}/${state_code}/${city_index}`;

      let resp = await axios.get(uri);
      return resp.data;
};

export { fetchData, fetchLocation };
