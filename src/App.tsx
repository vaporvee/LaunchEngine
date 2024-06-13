import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { invoke } from '@tauri-apps/api'
import { open } from '@tauri-apps/api/shell';
import { writeTextFile, BaseDirectory, createDir, exists } from '@tauri-apps/api/fs'

function createFile(){
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

  exists(``, { dir: BaseDirectory.AppData })
  .then((exists) => {
    if (!exists){
      createDir('', {dir: BaseDirectory.AppConfig}).then(() => createFile());
    } else {
      createFile()
    }
  })

    // Example usage of invoke
    invoke('greet', { name: 'World' })
  .then((response) => {
        setMessage(response as string);
    });

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => open("https://vaporvee.com")}>
          Open external
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      {message}
    </>
  )
}

export default App
