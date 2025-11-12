import styles from './HeroStyles.module.css';

function Hero() {
    return (
        <section>
            <h1>Tu espacio de notas <br /> definitivo</h1>
            <p>VisualNote es una aplicación de notas basada en la web que ofrece una
                experiencia de edición similar a Visual Studio Code. Organiza tus
                pensamientos, ideas y proyectos con facilidad.</p>
                <a href="#">
                    <button>
                        Comenzar
                    </button>
                </a>
        </section>
    )
}

export default Hero;