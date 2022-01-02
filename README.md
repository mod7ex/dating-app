## dating app

# MongoDB, Express.Js, ejs templating engine, Socket.io

---

## for data we use this api https://data.world/dr5hn/country-state-city

### data structure;

```
countries = {
      name,
      code,
      timezones,
}

states = {
      name,
      code,
      country_code,
}

cities = {
      index,
      name,
      state_code,
      country_code,
}

```

---

## api

```
/api/locations/countries                  =>    countries
/api/locations/:country/states            =>    countries
/api/locations/:country/:state/cities     =>    countries
```
