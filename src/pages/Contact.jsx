import { useState } from 'react';
import styles from './Pages.module.css';

function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);
    const [submitMessage, setSubmitMessage] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        const form = e.target;
        const formData = new FormData(form);
        
        try {
            const response = await fetch(form.action, {
                method: form.method,
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                setSubmitStatus('success');
                setSubmitMessage('¡Mensaje enviado correctamente! Te responderemos pronto a pimenta.studio.cr@gmail.com');
                form.reset();
                setFormData({ name: '', email: '', subject: '', message: '' });
            } else {
                setSubmitStatus('error');
                setSubmitMessage('Error al enviar el mensaje. Por favor intenta de nuevo.');
            }
        } catch (error) {
            setSubmitStatus('error');
            setSubmitMessage('Error de conexión. Por favor intenta de nuevo.');
        } finally {
            setIsSubmitting(false);
            
            setTimeout(() => {
                setSubmitStatus(null);
                setSubmitMessage('');
            }, 5000);
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.badge}>
                        <span className={styles.badgeText}>📧 Contacto</span>
                    </div>
                    <h1 className={styles.title}>
                        Ponte en <span className={styles.highlight}>contacto</span>
                    </h1>
                    <p className={styles.description}>
                        ¿Tienes alguna pregunta, sugerencia o necesitas ayuda? 
                        ¿Necesitas desarrollar un proyecto personalizado, una plataforma web o una aplicación?
                        Estamos aquí para ayudarte. Envíanos un mensaje y te responderemos pronto.
                    </p>
                </div>

                <div className={styles.contactContent}>
                    <div className={styles.contactInfo}>
                        <div className={styles.contactCard}>
                            <div className={styles.contactIcon}>📧</div>
                            <h3>Email</h3>
                            <p>pimenta.studio.cr@gmail.com</p>
                        </div>
                        
                        <div className={styles.contactCard}>
                            <div className={styles.contactIcon}>🐛</div>
                            <h3>Reportar bug</h3>
                            <p>pimenta.studio.cr@gmail.com</p>
                        </div>
                    </div>

                    <form 
                        className={styles.contactForm} 
                        action="https://formspree.io/f/xgonrwwr"
                        method="POST"
                        onSubmit={handleSubmit}
                    >
                        <div className={styles.formGroup}>
                            <label htmlFor="name">Nombre completo</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="Tu nombre"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="tu@email.com"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="subject">Asunto</label>
                            <select
                                id="subject"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Selecciona un asunto</option>
                                <option value="Consulta general">Consulta general</option>
                                <option value="Cotizar proyecto">Cotizar proyecto</option>
                                <option value="Reportar error">Reportar error</option>
                                <option value="Solicitar función">Solicitar función</option>
                                <option value="Soporte técnico">Soporte técnico</option>
                                <option value="Consulta comercial">Consulta comercial</option>
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="message">Mensaje</label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                placeholder="Cuéntanos cómo podemos ayudarte..."
                                rows="5"
                            ></textarea>
                        </div>

                        {/* Campo oculto para identificar que viene de VisualNote */}
                        <input type="hidden" name="_subject" value={`VisualNote - ${formData.subject}`} />
                        <input type="hidden" name="_replyto" value={formData.email} />

                        <button 
                            type="submit" 
                            className={styles.submitBtn}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <span className={styles.spinner}></span>
                                    Enviando...
                                </>
                            ) : (
                                <>
                                    <span>Enviar mensaje</span>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </>
                            )}
                        </button>

                        {submitStatus === 'success' && (
                            <div className={styles.successMessage}>
                                <span className={styles.successIcon}>✅</span>
                                {submitMessage}
                            </div>
                        )}

                        {submitStatus === 'error' && (
                            <div className={styles.errorMessage}>
                                <span className={styles.errorIcon}>❌</span>
                                {submitMessage}
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Contact;