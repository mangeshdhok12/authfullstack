import React from 'react'
import {BrowserRouter, Route, Routes} from "react-router-dom"
import Register from './Register'
import Home from './Home'
import Login from './Login'
import Navbar from './Navbar'

const App = () => {
  return (
   <BrowserRouter
   >
   <Navbar/>
    <Routes>
      <Route path='/register' element={<Register/> }></Route>
      <Route path='/login' element={<Login/> }></Route>
      <Route path='/home' element={<Home/> }></Route>
    </Routes>
   </BrowserRouter>
  )
}

export default App
