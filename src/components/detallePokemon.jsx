import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

function DetallePokemon() {
    const { idPokemon } = useParams();
    const [pokemon, setPokemon] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`https://pokeapi.co/api/v2/pokemon/${idPokemon}`)
            .then(response => response.json())
            .then(data => {
                setPokemon(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching pokemon details:', error);
                setLoading(false);
            });
    }, [idPokemon]);

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (!pokemon) {
        return <div>Error al cargar los detalles del Pokémon.</div>;
    }

    return (
        <div className="container">
            <div className='detalle-content'>
                <div className="detalle-general">
                    <h1>{pokemon.name}</h1>
                    <div>
                        <img src={pokemon.sprites.versions['generation-v']['black-white'].animated.front_default} alt={pokemon.name} className='card'/>
                        <div className="holo"></div>
                    </div>
                </div>
                <div className="detalle-texto">
                    <h2>Descripción</h2>
                    <p>Altura: {pokemon.height}</p>
                    <p>Peso: {pokemon.weight}</p>
                    <p>Tipo: {pokemon.types.map(typeInfo => typeInfo.type.name).join(', ')}</p>
                </div>
                <div className="detalle-stats">
                    <h2>Estadísticas</h2>
                    <RadarChart
                        outerRadius={90}
                        width={730}
                        height={250}
                        data={[
                            { subject: 'HP', A: pokemon.stats[0].base_stat, fullMark: 150 },
                            { subject: 'Attack', A: pokemon.stats[1].base_stat, fullMark: 150 },
                            { subject: 'Defense', A: pokemon.stats[2].base_stat, fullMark: 150 },
                            { subject: 'Sp. Attack', A: pokemon.stats[3].base_stat, fullMark: 150 },
                            { subject: 'Sp. Defense', A: pokemon.stats[4].base_stat, fullMark: 150 },
                            { subject: 'Speed', A: pokemon.stats[5].base_stat, fullMark: 150 },
                        ]}
                    >
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" />
                        <PolarRadiusAxis angle={30} domain={[0, 150]} />
                        <Radar name="Pokemon" dataKey="A" stroke="purple" fill="purple" fillOpacity={0.6} />
                    </RadarChart>
                </div>
            </div>
        </div>
    );
}

export default DetallePokemon;
