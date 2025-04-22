import { useState } from 'react';
import { BACKEND_URL } from '../utils/utils';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface FormData {
  email: string;
  password: string;
}

interface Errors {
  email?: string;
  password?: string;
}

export default function SignIn() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Errors>({});
  const [notFoundEmail, setNotFoundEmail] = useState<boolean>(false);
  const [notFoundPass, setNotFoundPass] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string>('');

  const validateForm = () => {
    const newErrors: Errors = {};
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
    setNotFoundEmail(false);
    setNotFoundPass(false);
    setApiError('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiError('');
    setNotFoundEmail(false);
    setNotFoundPass(false);

    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.post(`${BACKEND_URL}/api/users/login`, formData);
      console.log('Login Response:', response.data); // Log response for debugging

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
      console.error('Error during login:', error);
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || 'An error occurred';

        if (status === 401) {
          setNotFoundEmail(true);
          setApiError('Email not found');
        } else if (status === 400) {
          setNotFoundPass(true);
          setApiError('Invalid credentials');
        } else {
          setApiError(message || 'Login failed. Please try again.');
        }
      } else {
        setApiError('Network error. Please check your connection.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-center text-gray-800 mb-4">Sign In</h2>

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
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              className={`w-full p-2 border ${
                errors.email || notFoundEmail ? 'border-red-500' : 'border-gray-300'
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
                errors.password || notFoundPass ? 'border-red-500' : 'border-gray-300'
              } rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
          </div>
          <button
            type="submit"
            className="w-full p-2 bg-blue-500 hover:bg-blue-600 text-white rounded focus:outline-none"
          >
            Sign In
          </button>
          <div className="w-full text-center p-4">
            <a href="/signup" className="text-center text-blue-400 underline">
              Create Account?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}