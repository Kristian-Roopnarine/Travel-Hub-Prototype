import React from 'react';
import { GoogleLogin } from 'react-google-login';
import axios from 'axios';
const { REACT_APP_GOOGLE_CLIENT_ID } = process.env;

function Login() {
  const onSuccess = (res) => {
    const { id_token } = res.getAuthResponse();
    console.log(id_token);
    // send token id to backend
    //
    // redirect if successful
    console.log(res);
  };

  const onFailure = (res) => {
    console.log(res);
  };
  /*
  return (
    <div>
      <GoogleLogin
        clientId={REACT_APP_GOOGLE_CLIENT_ID}
        buttonText="Login"
        onSuccess={onSuccess}
        onFailure={onFailure}
        cookiePolicy={'single_host_origin'}
        style={{ marginTop: '2rem' }}
      />
    </div>
 );
 */
  return <a href="http://localhost:5000/api/v1/auth/google">Google Login</a>;
}

export default Login;
