
import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'


const Home = () => {
  const navigate= useNavigate()

  const handleLogout=()=>{
    axios.get('http://localhost:3001/logout')
    .then(res=>navigate('/login'))
    .catch(err=> console.log(err))
  }

  return (
    <div>
     <h1>Login Successfully</h1> 

      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default Home
