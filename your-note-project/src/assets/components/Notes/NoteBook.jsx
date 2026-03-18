import React, { useEffect, useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import styles from "./Notebook.module.css";

const NoteEditor = () => {
    const editorRef = useRef(null);
    const quillRef = useRef(null);
    const [noteTitle, setNoteTitle] = useState("Nota sin título");
    const [wordCount, setWordCount] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        if (quillRef.current) return;

        // Configuración personalizada del toolbar
        const toolbarOptions = [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'font': [] }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'script': 'sub'}, { 'script': 'super' }],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'indent': '-1'}, { 'indent': '+1' }],
            [{ 'align': [] }],
            ['blockquote', 'code-block'],
            ['link', 'image', 'video'],
            ['clean']
        ];

        quillRef.current = new Quill(editorRef.current, {
            theme: 'snow',
            modules: {
                toolbar: toolbarOptions,
                history: {
                    delay: 1000,
                    maxStack: 50,
                    userOnly: true
                }
            },
            placeholder: 'Comienza a escribir tu nota aquí...',
        });

        // Contenido inicial
        quillRef.current.root.innerHTML = `
            <h2>¡Bienvenido a VisualNote!</h2>
            <p>Este es tu espacio para crear notas increíbles. Puedes:</p>
            <ul>
                <li><strong>Formatear texto</strong> con estilos ricos</li>
                <li><em>Organizar ideas</em> con listas y encabezados</li>
                <li>Insertar <a href="#">enlaces</a> e imágenes</li>
                <li>Usar bloques de código para snippets</li>
            </ul>
            <blockquote>
                "La creatividad es la inteligencia divirtiéndose" - Albert Einstein
            </blockquote>
        `;

        // Listener para contar palabras
        quillRef.current.on('text-change', () => {
            const text = quillRef.current.getText();
            const words = text.trim().split(/\s+/).filter(word => word.length > 0);
            setWordCount(words.length);
        });

        // Contar palabras iniciales
        const initialText = quillRef.current.getText();
        const initialWords = initialText.trim().split(/\s+/).filter(word => word.length > 0);
        setWordCount(initialWords.length);

        return () => {
            if (quillRef.current) {
                quillRef.current = null;
            }
        };
    }, []);

    const handleSave = () => {
        if (quillRef.current) {
            const content = quillRef.current.getContents();
            localStorage.setItem('visualnote-content', JSON.stringify(content));
            localStorage.setItem('visualnote-title', noteTitle);
            alert('Nota guardada exitosamente!');
        }
    };

    const handleLoad = () => {
        const savedContent = localStorage.getItem('visualnote-content');
        const savedTitle = localStorage.getItem('visualnote-title');
        
        if (savedContent && quillRef.current) {
            quillRef.current.setContents(JSON.parse(savedContent));
            if (savedTitle) {
                setNoteTitle(savedTitle);
            }
        }
    };

    const handleExport = () => {
        if (quillRef.current) {
            const html = quillRef.current.root.innerHTML;
            const blob = new Blob([html], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${noteTitle}.html`;
            a.click();
            URL.revokeObjectURL(url);
        }
    };

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
    };

    return (
        <div className={`${styles.editorContainer} ${isFullscreen ? styles.fullscreen : ''}`}>
            {/* Header del editor */}
            <div className={styles.editorHeader}>
                <div className={styles.titleSection}>
                    <input
                        type="text"
                        value={noteTitle}
                        onChange={(e) => setNoteTitle(e.target.value)}
                        className={styles.titleInput}
                        placeholder="Título de la nota"
                    />
                    <span className={styles.wordCount}>{wordCount} palabras</span>
                </div>
                
                <div className={styles.editorActions}>
                    <button onClick={handleLoad} className={styles.actionBtn} title="Cargar nota guardada">
                        📂
                    </button>
                    <button onClick={handleSave} className={styles.actionBtn} title="Guardar nota">
                        💾
                    </button>
                    <button onClick={handleExport} className={styles.actionBtn} title="Exportar como HTML">
                        📤
                    </button>
                    <button onClick={toggleFullscreen} className={styles.actionBtn} title="Pantalla completa">
                        {isFullscreen ? '🗗' : '🗖'}
                    </button>
                </div>
            </div>

            {/* Editor */}
            <div className={styles.editorWrapper}>
                <div ref={editorRef} className={styles.editor} />
            </div>

            {/* Footer del editor */}
            <div className={styles.editorFooter}>
                <div className={styles.statusInfo}>
                    <span>Última modificación: {new Date().toLocaleTimeString()}</span>
                </div>
            </div>
        </div>
    );
};

export default NoteEditor;
