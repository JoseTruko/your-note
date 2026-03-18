# 🤖 Configuración de IA Real para VisualNote

## ¿Qué es esto?

VisualNote ahora incluye integración con **OpenAI (ChatGPT)** para proporcionar herramientas de IA reales que pueden:

- 📋 **Resumir** textos largos de manera inteligente
- ✨ **Mejorar** la redacción y estilo
- 🔍 **Corregir** errores ortográficos y gramaticales
- 🚀 **Expandir** ideas con contenido relevante
- 🎯 **Simplificar** textos complejos
- 🌐 **Traducir** del español al inglés
- 💬 **Chat** inteligente para consultas sobre texto

## 🚀 Configuración Rápida

### Paso 1: Obtener API Key de OpenAI

1. Ve a [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Crea una cuenta o inicia sesión
3. Haz clic en "Create new secret key"
4. Copia la API key (empieza con `sk-proj-...`)

### Paso 2: Configurar en el Proyecto

1. En la carpeta raíz del proyecto (`your-note-project/`), crea un archivo llamado `.env`
2. Añade tu API key:

```env
VITE_OPENAI_API_KEY=sk-proj-tu_api_key_aqui
```

### Paso 3: Reiniciar el Servidor

```bash
npm run dev
```

## ✅ Verificar que Funciona

1. Abre la aplicación en el navegador
2. Haz clic en el botón "🤖 IA" en la barra de herramientas
3. Deberías ver "🟢 IA Real Conectada (OpenAI)" en lugar de "🟡 Modo Offline"

## 💰 Costos

- OpenAI cobra por uso (muy económico para uso personal)
- GPT-3.5-turbo cuesta aproximadamente $0.002 por 1000 tokens
- Una conversación típica usa 100-500 tokens
- **Costo estimado:** $0.0002-0.001 por consulta (menos de 1 centavo)

## 🔒 Seguridad

- **NUNCA** compartas tu API key públicamente
- El archivo `.env` está en `.gitignore` para proteger tu key
- En producción, usa variables de entorno del servidor

## 🛠 Solución de Problemas

### "Modo Offline" sigue apareciendo
- Verifica que el archivo `.env` esté en la carpeta correcta
- Asegúrate de que la variable se llame exactamente `VITE_OPENAI_API_KEY`
- Reinicia el servidor de desarrollo

### Error de API Key inválida
- Verifica que copiaste la key completa
- Asegúrate de que la key no haya expirado
- Revisa que tengas créditos en tu cuenta de OpenAI

### Error de cuota excedida
- Verifica tu límite de uso en OpenAI
- Añade un método de pago si es necesario
- Espera a que se renueve tu cuota mensual

## 🎯 Uso Recomendado

1. **Para resumir:** Selecciona párrafos largos y usa "📋 Resumir"
2. **Para mejorar:** Selecciona texto que quieras hacer más elegante
3. **Para corregir:** Selecciona texto con posibles errores
4. **Para chat:** Haz preguntas específicas sobre tu texto

## 🔄 Modo Offline

Si no configuras la API key, la aplicación funciona en "Modo Offline" con:
- Simulaciones básicas de las herramientas
- Respuestas predefinidas en el chat
- Funcionalidad limitada pero útil para pruebas

---

**¡Disfruta de tu editor con IA real integrada!** 🚀