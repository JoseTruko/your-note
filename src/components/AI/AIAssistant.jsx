import React, { useState, useRef, useEffect } from 'react';
import { callOpenAI, getFallbackResponse, isAPIConfigured as checkAPIConfigured } from '../../services/aiService';
import styles from './AIAssistant.module.css';

const AIAssistant = ({ selectedText, onTextReplace, onTextInsert }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('tools');
    const [isLoading, setIsLoading] = useState(false);
    const [chatMessages, setChatMessages] = useState([
        {
            role: 'assistant',
            content: '¡Hola! Soy tu asistente de IA. Puedo ayudarte a mejorar tu texto, resumir contenido, corregir errores y mucho más. ¿En qué puedo ayudarte?'
        }
    ]);
    const [chatInput, setChatInput] = useState('');
    const [isAPIConfigured, setIsAPIConfigured] = useState(false);
    const chatEndRef = useRef(null);

    // Verificar configuración de API al montar el componente
    useEffect(() => {
        try {
            const configured = checkAPIConfigured();
            setIsAPIConfigured(configured);
            
            if (!configured) {
                console.log(`
🤖 CONFIGURACIÓN DE IA REAL:

Para usar IA real con OpenAI, sigue estos pasos:

1. Ve a https://platform.openai.com/api-keys
2. Crea una cuenta o inicia sesión
3. Genera una nueva API key
4. Crea un archivo .env en la raíz del proyecto
5. Añade: VITE_OPENAI_API_KEY=tu_api_key_aqui
6. Reinicia el servidor de desarrollo

¡Después tendrás IA real funcionando!
                `);
            }
        } catch (error) {
            console.log('Error verificando configuración de API:', error);
            setIsAPIConfigured(false);
        }
    }, []);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    // Handle Escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden'; // Prevent background scroll
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Llamada real a OpenAI API
    const callAI = async (prompt, context = '') => {
        setIsLoading(true);
        
        try {
            let result;
            
            if (isAPIConfigured) {
                // Usar API real de OpenAI
                result = await callOpenAI(prompt, context, prompt);
            } else {
                // Usar respuesta de respaldo
                result = getFallbackResponse(prompt, context);
                // Simular delay para mejor UX
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            
            setIsLoading(false);
            return result;
            
        } catch (error) {
            console.error('Error en callAI:', error);
            setIsLoading(false);
            
            // Si hay error con la API, usar respuesta de respaldo
            try {
                const fallbackResult = getFallbackResponse(prompt, context);
                return `${fallbackResult}\n\n⚠️ Nota: Hubo un problema con la conexión de IA, se usó respuesta de respaldo.`;
            } catch (fallbackError) {
                return 'Lo siento, hubo un error procesando tu solicitud. Por favor, intenta de nuevo.';
            }
        }
    };

    const handleAIAction = async (action) => {
        if (!selectedText && action !== 'generar') {
            alert('Por favor, selecciona texto primero para usar esta función.');
            return;
        }

        try {
            const result = await callAI(action, selectedText);
            
            if (action === 'generar') {
                onTextInsert(result);
            } else {
                onTextReplace(result);
            }
            
            // Agregar al chat
            setChatMessages(prev => [
                ...prev,
                { role: 'user', content: `${action.charAt(0).toUpperCase() + action.slice(1)}: "${selectedText?.substring(0, 50)}..."` },
                { role: 'assistant', content: result }
            ]);
        } catch (error) {
            alert('Error al procesar con IA. Por favor, intenta de nuevo.');
        }
    };

    const handleChatSubmit = async (e) => {
        e.preventDefault();
        if (!chatInput.trim()) return;

        const userMessage = chatInput.trim();
        setChatInput('');
        
        setChatMessages(prev => [
            ...prev,
            { role: 'user', content: userMessage }
        ]);

        try {
            const response = await callAI('chat', userMessage);
            setChatMessages(prev => [
                ...prev,
                { role: 'assistant', content: response }
            ]);
        } catch (error) {
            setChatMessages(prev => [
                ...prev,
                { role: 'assistant', content: 'Lo siento, hubo un error. Por favor, intenta de nuevo.' }
            ]);
        }
    };

    const aiTools = [
        {
            id: 'resumir',
            name: 'Resumir',
            icon: '📋',
            description: 'Crea un resumen conciso del texto seleccionado',
            color: '#007acc'
        },
        {
            id: 'mejorar',
            name: 'Mejorar Redacción',
            icon: '✨',
            description: 'Mejora la calidad y fluidez del texto',
            color: '#28a745'
        },
        {
            id: 'corregir',
            name: 'Corregir Errores',
            icon: '🔍',
            description: 'Corrige errores ortográficos y gramaticales',
            color: '#dc3545'
        },
        {
            id: 'expandir',
            name: 'Expandir Ideas',
            icon: '🚀',
            description: 'Desarrolla y amplía las ideas del texto',
            color: '#6f42c1'
        },
        {
            id: 'simplificar',
            name: 'Simplificar',
            icon: '🎯',
            description: 'Hace el texto más claro y fácil de entender',
            color: '#fd7e14'
        },
        {
            id: 'traducir',
            name: 'Traducir',
            icon: '🌐',
            description: 'Traduce el texto a otro idioma',
            color: '#20c997'
        }
    ];

    return (
        <div className={`${styles.aiAssistant} ${isOpen ? styles.aiOpen : ''}`}>
            <button 
                className={styles.aiToggle}
                onClick={() => setIsOpen(!isOpen)}
                title="Asistente de IA"
            >
                🤖 IA
                {isOpen && <span className={styles.closeIcon}>×</span>}
            </button>

            {isOpen && (
                <>
                    <div 
                        className={styles.backdrop} 
                        onClick={() => setIsOpen(false)}
                    />
                    <div className={styles.aiPanel} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.aiHeader}>
                            <div className={styles.aiTabs}>
                                <button 
                                    className={`${styles.aiTab} ${activeTab === 'tools' ? styles.active : ''}`}
                                    onClick={() => setActiveTab('tools')}
                                >
                                    🛠 Herramientas
                                </button>
                                <button 
                                    className={`${styles.aiTab} ${activeTab === 'chat' ? styles.active : ''}`}
                                    onClick={() => setActiveTab('chat')}
                                >
                                    💬 Chat IA
                                </button>
                            </div>
                            
                            <button 
                                className={styles.closeButton}
                                onClick={() => setIsOpen(false)}
                                title="Cerrar"
                            >
                                ×
                            </button>
                        </div>

                        <div className={styles.aiContent}>
                            {activeTab === 'tools' && (
                                <div className={styles.toolsPanel}>
                                    <div className={styles.toolsHeader}>
                                        <h3>Herramientas de IA</h3>
                                        <p>
                                            {isAPIConfigured ? (
                                                <span className={styles.apiStatus}>
                                                    🟢 IA Real Conectada (OpenAI)
                                                </span>
                                            ) : (
                                                <span className={styles.apiStatus}>
                                                    🟡 Modo Offline - <a href="#" onClick={(e) => {
                                                        e.preventDefault();
                                                        console.log(`
🤖 CONFIGURACIÓN DE IA REAL:

1. Ve a https://platform.openai.com/api-keys
2. Crea una cuenta o inicia sesión  
3. Genera una nueva API key
4. Crea un archivo .env en la raíz del proyecto
5. Añade: VITE_OPENAI_API_KEY=tu_api_key_aqui
6. Reinicia el servidor de desarrollo

¡Después tendrás IA real funcionando!
                                                        `);
                                                        alert('Revisa la consola para ver las instrucciones de configuración');
                                                    }}>Configurar IA Real</a>
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                    
                                    <div className={styles.toolsGrid}>
                                        {aiTools.map(tool => (
                                            <button
                                                key={tool.id}
                                                className={styles.aiTool}
                                                onClick={() => handleAIAction(tool.id)}
                                                disabled={isLoading}
                                                style={{ '--tool-color': tool.color }}
                                            >
                                                <span className={styles.toolIcon}>{tool.icon}</span>
                                                <div className={styles.toolInfo}>
                                                    <span className={styles.toolName}>{tool.name}</span>
                                                    <span className={styles.toolDesc}>{tool.description}</span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>

                                    {selectedText && (
                                        <div className={styles.selectedText}>
                                            <h4>Texto seleccionado:</h4>
                                            <p>"{selectedText.substring(0, 100)}{selectedText.length > 100 ? '...' : ''}"</p>
                                        </div>
                                    )}

                                    {isLoading && (
                                        <div className={styles.loading}>
                                            <div className={styles.spinner}></div>
                                            <p>Procesando con IA...</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'chat' && (
                                <div className={styles.chatPanel}>
                                    <div className={styles.chatMessages}>
                                        {chatMessages.map((message, index) => (
                                            <div 
                                                key={index} 
                                                className={`${styles.chatMessage} ${styles[message.role]}`}
                                            >
                                                <div className={styles.messageContent}>
                                                    {message.content}
                                                </div>
                                            </div>
                                        ))}
                                        {isLoading && (
                                            <div className={`${styles.chatMessage} ${styles.assistant}`}>
                                                <div className={styles.messageContent}>
                                                    <div className={styles.typingIndicator}>
                                                        <span></span>
                                                        <span></span>
                                                        <span></span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        <div ref={chatEndRef} />
                                    </div>

                                    <form className={styles.chatForm} onSubmit={handleChatSubmit}>
                                        <input
                                            type="text"
                                            value={chatInput}
                                            onChange={(e) => setChatInput(e.target.value)}
                                            placeholder="Pregunta algo sobre tu texto..."
                                            className={styles.chatInput}
                                            disabled={isLoading}
                                        />
                                        <button 
                                            type="submit" 
                                            className={styles.chatSend}
                                            disabled={isLoading || !chatInput.trim()}
                                        >
                                            📤
                                        </button>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default AIAssistant;