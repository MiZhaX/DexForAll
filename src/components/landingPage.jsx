function LandingPage(){
    return (
        <div className="landing">
            <div className="bienvenida">
                <div className="bienvenida-content">
                    <h2 className="bienvenida-titulo">Bienvenido a DexForAll</h2>
                    <p className="bienvenida-descripcion">
                        Bienvenido a nuestra página web de DexForAll. <br /> Aquí puedes explorar información detallada sobre tus Pokémon favoritos, incluyendo estadísticas, habilidades y evoluciones. Nuestra plataforma ofrece una interfaz amigable y fácil de usar para que puedas buscar y descubrir todo lo que necesitas saber sobre el mundo Pokémon. ¡Empieza tu aventura y conviértete en un maestro Pokémon hoy mismo!
                    </p>
                    <img src="/img/captura1.png" alt="imagenDescripcion" className="imagenDescripcion"/>
                </div>
                <img src="/img/captura2.png" alt="imagenInicio" className="imagenInicio"/>
            </div>
        </div>
    )
}

export default LandingPage;