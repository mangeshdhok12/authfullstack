import axios from 'axios'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ReCAPTCHA from 'react-google-recaptcha';
import './App.css'

const Login = () => {

  const [username, setUsername]= useState()
  const [password, setPassword]= useState()
  const [captchaValue, setCaptchaValue] = useState(null);
  const [error, setError] = useState('');
  const navigate= useNavigate()



  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!captchaValue) {
        setError('Please complete the CAPTCHA.');
        return;
    }

    try {
        const response = await axios.post(
            'https://authfullstack.vercel.app/login',
            { username, password, captchaValue },
            { withCredentials: true }
        );

        if (response.data === 'success') {
            navigate('/home');
        } else {
            setError('Login failed: ' + response.data);
        }
    } catch (error) {
        setError('Login error: ' + (error.response?.data || error.message));
    }
};
  return (
    <div className='container'>
      <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
          
        
           <div><label htmlFor="username">Username:</label>
           <input type="text" onChange={e=>setUsername(e.target.value)} />
           </div> 
           <div><label htmlFor="password">Password:</label>
           <input type="password" onChange={e=>setPassword(e.target.value)}   />
           </div> 
           <ReCAPTCHA
          sitekey="6LfDUyEqAAAAAM_-yN79gfJM7oi2TkITXeRnLqLd" // Replace with your reCAPTCHA site key
          onChange={val=>setCaptchaValue(val)}
        />
             {error && <p style={{ color: 'red' }}>{error}</p>}
           <button type='submit'>Login</button>
     
   </form>
   <br />
   <p>If you dont have registered</p>
   <button><Link to='/register'>Sign Up</Link></button>
   </div>
    </div>
  )
}

export default Login
