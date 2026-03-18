import React from 'react';
import TabBar from './TabBar/TabBar';
import Editor from './Editor/Editor';
import styles from './EditorArea.module.css';

const EditorArea = ({
    activeNotes,
    currentNoteId,
    onNoteSelect,
    onNoteClose,
    onContentChange,
    onNewNote,
    onOpenNotes,
    onOpenNote,
    notes
}) => {
    const currentNote = activeNotes.find(note => note.id === currentNoteId);

    // Obtener las notas más recientes (últimas 3 modificadas)
    const recentNotes = notes
        .sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified))
        .slice(0, 3);

    const handleNoteClick = (noteId) => {
        onOpenNote(noteId);
    };

    if (activeNotes.length === 0) {
        return (
            <div className={styles.editorArea}>
                <div className={styles.welcomeScreen}>
                    <div className={styles.welcomeContent}>
                        <div className={styles.logo}>
                            <span className={styles.logoIcon}>📝</span>
                            <h1 className={styles.logoText}>VisualNote</h1>
                        </div>
                        
                        <p className={styles.welcomeMessage}>
                            Tu editor de notas con la experiencia de Visual Studio Code
                        </p>
                        
                        <div className={styles.quickActions}>
                            <div className={styles.actionGroup}>
                                <h3>Empezar</h3>
                                <ul>
                                    <li>
                                        <button 
                                            className={styles.actionButton}
                                            onClick={onNewNote}
                                            title="Crear nueva nota"
                                        >
                                            <span className={styles.shortcut}>Ctrl+N</span>
                                            Nueva nota
                                        </button>
                                    </li>
                                    <li>
                                        <button 
                                            className={styles.actionButton}
                                            onClick={onOpenNotes}
                                            title="Abrir explorador de notas"
                                        >
                                            <span className={styles.shortcut}>Ctrl+O</span>
                                            Abrir nota
                                        </button>
                                    </li>
                                    <li>
                                        <button 
                                            className={styles.actionButton}
                                            onClick={onOpenNotes}
                                            title="Abrir paleta de comandos"
                                        >
                                            <span className={styles.shortcut}>Ctrl+Shift+P</span>
                                            Paleta de comandos
                                        </button>
                                    </li>
                                </ul>
                            </div>
                            
                            <div className={styles.actionGroup}>
                                <h3>Recientes</h3>
                                <ul>
                                    {recentNotes.length > 0 ? (
                                        recentNotes.map(note => (
                                            <li key={note.id}>
                                                <button 
                                                    className={styles.recentButton}
                                                    onClick={() => handleNoteClick(note.id)}
                                                    title={`Abrir ${note.title}`}
                                                >
                                                    📝 {note.title.replace('.md', '')}
                                                </button>
                                            </li>
                                        ))
                                    ) : (
                                        <li className={styles.emptyRecent}>
                                            No hay notas recientes
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>
                        
                        <div className={styles.tips}>
                            <h3>💡 Consejos</h3>
                            <ul>
                                <li>Usa <strong>Markdown</strong> para formatear tu contenido</li>
                                <li>Las notas se guardan automáticamente</li>
                                <li>Arrastra archivos para importarlos</li>
                                <li>Usa <strong>Ctrl+/</strong> para comentarios rápidos</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.editorArea}>
            <TabBar
                activeNotes={activeNotes}
                currentNoteId={currentNoteId}
                onNoteSelect={onNoteSelect}
                onNoteClose={onNoteClose}
            />
            
            {currentNote && (
                <Editor
                    note={currentNote}
                    onContentChange={onContentChange}
                />
            )}
        </div>
    );
};

export default EditorArea;