import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar/Sidebar';
import MobileNotesModal from './MobileNotesModal/MobileNotesModal';
import EditorArea from './EditorArea/EditorArea';
import StatusBar from './StatusBar/StatusBar';
import styles from './VSCodeLayout.module.css';

const VSCodeLayout = () => {
    // Sidebar should be hidden by default on mobile
    const [sidebarVisible, setSidebarVisible] = useState(window.innerWidth > 768);
    const [mobileModalOpen, setMobileModalOpen] = useState(false);
    const [activeNotes, setActiveNotes] = useState([]);
    const [currentNoteId, setCurrentNoteId] = useState(null);
    const [notes, setNotes] = useState([
        {
            id: '1',
            title: 'Bienvenido.md',
            content: `<h1>¡Bienvenido a VisualNote!</h1>
<p>Este es tu espacio para crear notas increíbles con una experiencia similar a Visual Studio Code.</p>

<h2>Características principales:</h2>
<ul>
<li><strong>Editor múltiple</strong>: Abre varias notas en pestañas</li>
<li><strong>Explorador</strong>: Navega por tus notas fácilmente</li>
<li><strong>Editor rico</strong>: Formato completo con herramientas visuales</li>
<li><strong>Autoguardado</strong>: Tus cambios se guardan automáticamente</li>
</ul>

<h2>Empezar:</h2>
<ol>
<li>Crea una nueva nota desde el explorador</li>
<li>Usa las herramientas de formato para dar estilo a tu contenido</li>
<li>Organiza tus ideas con facilidad</li>
</ol>

<blockquote>
<p>¡Comienza a escribir y organiza tus pensamientos!</p>
</blockquote>`,
            lastModified: new Date(),
            isModified: false
        },
        {
            id: '2',
            title: 'Ideas.md',
            content: `<h1>Mis Ideas Brillantes</h1>

<h2>Proyectos pendientes:</h2>
<ul>
<li>Aplicación de notas</li>
<li>Blog personal</li>
<li>Curso online</li>
</ul>

<h2>Inspiración:</h2>
<blockquote>
<p><em>"La creatividad es la inteligencia divirtiéndose"</em> - Albert Einstein</p>
</blockquote>

<h2>Recursos útiles:</h2>
<ul>
<li><a href="https://www.markdownguide.org/" target="_blank">Markdown Guide</a></li>
<li><a href="https://reactjs.org/" target="_blank">React Documentation</a></li>
</ul>

<p><strong>Nota importante:</strong> Recuerda revisar estos proyectos semanalmente.</p>`,
            lastModified: new Date(Date.now() - 3600000),
            isModified: false
        }
    ]);

    // Handle window resize to auto-hide sidebar on mobile
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 768 && sidebarVisible) {
                setSidebarVisible(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [sidebarVisible]);

    const toggleSidebar = () => {
        if (window.innerWidth <= 768) {
            // En móviles, abrir el modal en lugar del sidebar
            setMobileModalOpen(!mobileModalOpen);
        } else {
            // En desktop, usar el sidebar normal
            setSidebarVisible(!sidebarVisible);
        }
    };

    const openNote = (noteId) => {
        const note = notes.find(n => n.id === noteId);
        if (!note) return;

        // Add to active notes if not already open
        if (!activeNotes.find(n => n.id === noteId)) {
            setActiveNotes([...activeNotes, note]);
        }
        setCurrentNoteId(noteId);
        
        // Auto-close sidebar/modal on mobile when opening a note
        if (window.innerWidth <= 768) {
            setMobileModalOpen(false);
        }
    };

    const closeNote = (noteId) => {
        const newActiveNotes = activeNotes.filter(n => n.id !== noteId);
        setActiveNotes(newActiveNotes);
        
        if (currentNoteId === noteId) {
            setCurrentNoteId(newActiveNotes.length > 0 ? newActiveNotes[newActiveNotes.length - 1].id : null);
        }
    };

    const createNewNote = () => {
        const newNote = {
            id: Date.now().toString(),
            title: `Nueva-Nota-${Date.now()}.md`,
            content: `<h1>Nueva Nota</h1>
<p>Comienza a escribir aquí...</p>
<p>Usa las herramientas de formato para dar estilo a tu contenido:</p>
<ul>
<li><strong>Negrita</strong> para resaltar</li>
<li><em>Cursiva</em> para énfasis</li>
<li>Listas para organizar ideas</li>
</ul>`,
            lastModified: new Date(),
            isModified: false
        };
        
        // Agregar la nueva nota a la lista
        setNotes([...notes, newNote]);
        
        // Abrir automáticamente la nueva nota para editar
        // Add to active notes if not already open
        if (!activeNotes.find(n => n.id === newNote.id)) {
            setActiveNotes([...activeNotes, newNote]);
        }
        setCurrentNoteId(newNote.id);
        
        // Cerrar modal móvil después de crear y abrir
        if (window.innerWidth <= 768) {
            setMobileModalOpen(false);
        }
    };

    const updateNoteContent = (noteId, content) => {
        setNotes(notes.map(note => 
            note.id === noteId 
                ? { ...note, content, lastModified: new Date(), isModified: true }
                : note
        ));
        
        setActiveNotes(activeNotes.map(note =>
            note.id === noteId
                ? { ...note, content, lastModified: new Date(), isModified: true }
                : note
        ));
    };

    const renameNote = (noteId, newTitle) => {
        setNotes(notes.map(note =>
            note.id === noteId
                ? { ...note, title: newTitle }
                : note
        ));
        
        setActiveNotes(activeNotes.map(note =>
            note.id === noteId
                ? { ...note, title: newTitle }
                : note
        ));
    };

    const deleteNote = (noteId) => {
        setNotes(notes.filter(n => n.id !== noteId));
        closeNote(noteId);
    };

    const currentNote = activeNotes.find(n => n.id === currentNoteId);

    return (
        <div className={styles.layout}>
            <div className={styles.titleBar}>
                <div className={styles.titleBarLeft}>
                    <button 
                        className={styles.menuButton}
                        onClick={toggleSidebar}
                        title="Toggle Sidebar"
                    >
                        ☰
                    </button>
                    <span className={styles.appTitle}>VisualNote</span>
                </div>
                <div className={styles.titleBarCenter}>
                    {currentNote && (
                        <span className={styles.currentFile}>
                            {currentNote.title}
                            {currentNote.isModified && <span className={styles.modified}>●</span>}
                        </span>
                    )}
                </div>
                <div className={styles.titleBarRight}>
                    <button className={styles.windowControl}>−</button>
                    <button className={styles.windowControl}>□</button>
                    <button className={styles.windowControl}>×</button>
                </div>
            </div>

            <div className={styles.mainContent}>
                {/* Desktop Sidebar */}
                {sidebarVisible && window.innerWidth > 768 && (
                    <Sidebar
                        notes={notes}
                        onNoteSelect={openNote}
                        onNewNote={createNewNote}
                        onRenameNote={renameNote}
                        onDeleteNote={deleteNote}
                        currentNoteId={currentNoteId}
                        onCloseSidebar={() => setSidebarVisible(false)}
                    />
                )}
                
                {/* Mobile Notes Modal */}
                <MobileNotesModal
                    isOpen={mobileModalOpen}
                    onClose={() => setMobileModalOpen(false)}
                    notes={notes}
                    onNoteSelect={openNote}
                    onNewNote={createNewNote}
                    onDeleteNote={deleteNote}
                    currentNoteId={currentNoteId}
                />
                
                <EditorArea
                    activeNotes={activeNotes}
                    currentNoteId={currentNoteId}
                    onNoteSelect={setCurrentNoteId}
                    onNoteClose={closeNote}
                    onContentChange={updateNoteContent}
                    sidebarVisible={sidebarVisible}
                    onNewNote={createNewNote}
                    onOpenNotes={() => window.innerWidth <= 768 ? setMobileModalOpen(true) : setSidebarVisible(true)}
                    onOpenNote={openNote}
                    notes={notes}
                />
            </div>

            <StatusBar 
                currentNote={currentNote}
                totalNotes={notes.length}
            />
        </div>
    );
};

export default VSCodeLayout;