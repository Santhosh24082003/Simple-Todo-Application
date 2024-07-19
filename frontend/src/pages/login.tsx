import React, { useState } from 'react';
import { TextField, Button, Typography, IconButton, InputAdornment } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import userService from '../services/userService';  
import { useNavigate } from 'react-router-dom'; 

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userData = { email, password };
      const response = await userService.login(userData);
      console.log('Login successful:', response);
      navigate('/dashboard'); 
    } catch (error) {
      console.error('Login failed:', error.response ? error.response.data : error.message);
      setError('Invalid email or password. Please try again.');
    }
  };

  const handleSignup = () => {
    navigate('/register'); 
  };

  return (
    <div className="flex justify-center items-center h-[100vh] w-[100%]">
      <div className='w-3/4 md:max-w-[480px] bg-gray-100 p-5 m-2 h-[300px]' style={{ borderRadius: "14px" }}>
        <Typography variant="h5" className='text-black my-2' align="center" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            variant="outlined"
          />
          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {error && <Typography color="error">{error}</Typography>}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
          >
            Login
          </Button>
          <Button
            variant="contained" 
            color="primary"  
            fullWidth
            onClick={handleSignup}
          >
            Signup
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
