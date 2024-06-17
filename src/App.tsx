import { useState } from 'react'
import { invoke } from '@tauri-apps/api'
import { writeTextFile, BaseDirectory, createDir, exists } from '@tauri-apps/api/fs'
import { FolderSelector } from './components'
function createFile() {
  const fileName = "example.txt"
  writeTextFile(fileName, "Initial content", { dir: BaseDirectory.AppData })
    .then(() => {
      console.log(`Wrote to file: ${fileName}`);
    })
    .catch((error) => {
      console.error("Failed to write to file:", error);
    });
}

exists("", { dir: BaseDirectory.AppData })
  .then((exists) => {
    if (!exists) {
      createDir("", { dir: BaseDirectory.AppConfig }).then(() => createFile());
    } else {
      createFile()
    }
  })

function App() {
  const [message, setMessage] = useState("")
  invoke('greet', { name: 'World' })
    .then((response) => {
      setMessage(response as string);
    });

  return (
    <>
      <p>{message}</p>
      <FolderSelector installPrefill={true} />
    </>
  )
}

export default App
