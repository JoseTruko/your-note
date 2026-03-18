import styles from './FeaturesStyles.module.css';

function Features() {
    const features = [
        {
            id: 1,
            icon: '📝',
            title: 'Editor Rico',
            description: 'Editor de texto avanzado con formato, similar a VS Code con sintaxis highlighting y autocompletado.',
            details: [
                'Formato de texto completo',
                'Sintaxis highlighting',
                'Autocompletado inteligente',
                'Atajos de teclado'
            ]
        },
        {
            id: 2,
            icon: '🤖',
            title: 'IA Integrada',
            description: 'Asistente de IA que te ayuda a mejorar, resumir y expandir tus notas automáticamente.',
            details: [
                'Resumen automático',
                'Mejora de redacción',
                'Corrección de errores',
                'Traducción instantánea'
            ]
        },
        {
            id: 3,
            icon: '☁️',
            title: 'Sincronización',
            description: 'Tus notas se sincronizan automáticamente en todos tus dispositivos en tiempo real.',
            details: [
                'Sincronización en tiempo real',
                'Acceso desde cualquier dispositivo',
                'Backup automático',
                'Historial de versiones'
            ]
        },
        {
            id: 4,
            icon: '🎨',
            title: 'Personalizable',
            description: 'Temas personalizables, layouts flexibles y configuración adaptada a tu flujo de trabajo.',
            details: [
                'Temas oscuro y claro',
                'Layout personalizable',
                'Atajos configurables',
                'Extensiones disponibles'
            ]
        },
        {
            id: 5,
            icon: '🚀',
            title: 'Rápido',
            description: 'Rendimiento optimizado para una experiencia fluida, incluso con miles de notas.',
            details: [
                'Carga instantánea',
                'Búsqueda ultrarrápida',
                'Optimizado para móviles',
                'Sin lag en la escritura'
            ]
        },
        {
            id: 6,
            icon: '🔒',
            title: 'Seguro',
            description: 'Encriptación de extremo a extremo para mantener tus notas privadas y seguras.',
            details: [
                'Encriptación E2E',
                'Autenticación segura',
                'Privacidad garantizada',
                'Cumple con GDPR'
            ]
        }
    ];

    return (
        <section id="caracteristicas" className={styles.features}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.badge}>
                        <span className={styles.badgeText}>✨ Características</span>
                    </div>
                    <h2 className={styles.title}>
                        Todo lo que necesitas para
                        <span className={styles.highlight}> tomar notas</span>
                    </h2>
                    <p className={styles.description}>
                        VisualNote combina la potencia de un editor profesional con la simplicidad 
                        de una aplicación moderna, potenciada por inteligencia artificial.
                    </p>
                </div>

                <div className={styles.grid}>
                    {features.map((feature) => (
                        <div key={feature.id} className={styles.card}>
                            <div className={styles.cardIcon}>
                                {feature.icon}
                            </div>
                            <h3 className={styles.cardTitle}>{feature.title}</h3>
                            <p className={styles.cardDescription}>{feature.description}</p>
                            <ul className={styles.cardDetails}>
                                {feature.details.map((detail, index) => (
                                    <li key={index} className={styles.cardDetail}>
                                        <span className={styles.checkIcon}>✓</span>
                                        {detail}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Features;