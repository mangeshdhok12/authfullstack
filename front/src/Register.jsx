import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from "axios"
import { useNavigate } from 'react-router-dom'
import './index.css'

const Register = () => {
  const [name, setName]= useState()
  const [username, setUsername]= useState()
  const [password, setPassword]= useState()
  const [error, setError] = useState('');
  const navigate= useNavigate()

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/;
    return regex.test(password);
  };

  const handleSubmit=(e)=>{
    e.preventDefault()
    if (!validatePassword(password)) {
      setError('Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 7 characters long.');
      return;
    }
    axios.post('https://back-swart-kappa.vercel.app/register',{
      name, username, password
    }).then(res=>navigate('/login'))
    .catch(err=> console.log(err))
  }

  return (
    <div className='container'>
      <div>
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          
               <div><label htmlFor="name">Name:</label>
                <input type="text" onChange={e=>setName(e.target.value)} required />
                </div> 
                <div><label htmlFor="username">Username:</label>
                <input type="text"  onChange={e=>setUsername(e.target.value)}  required/>
                </div> 
                <div><label htmlFor="password">Password:</label>
                <input type="password"  onChange={e=>setPassword(e.target.value)} required/>
                </div> 
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button>Sign Up</button>
          
        </form>
        <br />
        <p>If you are already registered</p>
        <button><Link to='/login'>Login</Link></button>
      </div>
    </div>
  )
}

export default Register
