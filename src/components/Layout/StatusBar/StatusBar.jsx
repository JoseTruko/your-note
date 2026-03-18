import React from 'react';
import styles from './StatusBar.module.css';

const StatusBar = ({ currentNote, totalNotes }) => {
    const getWordCount = (text) => {
        if (!text) return 0;
        return text.trim().split(/\s+/).filter(word => word.length > 0).length;
    };

    const getCharCount = (text) => {
        return text ? text.length : 0;
    };

    const formatLastModified = (date) => {
        if (!date) return '';
        const now = new Date();
        const diff = now - new Date(date);
        const minutes = Math.floor(diff / 60000);
        
        if (minutes < 1) return 'Ahora mismo';
        if (minutes < 60) return `Hace ${minutes}m`;
        
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `Hace ${hours}h`;
        
        const days = Math.floor(hours / 24);
        return `Hace ${days}d`;
    };

    return (
        <div className={styles.statusBar}>
            <div className={styles.statusLeft}>
                <div className={styles.statusItem}>
                    <span className={styles.icon}>🌿</span>
                    <span>main</span>
                </div>
                
                <div className={styles.statusItem}>
                    <span className={styles.icon}>📊</span>
                    <span>{totalNotes} nota(s)</span>
                </div>
                
                {currentNote && (
                    <>
                        <div className={styles.statusItem}>
                            <span className={styles.icon}>📝</span>
                            <span>{getWordCount(currentNote.content)} palabras</span>
                        </div>
                        
                        <div className={styles.statusItem}>
                            <span>{getCharCount(currentNote.content)} caracteres</span>
                        </div>
                    </>
                )}
            </div>
            
            <div className={styles.statusRight}>
                {currentNote && (
                    <>
                        <div className={styles.statusItem}>
                            <span className={styles.icon}>🕒</span>
                            <span>{formatLastModified(currentNote.lastModified)}</span>
                        </div>
                        
                        <div className={styles.statusItem}>
                            <span className={styles.icon}>💾</span>
                            <span>{currentNote.isModified ? 'Sin guardar' : 'Guardado'}</span>
                        </div>
                    </>
                )}
                
                <div className={styles.statusItem}>
                    <span className={styles.icon}>🔤</span>
                    <span>UTF-8</span>
                </div>
                
                <div className={styles.statusItem}>
                    <span className={styles.icon}>📄</span>
                    <span>Markdown</span>
                </div>
                
                <div className={styles.statusItem}>
                    <span className={styles.icon}>🎯</span>
                    <span>Espacios: 4</span>
                </div>
            </div>
        </div>
    );
};

export default StatusBar;