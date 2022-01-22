const axios = require("axios").default;

let locationsUri = "/api/locations";

let fetchData = async (pattern, country = null, state_code = null) => {
      if (!pattern) return null;

      let uri = `${locationsUri}/countries`;

      if (country) {
            uri += `/${country}/states`;
            if (state_code) uri += `/${state_code}/cities`;
      }

      uri = `${uri}?pattern=${pattern.toLowerCase()}`;
      let resp = await axios.get(uri);
      return resp.data;
};

let fetchLocation = async (country_code, state_index, city_index) => {
      if (!country_code) return {};

      let uri = `${locationsUri}?country_code=${country_code}`;

      if (state_index) uri += `&state_index=${state_index}`;
      if (city_index) uri += `&city_index=${city_index}`;

      let resp = await axios.get(uri);
      return resp.data;
};

let createMsg = (
      id,
      content,
      at,
      { im_sender, read } = { im_sender: true, read: false }
) => {
      read = read && im_sender;

      let div = document.createElement("div");
      let wrapper = document.createElement("div");
      let txt = document.createElement("span");
      let span = document.createElement("span");
      let time = document.createElement("small");
      let sender = "him";

      txt.innerHTML = content;

      time.classList.add("time");
      time.innerHTML = at;

      span.classList.add("overview");

      span.appendChild(time);

      if (im_sender) {
            let state = document.createElement("small");
            state.classList.add("state");
            if (read) state.classList.add("read");
            sender = "me";
            span.appendChild(state);
      }

      div.classList.add("msg", sender);
      div.id = id;

      wrapper.classList.add("wrapper");
      txt.classList.add("txt");

      // **************

      wrapper.appendChild(txt);
      wrapper.appendChild(span);

      div.appendChild(wrapper);

      return div;
};

let currentMinute = (moment = Date.now()) => {
      let d = new Date(moment);
      let hours = d.getHours().toString();
      let minutes = d.getMinutes().toString();

      if (hours.length === 1) hours = 0 + hours;

      return `${hours.length - 1 ? hours : 0 + hours}:${minutes}`;
};

function isInContainer(element, container) {
      const elementRect = element.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      let yTop = elementRect.top - containerRect.top;
      let yBottom = containerRect.bottom - elementRect.bottom;

      let yBool = yTop >= 0 && yBottom >= 0;

      /*

      // no need for this because we scroll up and down only

      let xLeft = elementRect.left - containerRect.left;
      let xRight = containerRect.right - elementRect.right;

      let xBool = xLeft >=0 && xRight >= 0;
      // return yBool && xBool;

      */

      return yBool;
}

function isInViewport(element) {
      const rect = element.getBoundingClientRect();

      return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <=
                  (window.innerHeight ||
                        document.documentElement.clientHeight) &&
            rect.right <=
                  (window.innerWidth || document.documentElement.clientWidth)
      );
}

export {
      fetchData,
      fetchLocation,
      createMsg,
      currentMinute,
      isInContainer,
      isInViewport,
};
