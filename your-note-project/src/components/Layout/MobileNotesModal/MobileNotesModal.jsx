import React, { useState } from 'react';
import styles from './MobileNotesModal.module.css';

const MobileNotesModal = ({ 
    isOpen, 
    onClose, 
    notes, 
    onNoteSelect, 
    onNewNote, 
    onDeleteNote, 
    currentNoteId 
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    const filteredNotes = notes.filter(note =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleNoteSelect = (noteId) => {
        onNoteSelect(noteId);
        onClose(); // Cerrar modal después de seleccionar
    };

    const handleNewNote = async () => {
        setIsCreating(true);
        
        // Pequeño delay para mostrar el feedback visual
        setTimeout(() => {
            onNewNote();
            setIsCreating(false);
        }, 300);
    };

    const handleDelete = (noteId, e) => {
        e.stopPropagation(); // Evitar que se abra la nota
        if (window.confirm('¿Estás seguro de que quieres eliminar esta nota?')) {
            onDeleteNote(noteId);
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getPreview = (content) => {
        // Extraer texto plano del HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = content;
        const plainText = tempDiv.textContent || tempDiv.innerText || '';
        return plainText.substring(0, 80) + (plainText.length > 80 ? '...' : '');
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>📝 Mis Notas</h2>
                    <button className={styles.closeButton} onClick={onClose}>
                        ✕
                    </button>
                </div>

                {/* Search */}
                <div className={styles.searchSection}>
                    <div className={styles.searchInputWrapper}>
                        <span className={styles.searchIcon}>🔍</span>
                        <input
                            type="text"
                            placeholder="Buscar notas..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={styles.searchInput}
                        />
                    </div>
                </div>

                {/* New Note Button */}
                <div className={styles.actionSection}>
                    <button 
                        className={`${styles.newNoteButton} ${isCreating ? styles.creating : ''}`} 
                        onClick={handleNewNote}
                        disabled={isCreating}
                    >
                        <span className={styles.newNoteIcon}>
                            {isCreating ? '⏳' : '➕'}
                        </span>
                        <span>
                            {isCreating ? 'Creando y Abriendo...' : 'Crear y Editar Nueva Nota'}
                        </span>
                    </button>
                </div>

                {/* Notes List */}
                <div className={styles.notesSection}>
                    <div className={styles.notesHeader}>
                        <span className={styles.notesCount}>
                            {filteredNotes.length} nota{filteredNotes.length !== 1 ? 's' : ''}
                            {searchTerm && ` encontrada${filteredNotes.length !== 1 ? 's' : ''}`}
                        </span>
                    </div>

                    <div className={styles.notesList}>
                        {filteredNotes.length === 0 ? (
                            <div className={styles.emptyState}>
                                {searchTerm ? (
                                    <>
                                        <span className={styles.emptyIcon}>🔍</span>
                                        <p>No se encontraron notas</p>
                                        <small>Intenta con otros términos de búsqueda</small>
                                    </>
                                ) : (
                                    <>
                                        <span className={styles.emptyIcon}>📝</span>
                                        <p>No tienes notas aún</p>
                                        <small>Crea tu primera nota para empezar</small>
                                    </>
                                )}
                            </div>
                        ) : (
                            filteredNotes.map(note => (
                                <div
                                    key={note.id}
                                    className={`${styles.noteItem} ${
                                        currentNoteId === note.id ? styles.activeNote : ''
                                    }`}
                                    onClick={() => handleNoteSelect(note.id)}
                                >
                                    <div className={styles.noteContent}>
                                        <div className={styles.noteHeader}>
                                            <h3 className={styles.noteTitle}>
                                                {note.title.replace('.md', '')}
                                                {note.isModified && (
                                                    <span className={styles.modifiedDot}>●</span>
                                                )}
                                            </h3>
                                            <button
                                                className={styles.deleteButton}
                                                onClick={(e) => handleDelete(note.id, e)}
                                                title="Eliminar nota"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                        <p className={styles.notePreview}>
                                            {getPreview(note.content)}
                                        </p>
                                        <div className={styles.noteFooter}>
                                            <span className={styles.noteDate}>
                                                {formatDate(note.lastModified)}
                                            </span>
                                            {currentNoteId === note.id && (
                                                <span className={styles.currentBadge}>Actual</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MobileNotesModal;