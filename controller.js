const axios = require("axios");
const mongoose = require("mongoose");
const solution = require("./model/solution");
const answer = require("./model/answer");

const findTopThree = async (req, res, next) => {
  let heroes = req.body.heroes;
  let superheros = [];

  for (i in heroes) {
    console.log(heroes[i]);
    var options = {
      method: "GET",
      url: "https://superhero-search.p.rapidapi.com/",
      params: { hero: heroes[i] },
      headers: {
        "x-rapidapi-key": process.env.RAPID_API_KEY,
        "x-rapidapi-host": "superhero-search.p.rapidapi.com",
      },
    };

    await axios
      .request(options)
      .then(function (response) {
        if (!response.data.powerstats.intelligence) {
          return res.json({
            message: "Please enter the valid name for the superheroes",
          });
        }
        ans =
          response.data.powerstats.intelligence +
          response.data.powerstats.strength +
          response.data.powerstats.speed;
        //  console.log("answer", ans);
        const birthplace = response.data.biography.placeOfBirth;
        //  console.log("birthplace" + birthplace);
        let newans = {
          name: heroes[i],
          strength: ans,
          birthPlace: birthplace,
        };
        superheros.push(newans);
      })
      .catch(function (error) {
        console.error(error);
      });
  }
  console.log(superheros.length);
  superheros.sort(function (a, b) {
    return a.strength - b.strength;
  });
  superheros.map((hero) => {
    console.log(
      hero.name +
        "   " +
        hero.strength +
        "  " +
        hero.birthPlace +
        "   answer of each"
    );
  });
  superheros = superheros.slice(0, 3);
  req.heroes = superheros;
  next();
  //res.json({ heroes: superheros });
};

const getWeather = async (req, res, next) => {
  let heroes = req.heroes;
  //res.json(heroes);
  let count = 0;
  for (i in heroes) {
    var options = {
      method: "GET",
      url: "https://weatherapi-com.p.rapidapi.com/forecast.json",
      params: { q: heroes[i].birthPlace, days: "1" },
      headers: {
        "x-rapidapi-key": process.env.RAPID_WEATHER_KEY,
        "x-rapidapi-host": "weatherapi-com.p.rapidapi.com",
      },
    };
    count++;
    await axios
      .request(options)
      .then(function (response) {
        ans = response.data.current.temp_c;
        heroes[i].strength = undefined;
        heroes[i].rank = count;
        heroes[i].currentWeatherCelsius = ans;
        heroes[i].lat = response.data.location.lat;
        heroes[i].lon = response.data.location.lon;
        //console.log(response, "Result");
      })
      .catch(function (error) {
        console.error(error);
      });
  }
  req.heroes = heroes;
  //res.json(heroes);
  next();
};

const getNearByRestaurdant = async (req, res) => {
  let heroes = req.heroes;
  let name;
  let rating;
  let mongoanswers = new answer({});
  for (i in heroes) {
    var options = {
      method: "GET",
      url: "https://developers.zomato.com/api/v2.1/geocode",
      params: { lat: heroes[i].lat, lon: heroes[i].lon },
      headers: {
        Accept: "application/json",
        "X-Zomato-API-Key": process.env.ZOMATO_API_KEY,
      },
    };
    await axios
      .request(options)
      .then(async (response) => {
        console.log("near by restaurant");
        name = response.data.nearby_restaurants[0].restaurant.name;
        rating =
          response.data.nearby_restaurants[0].restaurant.user_rating
            .aggregate_rating;
        console.log(name + "  " + rating + "   answer");
        heroes[i].lat = undefined;
        heroes[i].lon = undefined;
        if (!name || !rating) {
          heroes[i].restaurant = {
            name: "Could not find any near By restaurant",
            rating: 0,
          };
        } else {
          heroes[i].restaurant = {
            name: name,
            rating: rating,
          };
        }
      })
      .catch((error) => {
        console.log("errror  " + error);
      });

    let mongoans = new solution({
      name: heroes[i].name,
      rank: heroes[i].rank,
      birthPlace: heroes[i].birthPlace,
      currentWeatherCelsius: heroes[i].currentWeatherCelsius,
      restaurant: heroes[i].restaurant,
    });
    await mongoans.save();
    mongoanswers.ans.push(mongoans._id);
  }

  await mongoanswers.save();
  res.json(heroes);
};

module.exports = {
  getNearByRestaurdant,
  getWeather,
  findTopThree,
};
