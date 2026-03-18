import styles from './Pages.module.css';

function Pricing() {
    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.badge}>
                        <span className={styles.badgeText}>💰 Precios</span>
                    </div>
                    <h1 className={styles.title}>
                        Planes <span className={styles.highlight}>flexibles</span>
                    </h1>
                    <p className={styles.description}>
                        Elige el plan que mejor se adapte a tus necesidades. 
                        Desde uso personal hasta equipos empresariales.
                    </p>
                </div>

                <div className={styles.content}>
                    <div className={styles.comingSoon}>
                        <div className={styles.comingSoonIcon}>💳</div>
                        <h2>Gratis por ahora</h2>
                        <p>VisualNote es completamente gratuito durante la fase beta. Los planes de precios estarán disponibles próximamente.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Pricing;