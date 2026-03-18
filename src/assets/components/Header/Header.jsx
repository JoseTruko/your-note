import { Link } from 'react-router-dom';
import styles from './HeaderStyles.module.css';

function Header() {
    return (
        <header className={styles.header}>
            <div className={styles.logo}>
                <Link to="/">
                    <h1 className={styles.logoText}>VisualNote</h1>
                </Link>
            </div>
            
            <nav className={styles.nav}>
                <Link to="/" className={styles.navLink}>Inicio</Link>
                <Link to="/caracteristicas" className={styles.navLink}>Características</Link>
                <Link to="/contacto" className={styles.navLink}>Contacto</Link>
                <Link to="/precios" className={styles.navLink}>Precios</Link>
            </nav>
            
            <div className={styles.actions}>
                {/* Botones removidos según solicitud del usuario */}
            </div>
        </header>
    );
}

export default Header;