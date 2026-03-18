import emailjs from '@emailjs/browser';

// Configuración de EmailJS usando variables de entorno
const EMAILJS_CONFIG = {
    serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_visualnote',
    templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_contact',
    publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY'
};

// Función para enviar email
export const sendContactEmail = async (formData) => {
    try {
        // Verificar que las claves estén configuradas
        if (!EMAILJS_CONFIG.serviceId || !EMAILJS_CONFIG.templateId || !EMAILJS_CONFIG.publicKey || 
            EMAILJS_CONFIG.publicKey === 'YOUR_PUBLIC_KEY') {
            throw new Error('EmailJS no está configurado correctamente');
        }

        // Preparar los datos del template
        const templateParams = {
            from_name: formData.name,
            from_email: formData.email,
            subject: getSubjectText(formData.subject),
            message: formData.message,
            to_email: 'pimenta.studio.cr@gmail.com',
            reply_to: formData.email
        };

        // Enviar email usando EmailJS
        const response = await emailjs.send(
            EMAILJS_CONFIG.serviceId,
            EMAILJS_CONFIG.templateId,
            templateParams,
            EMAILJS_CONFIG.publicKey
        );

        console.log('Email enviado exitosamente:', response);
        return { success: true, message: 'Email enviado correctamente' };
        
    } catch (error) {
        console.error('Error al enviar email:', error);
        
        if (error.message.includes('EmailJS no está configurado')) {
            return { 
                success: false, 
                message: 'Servicio de email no configurado. Contacta directamente a pimenta.studio.cr@gmail.com' 
            };
        }
        
        return { 
            success: false, 
            message: 'Error al enviar el email. Por favor intenta de nuevo o contacta directamente a pimenta.studio.cr@gmail.com' 
        };
    }
};

// Función para convertir el valor del select a texto legible
const getSubjectText = (subjectValue) => {
    const subjects = {
        'general': 'Consulta general',
        'quote': 'Cotizar proyecto',
        'bug': 'Reportar error',
        'feature': 'Solicitar función',
        'support': 'Soporte técnico',
        'business': 'Consulta comercial'
    };
    return subjects[subjectValue] || subjectValue;
};

// Función para inicializar EmailJS
export const initEmailJS = () => {
    if (EMAILJS_CONFIG.publicKey && EMAILJS_CONFIG.publicKey !== 'YOUR_PUBLIC_KEY') {
        emailjs.init(EMAILJS_CONFIG.publicKey);
    }
};