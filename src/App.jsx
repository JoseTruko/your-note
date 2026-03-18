import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './assets/components/Header/Header'
import Footer from './assets/components/Footer/Footer'
import Home from './pages/Home'
import FeaturesPage from './pages/FeaturesPage'
import Contact from './pages/Contact'
import Pricing from './pages/Pricing'

function App() {
  return (
    <Router>
      <div className="appContainer">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/caracteristicas" element={<FeaturesPage />} />
            <Route path="/contacto" element={<Contact />} />
            <Route path="/precios" element={<Pricing />} />
          </Routes>
          <Footer />
        </main>
      </div>
    </Router>
  )
}

export default App
