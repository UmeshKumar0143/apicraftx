import { useState } from 'react';
import { BACKEND_URL } from '../utils/utils';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface FormData {
  username: string;
  email: string;
  password: string;
}

interface Errors {
  username?: string;
  email?: string;
  password?: string;
}

export default function SignUp() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Errors>({});
  const [apiError, setApiError] = useState<string>('');

  const validateForm = () => {
    const newErrors: Errors = {};
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be 6+ characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setApiError('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiError('');

    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.post(`${BACKEND_URL}/api/users/register`, formData);
      console.log('Register Response:', response.data); // Log response for debugging

      // Adjust based on your backend response structure
      // Example: If response.data is { token: "..." } or { data: { token: "..." } }
      const token = response.data.token || response.data.data?.token || response.data;
      if (!token) {
        throw new Error('Token not found in response');
      }

      // Store token in localStorage
      localStorage.setItem('token', token);
      console.log('Token stored in localStorage:', localStorage.getItem('token')); // Verify storage

      navigate('/main');
    } catch (error) {
      console.error('Error during registration:', error);
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || 'An error occurred';

        if (status === 400) {
          setApiError('Invalid input data. Please check your details.');
        } else if (status === 409) {
          setApiError('Email already exists.');
        } else {
          setApiError(message || 'Registration failed. Please try again.');
        }
      } else {
        setApiError('Network error. Please check your connection.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-center text-gray-800 mb-4">Sign Up</h2>

        {apiError && (
          <p className="text-center font-semibold text-red-400 mb-4">
            {apiError}
            <button
              className="bg-red-200 h-5 w-5 rounded-lg text-sm font-bold inline-flex justify-center items-center hover:cursor-pointer ml-2"
              onClick={() => setApiError('')}
            >
              X
            </button>
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">Name</label>
            <input
              name="username"
              type="text"
              placeholder="John Doe"
              value={formData.username}
              onChange={handleChange}
              className={`w-full p-2 border ${
                errors.username ? 'border-red-500' : 'border-gray-300'
              } rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.username && <p className="text-sm text-red-500 mt-1">{errors.username}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              className={`w-full p-2 border ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              } rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">Password</label>
            <input
              name="password"
              type="password"
              placeholder="••••••"
              value={formData.password}
              onChange={handleChange}
              className={`w-full p-2 border ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              } rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
          </div>
          <button
            type="submit"
            className="w-full p-2 bg-blue-500 hover:bg-blue-600 text-white rounded focus:outline-none"
          >
            Sign Up
          </button>
          <div className="w-full text-center p-4">
            <a href="/signin" className="text-center text-blue-400 underline">
              Already have an account?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}