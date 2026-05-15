import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Phone, EnvelopeSimple } from '@phosphor-icons/react'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Register from './pages/Register'
import Players from './pages/Players'
import Admin from './pages/Admin'
import Terms from './pages/Terms'
import About from './pages/About'
import Verify from './pages/Verify'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/"         element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/players"  element={<Players />} />
        <Route path="/admin"    element={<Admin />} />
        <Route path="/terms" element={<Terms />} />
<Route path="/about" element={<About />} />
<Route path="/verify" element={<Verify />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

function Footer() {
  return (
    <footer className="bg-[#1c1917] mt-16 px-4 py-8">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">

        <div>
          <p className="text-[#f5f0e8] text-sm font-semibold">
            रेवस बोडणी प्रीमियर लीग 2026
          </p>
          <p className="text-[#78716c] text-xs mt-1">
            © 2026 Created by Soham Koli. All rights reserved.
          </p>
          {/* ADD HERE ↓ */}
          <div className="flex gap-4 mt-2 justify-center md:justify-start">
            <a href="/terms"
              className="text-[#78716c] hover:text-[#f5f0e8] text-xs transition-colors">
              Terms & Conditions
            </a>
            <a href="/about"
              className="text-[#78716c] hover:text-[#f5f0e8] text-xs transition-colors">
              About
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-2 text-xs text-[#a8a29e]">
          <p className="text-[#d4a853] font-medium text-xs uppercase tracking-wide mb-1">
            Contact Support
          </p>
          <a href="tel:+917058260905"
            className="flex items-center gap-2 hover:text-[#f5f0e8] transition-colors justify-center md:justify-start">
            <Phone size={14} weight="bold" />
            +91 70582 60905
          </a>
          <a href="mailto:sohamkoli29@gmail.com"
            className="flex items-center gap-2 hover:text-[#f5f0e8] transition-colors justify-center md:justify-start">
            <EnvelopeSimple size={14} weight="bold" />
            sohamkoli29@gmail.com
          </a>
        </div>

      </div>
    </footer>
  )
}
