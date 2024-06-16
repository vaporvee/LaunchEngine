import { useState } from 'react'
import { invoke } from '@tauri-apps/api'
import { open } from '@tauri-apps/api/dialog';
import { writeTextFile, BaseDirectory, createDir, exists } from '@tauri-apps/api/fs'

function createFile() {
  const fileName = "example.txt";
  writeTextFile(fileName, "Initial content", { dir: BaseDirectory.AppData })
    .then(() => {
      console.log(`Wrote to file: ${fileName}`);
    })
    .catch((error) => {
      console.error("Failed to write to file:", error);
    });
}

function App() {
  const [message, setMessage] = useState("")

  exists("", { dir: BaseDirectory.AppData })
    .then((exists) => {
      if (!exists) {
        createDir("", { dir: BaseDirectory.AppConfig }).then(() => createFile());
      } else {
        createFile()
      }
    })

  // Example usage of invoke
  invoke('greet', { name: 'World' })
    .then((response) => {
      setMessage(response as string);
    });
  const [directory, setDirectory] = useState("")
  return (
    <div className='center'>
      <p>{message}</p>
      <input value={directory} onChange={(e) => {setDirectory(e.target.value);}} />
      <button onClick={async() => {
       const folder = await open({directory: true})
       if (folder != null) setDirectory(folder as string)
      }}>Select folder</button>
    </div>
  )
}

export default App
