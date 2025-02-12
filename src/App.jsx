import { Home } from './pages/Home'
import { Routes, Route } from 'react-router-dom'
import { Rootlayout } from './pages/Rootlayout'

function App() {
  return (
    <main className="">
      <Routes>
        <Route element={<Rootlayout/>} path="/">
          <Route path='/' index element={<Home />} />
        </Route>
      </Routes>
    </main>
  )
}

export default App
