import React, { useState, useEffect } from 'react';
import { os } from '@tauri-apps/api'
import { join } from '@tauri-apps/api/path'
import { getName } from '@tauri-apps/api/app'
import { open } from '@tauri-apps/api/dialog'

const baseAppDirectories: { [os in os.Platform | string]: string; } = {
    win32: 'C:\\Program Files',
    darwin: '/Applications',
    linux: '/opt/',
};

interface FolderSelectorProps {
    installPrefill?: boolean;
    onDirectoryChange?: (newDirectory: string) => void;
}

const FolderSelector: React.FC<FolderSelectorProps> = ({ installPrefill = false, onDirectoryChange }) => {
    const [selectedDirectory, setSelectedDirectory] = useState('');
    const [_, setAppName] = useState('');

    useEffect(() => {
        const fetchAppInfoAndSetDirectory = async () => {
            const platformName = await os.platform();
            const appNameResult = await getName();
            const finalPathResult = await join(baseAppDirectories[platformName], appNameResult)
            setAppName(appNameResult);
            setSelectedDirectory(finalPathResult);
        };
        fetchAppInfoAndSetDirectory();
    }, []);

    const handleOpenDialog = async () => {
        const folder = await open({ directory: true });
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
