import styles from './HeaderStyles.module.css';

function Header() {
    return (
        <header>
            <h1>VisualNote</h1>
            <nav>
                <a href="#">Inicio</a>
                <a href="#">Características</a>
                <a href="#">Colaborar</a>
            </nav>
            <div>
                <a href="">
                    <button>
                        Iniciar
                    </button>
                </a>
            </div>
        </header>
    );
}

export default Header;