import React, { useRef, useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import AIAssistant from '../../../AI/AIAssistant';
import styles from './Editor.module.css';

const Editor = ({ note, onContentChange }) => {
    const editorRef = useRef(null);
    const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
    const [wordCount, setWordCount] = useState(0);
    const [isEditorFocused, setIsEditorFocused] = useState(false);
    const [showDownloadMenu, setShowDownloadMenu] = useState(false);
    const [downloadMenuPosition, setDownloadMenuPosition] = useState({ top: 0, left: 0 });
    const downloadButtonRef = useRef(null);
    const [selectedText, setSelectedText] = useState('');

    useEffect(() => {
        if (editorRef.current && note.content !== editorRef.current.innerHTML) {
            editorRef.current.innerHTML = note.content;
            updateWordCount();
        }
    }, [note.content]);

    // Track text selection for AI
    useEffect(() => {
        const handleSelectionChange = () => {
            const selection = window.getSelection();
            if (selection.rangeCount > 0 && !selection.isCollapsed) {
                const selected = selection.toString().trim();
                setSelectedText(selected);
            } else {
                setSelectedText('');
            }
        };

        document.addEventListener('selectionchange', handleSelectionChange);
        return () => document.removeEventListener('selectionchange', handleSelectionChange);
    }, []);

    // Close download menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest(`.${styles.downloadGroup}`)) {
                setShowDownloadMenu(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const updateWordCount = () => {
        if (editorRef.current) {
            const text = editorRef.current.innerText || '';
            const words = text.trim().split(/\s+/).filter(word => word.length > 0);
            setWordCount(words.length);
        }
    };

    const handleInput = () => {
        if (editorRef.current) {
            const content = editorRef.current.innerHTML;
            onContentChange(note.id, content);
            updateWordCount();
        }
    };

    const handleKeyDown = (e) => {
        // Handle Tab key
        if (e.key === 'Tab') {
            e.preventDefault();
            document.execCommand('insertHTML', false, '&nbsp;&nbsp;&nbsp;&nbsp;');
        }
    };

    const executeCommand = (command, value = null) => {
        editorRef.current.focus();
        document.execCommand(command, false, value);
        handleInput();
    };

    const insertList = (type) => {
        editorRef.current.focus();
        if (type === 'ordered') {
            document.execCommand('insertOrderedList', false, null);
        } else {
            document.execCommand('insertUnorderedList', false, null);
        }
        handleInput();
    };

    const insertLink = () => {
        const url = prompt('Ingresa la URL:');
        if (url) {
            executeCommand('createLink', url);
        }
    };

    const insertImage = () => {
        const url = prompt('Ingresa la URL de la imagen:');
        if (url) {
            executeCommand('insertImage', url);
        }
    };

    const formatBlock = (tag) => {
        executeCommand('formatBlock', tag);
    };

    const changeFontSize = (size) => {
        executeCommand('fontSize', size);
    };

    const changeTextColor = (color) => {
        executeCommand('foreColor', color);
    };

    const changeBackgroundColor = (color) => {
        executeCommand('backColor', color);
    };

    const insertBlockquote = () => {
        executeCommand('formatBlock', 'blockquote');
    };

    const cleanFormat = () => {
        const selection = window.getSelection();
        
        if (selection.rangeCount > 0 && !selection.isCollapsed) {
            // Si hay texto seleccionado, limpiar solo la selección
            try {
                // Primero intentar con removeFormat nativo
                executeCommand('removeFormat');
                
                // Luego limpiar elementos de bloque manualmente
                const range = selection.getRangeAt(0);
                const container = range.commonAncestorContainer;
                
                // Si el contenedor es un elemento, buscar elementos con formato
                if (container.nodeType === Node.ELEMENT_NODE) {
                    const formattedElements = container.querySelectorAll('h1, h2, h3, h4, h5, h6, blockquote, pre, code');
                    formattedElements.forEach(element => {
                        if (selection.containsNode(element, true)) {
                            const textNode = document.createTextNode(element.textContent);
                            element.parentNode.replaceChild(textNode, element);
                        }
                    });
                }
                
                handleInput();
            } catch (error) {
                console.log('Error limpiando formato:', error);
                // Fallback: reemplazar con texto plano
                const selectedText = selection.toString();
                if (selectedText) {
                    executeCommand('insertText', selectedText);
                }
            }
        } else {
            // Si no hay selección, preguntar si quiere limpiar todo el documento
            const confirmClean = window.confirm(
                '¿Deseas limpiar todo el formato del documento?\n\nEsto mantendrá el texto pero eliminará:\n• Negritas, cursivas, subrayados\n• Colores de texto y fondo\n• Encabezados (H1, H2, etc.)\n• Listas y citas\n• Todos los estilos de formato'
            );
            
            if (confirmClean) {
                try {
                    // Obtener texto plano
                    const plainText = getPlainText(editorRef.current.innerHTML);
                    
                    // Dividir en párrafos (mantener saltos de línea como párrafos)
                    const paragraphs = plainText
                        .split(/\n\s*\n/) // Dividir por dobles saltos de línea
                        .map(p => p.trim())
                        .filter(p => p.length > 0);
                    
                    // Crear HTML limpio con párrafos
                    const cleanHTML = paragraphs
                        .map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`)
                        .join('');
                    
                    // Aplicar el contenido limpio
                    editorRef.current.innerHTML = cleanHTML || '<p><br></p>';
                    
                    // Colocar cursor al final
                    const range = document.createRange();
                    const selection = window.getSelection();
                    range.selectNodeContents(editorRef.current);
                    range.collapse(false);
                    selection.removeAllRanges();
                    selection.addRange(range);
                    
                    handleInput();
                } catch (error) {
                    console.log('Error limpiando documento:', error);
                    alert('Hubo un error al limpiar el formato. Por favor, intenta de nuevo.');
                }
            }
        }
    };

    // Función para limpiar HTML y obtener texto plano
    const getPlainText = (html) => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        return tempDiv.textContent || tempDiv.innerText || '';
    };

    // Función para descargar como TXT
    const downloadAsTXT = () => {
        const plainText = getPlainText(note.content);
        const blob = new Blob([plainText], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${note.title.replace('.md', '')}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        setShowDownloadMenu(false);
    };

    // Función para descargar como PDF
    const downloadAsPDF = () => {
        const pdf = new jsPDF();
        const plainText = getPlainText(note.content);
        
        // Configuración del PDF
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 20;
        const maxWidth = pageWidth - (margin * 2);
        const lineHeight = 7;
        let yPosition = margin;

        // Título del documento
        pdf.setFontSize(16);
        pdf.setFont(undefined, 'bold');
        const title = note.title.replace('.md', '');
        pdf.text(title, margin, yPosition);
        yPosition += lineHeight * 2;

        // Contenido del documento
        pdf.setFontSize(12);
        pdf.setFont(undefined, 'normal');
        
        // Dividir el texto en líneas que quepan en la página
        const lines = pdf.splitTextToSize(plainText, maxWidth);
        
        lines.forEach((line) => {
            // Verificar si necesitamos una nueva página
            if (yPosition + lineHeight > pageHeight - margin) {
                pdf.addPage();
                yPosition = margin;
            }
            
            pdf.text(line, margin, yPosition);
            yPosition += lineHeight;
        });

        // Agregar información del pie de página
        const totalPages = pdf.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            pdf.setPage(i);
            pdf.setFontSize(8);
            pdf.setTextColor(128, 128, 128);
            pdf.text(
                `Página ${i} de ${totalPages} - Generado por VisualNote`,
                margin,
                pageHeight - 10
            );
        }

        // Descargar el PDF
        pdf.save(`${title}.pdf`);
        setShowDownloadMenu(false);
    };

    // AI Functions
    const handleAITextReplace = (newText) => {
        const selection = window.getSelection();
        if (selection.rangeCount > 0 && !selection.isCollapsed) {
            const range = selection.getRangeAt(0);
            range.deleteContents();
            range.insertNode(document.createTextNode(newText));
            handleInput();
        }
    };

    const handleAITextInsert = (text) => {
        editorRef.current.focus();
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            range.collapse(false);
            range.insertNode(document.createTextNode('\n\n' + text));
            handleInput();
        }
    };

    const toggleDownloadMenu = () => {
        if (!showDownloadMenu && downloadButtonRef.current) {
            const rect = downloadButtonRef.current.getBoundingClientRect();
            setDownloadMenuPosition({
                top: rect.bottom + 4,
                left: rect.left
            });
        }
        setShowDownloadMenu(!showDownloadMenu);
    };

    const getLanguageFromFilename = (filename) => {
        const ext = filename.split('.').pop()?.toLowerCase();
        const languageMap = {
            'md': 'markdown',
            'js': 'javascript',
            'jsx': 'javascript',
            'ts': 'typescript',
            'tsx': 'typescript',
            'css': 'css',
            'html': 'html',
            'json': 'json',
            'py': 'python',
            'txt': 'plaintext'
        };
        return languageMap[ext] || 'plaintext';
    };

    return (
        <div className={styles.editor}>
            {/* Custom Toolbar */}
            <div className={styles.toolbar}>
                {/* Headers */}
                <div className={styles.toolGroup}>
                    <select 
                        className={styles.headerSelect}
                        onChange={(e) => formatBlock(e.target.value)}
                        defaultValue=""
                    >
                        <option value="">Párrafo</option>
                        <option value="h1">Título 1</option>
                        <option value="h2">Título 2</option>
                        <option value="h3">Título 3</option>
                        <option value="h4">Título 4</option>
                        <option value="h5">Título 5</option>
                        <option value="h6">Título 6</option>
                    </select>
                </div>

                {/* Font Size */}
                <div className={styles.toolGroup}>
                    <select 
                        className={styles.sizeSelect}
                        onChange={(e) => changeFontSize(e.target.value)}
                        defaultValue="3"
                    >
                        <option value="1">Pequeño</option>
                        <option value="3">Normal</option>
                        <option value="5">Grande</option>
                        <option value="7">Enorme</option>
                    </select>
                </div>

                {/* Basic Formatting */}
                <div className={styles.toolGroup}>
                    <button 
                        className={styles.toolButton}
                        onClick={() => executeCommand('bold')}
                        title="Negrita"
                    >
                        <strong>B</strong>
                    </button>
                    <button 
                        className={styles.toolButton}
                        onClick={() => executeCommand('italic')}
                        title="Cursiva"
                    >
                        <em>I</em>
                    </button>
                    <button 
                        className={styles.toolButton}
                        onClick={() => executeCommand('underline')}
                        title="Subrayado"
                    >
                        <u>U</u>
                    </button>
                    <button 
                        className={styles.toolButton}
                        onClick={() => executeCommand('strikeThrough')}
                        title="Tachado"
                    >
                        <s>S</s>
                    </button>
                </div>

                {/* Colors */}
                <div className={styles.toolGroup}>
                    <input
                        type="color"
                        className={styles.colorPicker}
                        onChange={(e) => changeTextColor(e.target.value)}
                        title="Color de texto"
                    />
                    <input
                        type="color"
                        className={styles.colorPicker}
                        onChange={(e) => changeBackgroundColor(e.target.value)}
                        title="Color de fondo"
                    />
                </div>

                {/* Lists */}
                <div className={styles.toolGroup}>
                    <button 
                        className={styles.toolButton}
                        onClick={() => insertList('unordered')}
                        title="Lista con viñetas"
                    >
                        • Lista
                    </button>
                    <button 
                        className={styles.toolButton}
                        onClick={() => insertList('ordered')}
                        title="Lista numerada"
                    >
                        1. Lista
                    </button>
                </div>

                {/* Alignment */}
                <div className={styles.toolGroup}>
                    <button 
                        className={styles.toolButton}
                        onClick={() => executeCommand('justifyLeft')}
                        title="Alinear izquierda"
                    >
                        ⬅
                    </button>
                    <button 
                        className={styles.toolButton}
                        onClick={() => executeCommand('justifyCenter')}
                        title="Centrar"
                    >
                        ↔
                    </button>
                    <button 
                        className={styles.toolButton}
                        onClick={() => executeCommand('justifyRight')}
                        title="Alinear derecha"
                    >
                        ➡
                    </button>
                </div>

                {/* Special */}
                <div className={styles.toolGroup}>
                    <button 
                        className={styles.toolButton}
                        onClick={insertBlockquote}
                        title="Cita"
                    >
                        " Cita
                    </button>
                    <button 
                        className={styles.toolButton}
                        onClick={insertLink}
                        title="Insertar enlace"
                    >
                        🔗 Link
                    </button>
                    <button 
                        className={styles.toolButton}
                        onClick={insertImage}
                        title="Insertar imagen"
                    >
                        🖼 Img
                    </button>
                </div>

                {/* AI Assistant - Disabled */}
                <div className={styles.toolGroup}>
                    <button 
                        className={`${styles.toolButton} ${styles.disabledButton}`}
                        disabled={true}
                        title="Funcionalidad en construcción"
                    >
                        🤖 IA
                        <span className={styles.constructionBadge}>En construcción</span>
                    </button>
                </div>

                {/* Download Menu */}
                <div className={`${styles.toolGroup} ${styles.downloadGroup}`}>
                    <button 
                        ref={downloadButtonRef}
                        className={styles.downloadButton}
                        onClick={toggleDownloadMenu}
                        title="Descargar nota"
                    >
                        📥 Descargar
                        <span className={styles.dropdownArrow}>▼</span>
                    </button>
                    
                    {showDownloadMenu && (
                        <div 
                            className={styles.downloadMenu}
                            style={{
                                top: `${downloadMenuPosition.top}px`,
                                left: `${downloadMenuPosition.left}px`
                            }}
                        >
                            <div className={styles.downloadMenuHeader}>
                                Descargar como:
                            </div>
                            <button 
                                className={styles.downloadOption}
                                onClick={downloadAsTXT}
                            >
                                <span className={styles.optionIcon}>📄</span>
                                <div className={styles.optionInfo}>
                                    <span className={styles.optionTitle}>Archivo de Texto</span>
                                    <span className={styles.optionDesc}>Formato .txt sin formato</span>
                                </div>
                            </button>
                            <button 
                                className={styles.downloadOption}
                                onClick={downloadAsPDF}
                            >
                                <span className={styles.optionIcon}>📋</span>
                                <div className={styles.optionInfo}>
                                    <span className={styles.optionTitle}>Documento PDF</span>
                                    <span className={styles.optionDesc}>Formato profesional</span>
                                </div>
                            </button>
                        </div>
                    )}
                </div>

                {/* Utilities */}
                <div className={styles.toolGroup}>
                    <button 
                        className={styles.toolButton}
                        onClick={cleanFormat}
                        title="Limpiar formato del texto seleccionado o todo el documento"
                    >
                        🧹 Limpiar
                    </button>
                </div>
            </div>

            {/* Editor Content */}
            <div className={styles.editorContent}>
                <div
                    ref={editorRef}
                    className={styles.editableArea}
                    contentEditable
                    onInput={handleInput}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsEditorFocused(true)}
                    onBlur={() => setIsEditorFocused(false)}
                    suppressContentEditableWarning={true}
                    style={{ outline: 'none' }}
                />
            </div>
            
            {/* Status Info */}
            <div className={styles.editorFooter}>
                <div className={styles.statusInfo}>
                    <span className={styles.breadcrumb}>
                        📁 MIS NOTAS › {note.title}
                    </span>
                    <div className={styles.editorStats}>
                        <span className={styles.wordCount}>{wordCount} palabras</span>
                        {selectedText && (
                            <span className={styles.selectedCount}>
                                {selectedText.length} caracteres seleccionados
                            </span>
                        )}
                        <span className={styles.language}>{getLanguageFromFilename(note.title)}</span>
                        <span className={styles.encoding}>UTF-8</span>
                        <span className={styles.status}>
                            {isEditorFocused ? 'Editando...' : 'Listo'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Editor;