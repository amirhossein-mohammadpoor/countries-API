const WEATHER_API_KEY = "dc0b5da8c5660ba6d83ddfe07146c334"
const MAPP_API_KEY = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjJmYjZhOTdhOTZjMjkwMGE4ZWIyYzExOGY2NTU4MjAxY2ZiMzkwNDE0N2E3OTQ2ZDFlM2E5NjM2NjE2NDQ2ZGM5NzhkNjMzYTMyYzhiNGUzIn0.eyJhdWQiOiI5NTIwIiwianRpIjoiMmZiNmE5N2E5NmMyOTAwYThlYjJjMTE4ZjY1NTgyMDFjZmIzOTA0MTQ3YTc5NDZkMWUzYTk2MzY2MTY0NDZkYzk3OGQ2MzNhMzJjOGI0ZTMiLCJpYXQiOjE1OTE0NDA3NjEsIm5iZiI6MTU5MTQ0MDc2MSwiZXhwIjoxNTk0MDMyNzYxLCJzdWIiOiIiLCJzY29wZXMiOlsiYmFzaWMiXX0.RVfqLC_UwhYFsnvOqebOtAFkdtwGBWNOKRxIRsogWcX3twBEnxZDSE1bx4Dh8i-a7V_bITdD2N1U_PruPpj6Plr_gaqYfQtF-4FpaJuaxOlfGXM1YMXhvPYUdtnah1qGAzhza0RQOUYScoXDR5YJC6Jueq35ANFl2W7Cuw-WFLS-JnU2PvyMqe6ZNOzxKzyPqwG81ElZnvPkiuwwKiAhYLD5nSqiR3k-jYpj4CsIgYbaANd7mRMlM0B9VXxOl-RiCk4ucu8EBlPK7XAawmfJyW6up2crex_PRb4KKT5OpPKV8advzuPerHOfm_B4jm3f5zwkBXFL_IW0CLOltZyp2w'

let app
$("document").ready(function () {
  app = new Mapp({
    element: '#app',
    presets: {
      latlng: {
        lat: 32,
        lng: 52,
      },
      zoom: 4
    },
    apiKey:  MAPP_API_KEY
  })
  app.addLayers()
  app.addZoomControls()
  $(".mapp-logo").remove()
})

$.ajax({
  url: "https://restcountries.eu/rest/v2/all",
  method: "GET",
  success: result => {
    $("[name='select']").empty()
    for (let value of result) {
      $("[name='select']").append($("<option></option>").text(value.name).val(value.name))
    }
  }
})

$("select").on("change", function (event) {
  $(".over-layer").css("display", "block")
  $.ajax({
    url: `https://restcountries.eu/rest/v2/name/${$(this).val()}`
  })
    .done(country => {
      
      $("[alt='flag']").attr("src", country[0].flag)
      $("#calling-code").text(country[0].callingCodes[0])
      $("#name").text(country[0].name)
      $("#native-name").text(country[0].nativeName)
      $("#capital").text(country[0].capital)
      $("#region").text(country[0].region)
      $("#population").text(country[0].population)
      $("#language").text(country[0].languages[0].name)
      $("#timezone").text(country[0].timezones[0])
      app.addMarker({
        name: 'basic-marker',
        latlng: {
          lat: country[0].latlng[0],
          lng: country[0].latlng[1],
        }
      })
      $.ajax({
        url: `http://api.openweathermap.org/data/2.5/weather?q=${country[0].capital.replace(" ","+")}&appid=${WEATHER_API_KEY}&units=metric`
      })
        .done(weather => {
          $("h5#capital").text(country[0].capital)
          $("[alt='weather-icon']").attr("src", `http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`)
          $("#wind-speed").text(weather.wind.speed)
          $("#temperature").text(weather.main.temp | 0)
          $("#humidity").text(weather.main.humidity)
          $("#visibility").text(weather.visibility)
          $(".over-layer").css("display", "none")
        })
    })
})