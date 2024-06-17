import React, { useState, useEffect } from 'react';
import { appLocalDataDir } from '@tauri-apps/api/path'
const appLocalDataPath: string = await appLocalDataDir()
import { open } from '@tauri-apps/api/dialog'

interface FolderSelectorProps {
    installPrefill?: boolean;
    onDirectoryChange?: (newDirectory: string) => void;
}

const FolderSelector: React.FC<FolderSelectorProps> = ({ installPrefill = false, onDirectoryChange }) => {
    const [selectedDirectory, setSelectedDirectory] = useState('');

    useEffect(() => {
        const fetchAppInfoAndSetDirectory = async () => {
            setSelectedDirectory(appLocalDataPath);
        };
        fetchAppInfoAndSetDirectory();
    }, []);

    const handleOpenDialog = async () => {
        const folder = await open({ directory: true, defaultPath: selectedDirectory });
        if (folder !== null) {
            setSelectedDirectory(folder as string);
            if (typeof onDirectoryChange != 'undefined')
                onDirectoryChange(folder as string);
        }
    };

    return (
        <div>
            <input type="text" value={installPrefill ? selectedDirectory : ''} onChange={(e) => setSelectedDirectory(e.target.value)} />
            <button onClick={handleOpenDialog}>Select folder</button>
        </div>
    );
};

export default FolderSelector;
