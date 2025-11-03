import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
// import { useState } from 'react'
import AppMain from './application/index.jsx'
import AdminMain from "./admin/index.jsx";
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'

function App() {


  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/app" replace />} />
        <Route path="/app" element={<AppMain />} />
        <Route path="/admin" element={<AdminMain />} />
      </Routes>
    </Router>
  )
}

export default App
