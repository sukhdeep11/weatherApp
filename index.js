const express = require('express');
var app = express();
const request = require('request');
const hbs = require('hbs');
const bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({
    extended: false
}));
app.set('view engine', 'hbs');
app.use('/public', express.static('public'));



app.get('/', (req, res) => {
    res.render('index');
});

app.post('/', (req, res) => {
    var location = req.body.location;
    var fc = location.charCodeAt(0);
    if (fc > 47 && fc < 58) {
        res.render('index', {
            err: 'location not found'
        })
    } else {

        var url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=12a5cb88715d6913b36de61e52c6ccdf`;
        request(url, function (error, response, body) {


            var data = JSON.parse(body);

            console.log(data.cod);
            if (data.cod == 404) {
                res.render('index', {
                    err: 'location not found'
                })
            } else {
                var temp = Math.round(data.main.temp);
                var pressure = Math.round(data.main.pressure);
                var humidity = data.main.humidity;
                var speed = data.wind.speed;
                var name = data.name;
                var icon = data.weather[0].icon;


                var info = {
                    temp,
                    pressure,
                    humidity,
                    speed,
                    name,
                    icon

                }

                var desc = data.weather[0].description;
                res.render('index', {
                    info,
                    loc: true
                }) // Print the HTML for the Google homepage.
            }

        });
    }
})








var port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`app is listening to port ${port}`);
})