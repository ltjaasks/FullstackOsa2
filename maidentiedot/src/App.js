import axios from 'axios'
import { useEffect, useState } from 'react'

const Filter = (props) => {
  return (
    <div>
      find countries <input onChange={props.handleSearch} id='searchTxt'/>
    </div>
  )
}

const Button = (props) => {
  return(
    <button onClick={() => {
      document.getElementById('searchTxt').value = props.country.name.common
      props.handleSearch()
    } 
    }>show</button>
  )
}

const Countries = (props) => {
  if (props.countries.length > 10) {
    return (
      <p>Too many matches, specify another filter</p>
    )
    }
  
  if (props.countries.length === 1) {
    return (
      <ShowCountry countries={props.countries} setCity={props.setCity} weather={props.weather}/>
    )
  }  

  return (
    props.countries.map(country =>
      <div>
        <p key={country.name.official}>{country.name.common} 
        <Button country={country} handleSearch={props.handleSearch}/></p>
      </div>
    )
  )
}

const ShowCountry = (props) => {
  props.setCity(props.countries[0].capital[0])
  return (
    <div>
    <h1>{props.countries[0].name.common}</h1>

    <p>capital {props.countries[0].capital[0]}</p>

    <p>area {props.countries[0].area}</p>

    <strong>languages:</strong>

    {Object.values(props.countries[0].languages).map(language =>
    <li>{language}</li>)}

    <img src={props.countries[0].flags.png} />

    <ShowWeather city={props.countries[0].capital[0]} weather={props.weather}/>

  </div>
  )
}

const ShowWeather = (props) => {
  return (
    <div>
      <h1>Weather in {props.city}</h1>
      <p>Temperature {props.weather.main.temp} Celsius</p>
      <img src={`http://openweathermap.org/img/wn/${props.weather.weather[0].icon}@2x.png`}/>
      <p>wind {props.weather.wind.speed} m/s</p>
    </div>
  )
}

const App = () => {

  const [countries, setCountries] = useState([])
  const [countriesFiltered, setCountriesFiltered] = useState(countries)
  const [weather, setWeather] = useState()
  const [city, setCity] = useState('helsinki')
  const api_key = process.env.REACT_APP_API_KEY
  let weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}&units=metric`


  const hook = () => {
    console.log('effect')
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        console.log('promise fulfilled')
        setCountries(response.data)
      })
  }

  useEffect(hook, [])
  console.log('render', countries.length, 'countries')
  
  const hookWeather = () => {  
    axios
      .get(weatherUrl)
      .then(response => {
        console.log('sää tallennettu')
        setWeather(response.data)
      })
    }

  useEffect(hookWeather, [city])
  console.log('render', weather)

  const handleSearch = () => {
    if (document.getElementById("searchTxt").value !=='') {
      console.log(document.getElementById("searchTxt").value.toLowerCase())
      setCountriesFiltered(countries.filter(country => country.name.common.toLowerCase().includes(document.getElementById("searchTxt").value.toLowerCase())))
    }
    else {
      console.log('hakukenttä on tyhjä')
      setCountriesFiltered(countries)
    }
  }


  return (
    <div>
      <Filter handleSearch={handleSearch}/>
      <Countries countries={countriesFiltered} handleSearch={handleSearch} setCity={setCity} weather={weather}/>
    </div>

  );
}

export default App;
