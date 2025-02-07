import { getAuth, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import '../css/login.css';

function Login() {
    const auth = getAuth();
    const googleProvider = new GoogleAuthProvider();
    const githubProvider = new GithubAuthProvider();
    const navigate = useNavigate();

    const [usuario, setUsuario] = useState(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [isRegistering, setIsRegistering] = useState(false);
    const [error, setError] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUsuario(user);
        });
        return () => unsubscribe();
    }, [auth]);

    const signInWithGoogle = () => {
        signInWithPopup(auth, googleProvider)
            .then((result) => {
                console.log("User signed in:", result.user);
                navigate("/");
                closeModal();
            })
            .catch((error) => {
                console.error("Error signing in with Google:", error);
                setError("Error al iniciar sesión con Google");
            });
    };

    const signInWithGithub = () => {
        signInWithPopup(auth, githubProvider)
            .then((result) => {
                console.log("User signed in:", result.user);
                navigate("/");
                closeModal();
            })
            .catch((error) => {
                console.error("Error signing in with Github:", error);
                setError("Error al iniciar sesión con GitHub");
            });
    };

    const signInWithEmail = () => {
        setError("");
        signInWithEmailAndPassword(auth, email, password)
            .then((result) => {
                console.log("User signed in:", result.user);
                navigate("/");
                setEmail("");
                setPassword("");
                closeModal();
            })
            .catch((error) => {
                console.error("Error signing in:", error);
                if (error.code === "auth/invalid-email") {
                    setError("Correo inválido");
                } else if (error.code === "auth/invalid-credential") {
                    setError("Contraseña incorrecta");
                } else {
                    setError("Error iniciando sesión");
                }
            });
    };

    const registerWithEmail = () => {
        setError("");
        if (password !== repeatPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }
        createUserWithEmailAndPassword(auth, email, password)
            .then((result) => {
                console.log("User registered:", result.user);
                navigate("/");
                setEmail("");
                setPassword("");
                setRepeatPassword("");
                closeModal();
            })
            .catch((error) => {
                console.error("Error registering:", error);
                if (error.code === "auth/email-already-in-use") {
                    setError("El correo ya está en uso");
                } else if (error.code === "auth/weak-password") {
                    setError("Contraseña débil (Mínimo 6 caracteres)");
                } else if (error.code === "auth/invalid-email") {
                    setError("Correo inválido");
                } else {
                    setError("Error al registrarse");
                }
            });
    };

    const cerrarSesion = () => {
        auth.signOut()
            .then(() => {
                console.log("User signed out");
                navigate("/");
            })
            .catch((error) => {
                console.error("Error signing out:", error);
                setError("Error cerrando sesión");
            });
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setError("");
        setEmail("");
        setPassword("");
        setRepeatPassword("");
        setError("");
    };

    let nombreUsuario = "";

    if(usuario) {
        nombreUsuario = getAuth().currentUser.displayName ? getAuth().currentUser.displayName : getAuth().currentUser.email.split('@')[0];
    }

    return (
        <div>
            {usuario ? (
                <div>
                    <p>Bienvenido {nombreUsuario}</p>
                    <button onClick={cerrarSesion} className="botonRegistro">Cerrar Sesión</button>
                </div>
            ) : (
                <div>
                    <button onClick={() => setIsModalOpen(true)} className="botonRegistro">Login / Registrarse</button>

                    {isModalOpen && (
                        <div className="modal">
                            <div className="modal-content">
                                <button onClick={closeModal} className="close-button">&times;</button>
                                <h2>{isRegistering ? "Registrarse" : "Iniciar Sesión"}</h2>
                                {error && <p style={{ color: "red" }}>{error}</p>}
                                {isRegistering ? (
                                    <div className="modal-form">
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Correo Electrónico"
                                        />
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Contraseña"
                                        />
                                        <input
                                            type="password"
                                            value={repeatPassword}
                                            onChange={(e) => setRepeatPassword(e.target.value)}
                                            placeholder="Repite tu Contraseña"
                                        />
                                        <button onClick={registerWithEmail} className="botonRegistro">
                                            Registrarse
                                        </button>
                                    </div>
                                ) : (
                                    <div className="modal-form">
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Correo Electrónico"
                                        />
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Contraseña"
                                        />
                                        <button onClick={signInWithEmail} className="botonRegistro">
                                            Iniciar Sesión
                                        </button>
                                    </div>
                                )}
                                <div className="opcionesExternas">
                                    <button onClick={signInWithGoogle} className="botonRegistro">Iniciar con Google</button>
                                    <button onClick={signInWithGithub} className="botonRegistro">Iniciar con Github</button>
                                </div>
                                <button onClick={() => setIsRegistering(!isRegistering)} className="toggle-button">
                                    {isRegistering ? "¿Ya tienes cuenta? Inicia Sesión" : "¿No tienes cuenta? Regístrate"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Login;
