# Configuración de EmailJS para VisualNote

## Pasos para configurar el envío de emails:

### 1. Crear cuenta en EmailJS
1. Ve a [https://www.emailjs.com/](https://www.emailjs.com/)
2. Crea una cuenta gratuita
3. Verifica tu email

### 2. Configurar servicio de email
1. En el dashboard, ve a "Email Services"
2. Haz clic en "Add New Service"
3. Selecciona "Gmail" (recomendado)
4. Conecta tu cuenta `pimenta.studio.cr@gmail.com`
5. Copia el **Service ID** (ej: `service_abc123`)

### 3. Crear template de email
1. Ve a "Email Templates"
2. Haz clic en "Create New Template"
3. Usa este template:

```
Asunto: Nuevo mensaje de contacto - {{subject}}

De: {{from_name}} ({{from_email}})
Asunto: {{subject}}

Mensaje:
{{message}}

---
Este mensaje fue enviado desde el formulario de contacto de VisualNote.
Responder a: {{reply_to}}
```

4. Copia el **Template ID** (ej: `template_xyz789`)

### 4. Obtener Public Key
1. Ve a "Account" > "General"
2. Copia tu **Public Key** (ej: `user_abc123xyz`)

### 5. Configurar variables de entorno
1. Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_EMAILJS_SERVICE_ID=tu_service_id
VITE_EMAILJS_TEMPLATE_ID=tu_template_id  
VITE_EMAILJS_PUBLIC_KEY=tu_public_key
```

2. Reemplaza los valores con los que obtuviste de EmailJS

### 6. Reiniciar el servidor
```bash
npm run dev
```

## ✅ Verificación
- Los emails deberían llegar a `pimenta.studio.cr@gmail.com`
- Si hay errores, revisa la consola del navegador
- El plan gratuito permite 200 emails/mes

## 🔒 Seguridad
- Las claves están en el frontend (es normal con EmailJS)
- EmailJS maneja la seguridad del envío
- No expongas credenciales sensibles

## 📧 Template Variables
El template recibe estas variables:
- `{{from_name}}` - Nombre del remitente
- `{{from_email}}` - Email del remitente  
- `{{subject}}` - Asunto seleccionado
- `{{message}}` - Mensaje del formulario
- `{{reply_to}}` - Email para responder