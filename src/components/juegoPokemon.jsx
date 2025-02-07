import { useState, useEffect } from 'react';
import { getFirestore, collection, orderBy, query, doc, updateDoc, getDocs, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const JuegoPokemon = () => {
    const db = getFirestore();
    const [pokemon, setPokemon] = useState(null);
    const [options, setOptions] = useState([]);
    const [correctOption, setCorrectOption] = useState('');
    const [rachaActual, setRachaActual] = useState(0);
    const [ranking, setRanking] = useState([]); 

    const rankingRef = collection(db, 'ranking');

    useEffect(() => {
        const fetchRanking = async () => {
            const datosRanking = await getDocs(query(rankingRef, orderBy('racha', 'desc')));
            const rankingCompleto = datosRanking.docs.map(doc => ({
                id: doc.id, 
                ...doc.data() 
            }));
            setRanking(rankingCompleto);
        };

        fetchRanking();
    }, [rankingRef]);

    // Obtiene un Pokémon aleatorio
    useEffect(() => {
        fetchRandomPokemon();
    }, []);

    const fetchRandomPokemon = async () => {
        const randomId = Math.floor(Math.random() * 1025) + 1;
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
        const data = await response.json();
        setPokemon(data);
        generateOptions(data.name);
    };

    const generateOptions = async (correctName) => {
        const options = [correctName];
        while (options.length < 3) {
            const randomId = Math.floor(Math.random() * 1025) + 1;
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
            const data = await response.json();
            if (!options.includes(data.name)) {
                options.push(data.name);
            }
        }
        setOptions(shuffleArray(options));
        setCorrectOption(correctName);
    };

    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    const [message, setMessage] = useState('');

    const handleOptionClick = async (option) => {
        if (option === correctOption) {
            setMessage('Correcto!');
            setRachaActual(rachaActual + 1);
        } else {
            if (rachaActual !== 0) {
                const user = getAuth().currentUser.displayName ? getAuth().currentUser.displayName : getAuth().currentUser.email.split('@')[0];

                // Busca al usuario en el ranking
                const existingUserDoc = ranking.find(doc => doc.usuario === user);
                if (existingUserDoc) {
                    if (rachaActual > existingUserDoc.racha) {
                        const userDoc = doc(db, 'ranking', existingUserDoc.id); 
                        await updateDoc(userDoc, { racha: rachaActual });
                    }
                } else {
                    await addDoc(rankingRef, {
                        usuario: user,
                        racha: rachaActual
                    });
                }
            }

            setMessage('Incorrecto!');
            setRachaActual(0);
        }

        fetchRandomPokemon();

        // Refresca el ranking después de actualizar
        const querySnapshot = await getDocs(query(rankingRef, orderBy('racha', 'desc')));
        const rankingData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        setRanking(rankingData);
    };

    return (
        <div className='juego-container'>
            <div className="juego-descripcion">
                <h2>COMO JUGAR</h2>
                <p>En este juego, se te mostrará la silueta de un Pokémon y tendrás que adivinar cuál es. Selecciona una de las opciones proporcionadas. Si aciertas, tu racha aumentará. Si fallas, tu racha se reiniciará y se actualizará el ranking con tu mejor racha.</p>
                <br />
                <p><b>¿Conseguirás entrar entre los mejores del ranking?</b></p>
            </div>
            {pokemon && (
                <div className='juego-content'>
                    <p className="juego-mensaje">{message}</p>
                    <img
                        src={pokemon.sprites.front_default}
                        alt="Pokemon Silhouette"
                        style={{ filter: 'brightness(0)' }}
                        className='juego-imagen'
                    />
                    <div className='juego-botones'>
                        {options.map((option, index) => (
                            <button key={index} onClick={() => handleOptionClick(option)}>
                                {option}
                            </button>
                        ))}
                    </div>
                    <p className='rachaActual'>Racha actual: {rachaActual}</p>
                </div>
            )}
            <div className="juego-ranking">
                <h2>RANKING</h2>
                <ul>
                    {ranking.map((doc, index) => (
                        <li key={index} className='listaRanking'>{index + 1}.- {doc.usuario}: {doc.racha}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default JuegoPokemon;
