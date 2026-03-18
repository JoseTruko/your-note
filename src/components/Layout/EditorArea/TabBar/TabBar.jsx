import React, { useState } from 'react';
import styles from './TabBar.module.css';

const TabBar = ({ activeNotes, currentNoteId, onNoteSelect, onNoteClose }) => {
    const [draggedTab, setDraggedTab] = useState(null);

    const handleTabClick = (noteId) => {
        onNoteSelect(noteId);
    };

    const handleTabClose = (e, noteId) => {
        e.stopPropagation();
        onNoteClose(noteId);
    };

    const handleTabMiddleClick = (e, noteId) => {
        if (e.button === 1) { // Middle mouse button
            e.preventDefault();
            onNoteClose(noteId);
        }
    };

    const handleDragStart = (e, noteId) => {
        setDraggedTab(noteId);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragEnd = () => {
        setDraggedTab(null);
    };

    const getFileIcon = (filename) => {
        if (filename.endsWith('.md')) return '📝';
        if (filename.endsWith('.txt')) return '📄';
        if (filename.endsWith('.js') || filename.endsWith('.jsx')) return '🟨';
        if (filename.endsWith('.ts') || filename.endsWith('.tsx')) return '🔷';
        if (filename.endsWith('.css')) return '🎨';
        if (filename.endsWith('.html')) return '🌐';
        if (filename.endsWith('.json')) return '📋';
        return '📄';
    };

    if (activeNotes.length === 0) {
        return null;
    }

    return (
        <div className={styles.tabBar}>
            <div className={styles.tabList}>
                {activeNotes.map((note) => (
                    <div
                        key={note.id}
                        className={`${styles.tab} ${
                            currentNoteId === note.id ? styles.active : ''
                        } ${draggedTab === note.id ? styles.dragging : ''}`}
                        onClick={() => handleTabClick(note.id)}
                        onMouseDown={(e) => handleTabMiddleClick(e, note.id)}
                        draggable
                        onDragStart={(e) => handleDragStart(e, note.id)}
                        onDragEnd={handleDragEnd}
                        title={note.title}
                    >
                        <span className={styles.tabIcon}>
                            {getFileIcon(note.title)}
                        </span>
                        
                        <span className={styles.tabTitle}>
                            {note.title}
                        </span>
                        
                        {note.isModified && (
                            <span className={styles.modifiedIndicator}>●</span>
                        )}
                        
                        <button
                            className={styles.closeButton}
                            onClick={(e) => handleTabClose(e, note.id)}
                            title="Cerrar"
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>
            
            <div className={styles.tabActions}>
                <button
                    className={styles.actionButton}
                    title="Más acciones"
                >
                    ⋯
                </button>
            </div>
        </div>
    );
};

export default TabBar;