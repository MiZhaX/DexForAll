import PokemonList from './components/pokemonList'
import LandingPage from './components/landingPage'
import Login from './components/Login'
import DetallePokemon from './components/detallePokemon'
import JuegoPokemon from './components/juegoPokemon'
import Footer from './components/Footer'
import { RutasPrivadas } from './RutasPrivadas'
import Error404 from './components/Error404'
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom'


function App() {

  return (
    <>

      <BrowserRouter>
        <div className="cabecera">
          <div className="inicio">
            <img src="/img/masterBall.png" alt="" className="logo" />
            <h1>DexForAll</h1>
          </div>       
          <div className="enlaces">
            <Link to="/" className='link'> Inicio </Link>
            <Link to="/pokemonList" className='link'> Lista Pokemons </Link>
            <Link to="/jugar" className='link'> Jugar </Link>
            <Login></Login>
          </div>
        </div>
        <Routes>
          <Route exact path="/" Component={LandingPage}></Route>
          <Route Component={RutasPrivadas}>
            <Route path='/jugar' Component={JuegoPokemon}></Route>
          </Route>
          <Route path='/pokemonList' Component={PokemonList}></Route>
          <Route path='/detalle/:idPokemon' Component={DetallePokemon}></Route>
          <Route path='*' Component={Error404}></Route>
        </Routes>
      </BrowserRouter>
      <Footer></Footer>
    </>
  )
}

export default App
