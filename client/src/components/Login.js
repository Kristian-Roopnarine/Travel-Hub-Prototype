import React from 'react';
import { FcGoogle } from 'react-icons/fc';
function Login() {
  const onSuccess = (res) => {
    const { id_token } = res.getAuthResponse();
    console.log(id_token);
    console.log(res);
  };

  const onFailure = (res) => {
    console.log(res);
  };
  return (
    <div className="flex items-center space-x-2 p-2 bg-white rounded-sm">
      <FcGoogle size={'1.5rem'} />
      <a
        className="text-gray-500"
        href="http://localhost:5000/api/v1/auth/google"
      >
        Sign in with Google
      </a>
    </div>
  );
}

export default Login;
