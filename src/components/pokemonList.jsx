import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'

function PokemonList() {
    const [pokemons, setPokemons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [offset, setOffset] = useState(0);

    const fetchPokemons = () => {
        setLoading(true);

        fetch(`https://pokeapi.co/api/v2/pokemon?limit=15&offset=${offset}`)
            .then(response => response.json())
            .then(data => {
                const allPokemons = data.results.map(pokemon => 
                    fetch(pokemon.url).then(response => response.json())
                );
                Promise.all(allPokemons).then(pokemonDetails => {
                    console.log('Pokemon details:', pokemonDetails);
                    if (pokemons != []) setPokemons([...pokemons, ...pokemonDetails]);
                    else setPokemons(pokemonDetails);
                    setLoading(false);
                });
                setOffset(offset + 15);
            })
            .catch(error => {
                console.error('Error fetching pokemons:', error);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchPokemons();
    }, []);

    return (
        <div className="pokemon-container">
            {loading && <img src="/img/loading_pokeball.gif" alt="Cargando.." className="cargando"/>}
            <div className="pokemon-cards">
                {pokemons.map((pokemon, index) => (
                    <Link to={`/detalle/${pokemon.id}`} key={index} className='enlace'>
                    <div className="pokemon-card"  style={{ background: `url(/img/${pokemon.types[0].type.name}_card.jpg)`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }} >
                        <div className="pokemon-card-contenido">
                            <div className="card-imagen">
                                <img src={pokemon.sprites.front_default} alt={pokemon.name} className='pokemon-card-imagen'/>
                            </div>
                            <div className="pokemon-card-nombre">
                                <h2>{pokemon.species.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
                            </div>
                            <div className="pokemon-card-id">
                                <p>#{pokemon.id.toString().padStart(3,'0')}</p>
                            </div>
                        </div>
                    </div>
                    </Link>
                ))}
            </div>
            <button onClick={fetchPokemons} disabled={loading} className='cargarMas'>
                {loading ? 'Cargando...' : 'Mostrar más'}
            </button>
        </div>
    );
};

export default PokemonList;
