import React from 'react'
import CustomLogin from '../Auth/CustomLogin'
import GoogleAuth from '../Auth/GoogleAuth'

const Login = () => {
  return (
    <div className='login-container' >
        <h1>Login</h1>
        <div className="form-container">
          <CustomLogin/>
          <p>or</p>
          <GoogleAuth/>
        </div>
    </div>
  )
}

export default Login