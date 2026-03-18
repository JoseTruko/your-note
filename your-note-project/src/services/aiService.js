import OpenAI from 'openai';

// Configuración de OpenAI - solo inicializar si hay API key
let openai = null;

const initializeOpenAI = () => {
    if (import.meta.env.VITE_OPENAI_API_KEY && !openai) {
        openai = new OpenAI({
            apiKey: import.meta.env.VITE_OPENAI_API_KEY,
            dangerouslyAllowBrowser: true // Solo para desarrollo, en producción usar backend
        });
    }
    return openai;
};

// Función principal para llamar a OpenAI
export const callOpenAI = async (prompt, context = '', type = 'chat') => {
    try {
        // Verificar si hay API key
        if (!import.meta.env.VITE_OPENAI_API_KEY) {
            throw new Error('API_KEY_MISSING');
        }

        // Inicializar OpenAI solo cuando sea necesario
        const openaiClient = initializeOpenAI();
        if (!openaiClient) {
            throw new Error('API_KEY_MISSING');
        }

        let systemPrompt = '';
        let userPrompt = '';

        switch (type) {
            case 'resumir':
                systemPrompt = 'Eres un experto en resumir textos. Crea resúmenes concisos y útiles que capturen los puntos más importantes del texto.';
                userPrompt = `Por favor, resume el siguiente texto de manera clara y concisa, destacando los puntos más importantes:\n\n${context}`;
                break;

            case 'mejorar':
                systemPrompt = 'Eres un experto en redacción y estilo. Mejora la calidad, fluidez y elegancia del texto manteniendo su significado original.';
                userPrompt = `Por favor, mejora la redacción del siguiente texto, haciéndolo más fluido, elegante y profesional:\n\n${context}`;
                break;

            case 'corregir':
                systemPrompt = 'Eres un corrector experto en español. Corrige errores ortográficos, gramaticales y de puntuación.';
                userPrompt = `Por favor, corrige todos los errores ortográficos, gramaticales y de puntuación en el siguiente texto:\n\n${context}`;
                break;

            case 'expandir':
                systemPrompt = 'Eres un experto en desarrollo de ideas. Expande y enriquece el contenido añadiendo detalles relevantes, ejemplos y perspectivas adicionales.';
                userPrompt = `Por favor, expande las siguientes ideas añadiendo más detalles, ejemplos y perspectivas relevantes:\n\n${context}`;
                break;

            case 'simplificar':
                systemPrompt = 'Eres un experto en comunicación clara. Simplifica textos complejos haciéndolos más fáciles de entender sin perder información importante.';
                userPrompt = `Por favor, simplifica el siguiente texto haciéndolo más claro y fácil de entender:\n\n${context}`;
                break;

            case 'traducir':
                systemPrompt = 'Eres un traductor experto. Traduce textos del español al inglés de manera precisa y natural.';
                userPrompt = `Por favor, traduce el siguiente texto del español al inglés de manera precisa y natural:\n\n${context}`;
                break;

            case 'chat':
            default:
                systemPrompt = 'Eres un asistente de IA especializado en ayudar con tareas de escritura y edición de texto. Eres útil, amigable y das respuestas claras y concisas en español.';
                userPrompt = context || prompt;
                break;
        }

        const completion = await openaiClient.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            max_tokens: 1000,
            temperature: 0.7,
        });

        return completion.choices[0].message.content;

    } catch (error) {
        console.error('Error calling OpenAI:', error);
        
        if (error.message === 'API_KEY_MISSING') {
            return 'Para usar IA real, necesitas configurar tu API key de OpenAI. Ve a las instrucciones en la consola para configurarla.';
        }
        
        if (error.code === 'insufficient_quota') {
            return 'Has excedido tu cuota de OpenAI. Por favor, verifica tu cuenta o espera a que se renueve.';
        }
        
        if (error.code === 'invalid_api_key') {
            return 'La API key de OpenAI no es válida. Por favor, verifica tu configuración.';
        }
        
        return `Error al conectar con IA: ${error.message}. Usando respuesta de respaldo.`;
    }
};

// Función de respaldo con simulación mejorada (para cuando no hay API key)
export const getFallbackResponse = (type, context) => {
    const responses = {
        'resumir': `**📋 Resumen (modo offline):**\n\n${context.substring(0, 150)}...\n\n**Puntos clave identificados:**\n• Tema principal del texto\n• Ideas centrales mencionadas\n• Conclusiones relevantes\n\n*Para obtener resúmenes más precisos, configura tu API key de OpenAI.*`,
        
        'mejorar': `**✨ Versión mejorada (modo offline):**\n\n${context.replace(/\b(muy|bastante)\b/g, 'considerablemente').replace(/\b(bueno|malo)\b/g, match => match === 'bueno' ? 'excelente' : 'deficiente')}\n\n*Para mejoras más sofisticadas, configura tu API key de OpenAI.*`,
        
        'corregir': `**🔍 Texto revisado (modo offline):**\n\n${context.replace(/\s+/g, ' ').trim()}\n\n**Nota:** Revisión básica aplicada.\n*Para corrección avanzada, configura tu API key de OpenAI.*`,
        
        'expandir': `**🚀 Ideas expandidas (modo offline):**\n\n${context}\n\nAdemás, este tema presenta múltiples dimensiones que merecen análisis adicional. Las implicaciones a largo plazo y las conexiones con otros aspectos relevantes enriquecen la comprensión del tema.\n\n*Para expansiones más detalladas, configura tu API key de OpenAI.*`,
        
        'simplificar': `**🎯 Versión simplificada (modo offline):**\n\n${context.replace(/\b(utilizar|implementar)\b/g, match => match === 'utilizar' ? 'usar' : 'aplicar')}\n\n*Para simplificación avanzada, configura tu API key de OpenAI.*`,
        
        'traducir': `**🌐 Traducción básica (modo offline):**\n\n[Traducción básica del texto]\n\n*Para traducción precisa, configura tu API key de OpenAI.*`,
        
        'chat': 'Hola! Actualmente estoy en modo offline. Para obtener respuestas de IA real, necesitas configurar tu API key de OpenAI. ¿Te gustaría que te explique cómo hacerlo?'
    };
    
    return responses[type] || responses['chat'];
};

// Función para verificar si la API está configurada
export const isAPIConfigured = () => {
    return !!import.meta.env.VITE_OPENAI_API_KEY;
};