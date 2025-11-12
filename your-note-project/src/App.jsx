import './App.css'
import Header from './assets/components/Header/Header'
import Footer from './assets/components/Footer/Footer'
import Hero from './assets/components/Hero/Hero'

function App() {
  return (
    <div className="appContainer">
      <Header />
      <main>
        <Hero />
      </main>
      <Footer />
    </div>
  )
}

export default App
