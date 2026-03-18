import React, { useState } from 'react';
import styles from './Sidebar.module.css';

const Sidebar = ({ 
    notes, 
    onNoteSelect, 
    onNewNote, 
    onRenameNote, 
    onDeleteNote, 
    currentNoteId 
}) => {
    const [activeTab, setActiveTab] = useState('explorer');
    const [searchTerm, setSearchTerm] = useState('');
    const [contextMenu, setContextMenu] = useState(null);
    const [renamingId, setRenamingId] = useState(null);
    const [renameValue, setRenameValue] = useState('');

    const filteredNotes = notes.filter(note =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleContextMenu = (e, noteId) => {
        e.preventDefault();
        setContextMenu({
            x: e.clientX,
            y: e.clientY,
            noteId
        });
    };

    const handleRename = (noteId) => {
        const note = notes.find(n => n.id === noteId);
        setRenamingId(noteId);
        setRenameValue(note.title);
        setContextMenu(null);
    };

    const confirmRename = () => {
        if (renameValue.trim()) {
            onRenameNote(renamingId, renameValue.trim());
        }
        setRenamingId(null);
        setRenameValue('');
    };

    const cancelRename = () => {
        setRenamingId(null);
        setRenameValue('');
    };

    const handleDelete = (noteId) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta nota?')) {
            onDeleteNote(noteId);
        }
        setContextMenu(null);
    };

    // Close context menu when clicking outside
    React.useEffect(() => {
        const handleClick = () => setContextMenu(null);
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, []);

    return (
        <div className={styles.sidebar}>
            {/* Sidebar Tabs */}
            <div className={styles.sidebarTabs}>
                <button
                    className={`${styles.tab} ${activeTab === 'explorer' ? styles.active : ''}`}
                    onClick={() => setActiveTab('explorer')}
                    title="Explorer"
                >
                    📁
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'search' ? styles.active : ''}`}
                    onClick={() => setActiveTab('search')}
                    title="Search"
                >
                    🔍
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'git' ? styles.active : ''}`}
                    onClick={() => setActiveTab('git')}
                    title="Source Control"
                >
                    🌿
                </button>
            </div>

            {/* Sidebar Content */}
            <div className={styles.sidebarContent}>
                {activeTab === 'explorer' && (
                    <div className={styles.explorerPanel}>
                        <div className={styles.panelHeader}>
                            <span className={styles.panelTitle}>EXPLORADOR</span>
                            <button
                                className={styles.actionButton}
                                onClick={onNewNote}
                                title="Nueva Nota"
                            >
                                ➕
                            </button>
                        </div>

                        <div className={styles.fileTree}>
                            <div className={styles.folderHeader}>
                                <span className={styles.folderIcon}>📂</span>
                                <span className={styles.folderName}>MIS NOTAS</span>
                                <span className={styles.fileCount}>({notes.length})</span>
                            </div>

                            <div className={styles.fileList}>
                                {notes.map(note => (
                                    <div
                                        key={note.id}
                                        className={`${styles.fileItem} ${
                                            currentNoteId === note.id ? styles.selected : ''
                                        }`}
                                        onClick={() => onNoteSelect(note.id)}
                                        onContextMenu={(e) => handleContextMenu(e, note.id)}
                                    >
                                        <span className={styles.fileIcon}>
                                            {note.title.endsWith('.md') ? '📝' : '📄'}
                                        </span>
                                        
                                        {renamingId === note.id ? (
                                            <input
                                                type="text"
                                                value={renameValue}
                                                onChange={(e) => setRenameValue(e.target.value)}
                                                onBlur={confirmRename}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') confirmRename();
                                                    if (e.key === 'Escape') cancelRename();
                                                }}
                                                className={styles.renameInput}
                                                autoFocus
                                            />
                                        ) : (
                                            <span className={styles.fileName}>
                                                {note.title}
                                                {note.isModified && (
                                                    <span className={styles.modifiedIndicator}>●</span>
                                                )}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'search' && (
                    <div className={styles.searchPanel}>
                        <div className={styles.panelHeader}>
                            <span className={styles.panelTitle}>BUSCAR</span>
                        </div>
                        
                        <div className={styles.searchInput}>
                            <input
                                type="text"
                                placeholder="Buscar en notas..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={styles.searchField}
                            />
                        </div>

                        <div className={styles.searchResults}>
                            {searchTerm && (
                                <div className={styles.resultsHeader}>
                                    {filteredNotes.length} resultado(s) encontrado(s)
                                </div>
                            )}
                            
                            {filteredNotes.map(note => (
                                <div
                                    key={note.id}
                                    className={styles.searchResult}
                                    onClick={() => onNoteSelect(note.id)}
                                >
                                    <div className={styles.resultTitle}>{note.title}</div>
                                    <div className={styles.resultPreview}>
                                        {note.content.substring(0, 100)}...
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'git' && (
                    <div className={styles.gitPanel}>
                        <div className={styles.panelHeader}>
                            <span className={styles.panelTitle}>CONTROL DE CÓDIGO</span>
                        </div>
                        <div className={styles.gitContent}>
                            <div className={styles.gitStatus}>
                                <div className={styles.gitBranch}>
                                    🌿 main
                                </div>
                                <div className={styles.gitChanges}>
                                    {notes.filter(n => n.isModified).length} cambio(s) sin confirmar
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Context Menu */}
            {contextMenu && (
                <div
                    className={styles.contextMenu}
                    style={{
                        position: 'fixed',
                        top: contextMenu.y,
                        left: contextMenu.x,
                        zIndex: 1000
                    }}
                >
                    <button
                        className={styles.contextMenuItem}
                        onClick={() => handleRename(contextMenu.noteId)}
                    >
                        ✏️ Renombrar
                    </button>
                    <button
                        className={styles.contextMenuItem}
                        onClick={() => handleDelete(contextMenu.noteId)}
                    >
                        🗑️ Eliminar
                    </button>
                </div>
            )}
        </div>
    );
};

export default Sidebar;