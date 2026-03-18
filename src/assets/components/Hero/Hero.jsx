import styles from './HeroStyles.module.css';

function Hero() {
    return (
        <section className={styles.hero}>
            <div className={styles.heroContent}>
                <div className={styles.badge}>
                    <span className={styles.badgeText}>✨ Nuevo</span>
                    <span className={styles.badgeFeature}>Editor con IA integrada</span>
                </div>
                
                <h1 className={styles.heroTitle}>
                    Tu espacio de <span className={styles.highlight}>notas</span>
                    <br />
                    definitivo
                </h1>
                
                <p className={styles.heroDescription}>
                    VisualNote es una aplicación de notas basada en la web que ofrece una
                    experiencia de edición similar a Visual Studio Code. Organiza tus
                    pensamientos, ideas y proyectos con facilidad y estilo profesional.
                </p>
                
                <div className={styles.heroActions}>
                    <button 
                        className={styles.primaryBtn}
                        onClick={() => {
                            const noteSection = document.querySelector('.sectionNote');
                            if (noteSection) {
                                noteSection.scrollIntoView({ behavior: 'smooth' });
                            }
                        }}
                    >
                        <span>Comenzar Gratis</span>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                </div>
                
                <div className={styles.features}>
                    <div className={styles.feature}>
                        <div className={styles.featureIcon}>📝</div>
                        <span>Editor Rico</span>
                    </div>
                    <div className={styles.feature}>
                        <div className={styles.featureIcon}>☁️</div>
                        <span>Sincronización</span>
                    </div>
                    <div className={styles.feature}>
                        <div className={styles.featureIcon}>🎨</div>
                        <span>Personalizable</span>
                    </div>
                    <div className={styles.feature}>
                        <div className={styles.featureIcon}>🚀</div>
                        <span>Rápido</span>
                    </div>
                </div>
            </div>
            
            <div className={styles.heroVisual}>
                <div className={styles.floatingCard}>
                    <div className={styles.cardHeader}>
                        <div className={styles.cardDots}>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                        <span className={styles.cardTitle}>Mi Nota.md</span>
                    </div>
                    <div className={styles.cardContent}>
                        <div className={styles.codeLine}>
                            <span className={styles.lineNumber}>1</span>
                            <span className={styles.codeText}># Ideas Brillantes</span>
                        </div>
                        <div className={styles.codeLine}>
                            <span className={styles.lineNumber}>2</span>
                            <span className={styles.codeText}>- Organizar pensamientos</span>
                        </div>
                        <div className={styles.codeLine}>
                            <span className={styles.lineNumber}>3</span>
                            <span className={styles.codeText}>- Crear contenido</span>
                        </div>
                        <div className={styles.cursor}></div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero;