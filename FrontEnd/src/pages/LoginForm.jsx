import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const LoginForm = () => {
  const navigate = useNavigate() // Initialize navigate function
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [apiError, setApiError] = useState('')

  const togglePasswordVisibility = () => setShowPassword(!showPassword)
  const toggleSignup = () => {
    navigate('/signup')
  }

  const validateForm = () => {
    let formErrors = {}
    if (!email) {
      formErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      formErrors.email = 'Email is invalid'
    }

    if (!password) {
      formErrors.password = 'Password is required'
    } else if (password.length < 8) {
      formErrors.password = 'Password must be at least 8 characters long'
    }

    setErrors(formErrors)
    return Object.keys(formErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    setApiError('') // Reset API error state

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to login')
      }

      const data = await response.json()
      localStorage.setItem('token', data.token) // Save JWT in local storage

      // Use navigate to go to the profile page directly
      navigate('/profile')
    } catch (error) {
      // Better error handling based on the response status
      if (error.message === 'Failed to login') {
        setApiError('Invalid email or password')
      } else {
        setApiError(error.message)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100 p-4'>
      <div className='flex flex-col lg:flex-row bg-white rounded-lg shadow-lg overflow-hidden xl:min-w-[400px] lg:w-[900px]'>
        <div className='hidden lg:block lg:w-1/2'>
          <img
            src='https://via.placeholder.com/600'
            alt='Login'
            className='object-cover h-full w-full'
          />
        </div>
        <div className='w-full lg:w-1/2 p-6 lg:p-8'>
          <h2 className='text-2xl lg:text-3xl font-semibold mb-4'>
            Sign in to your account
          </h2>
          <form onSubmit={handleSubmit}>
            <div className='mb-4'>
              <label className='block text-sm font-medium mb-2' htmlFor='email'>
                Email address
              </label>
              <input
                type='email'
                id='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='w-full bg-gray-100 border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-black'
              />
              {errors.email && (
                <p className='text-red-500 text-xs mt-1'>{errors.email}</p>
              )}
            </div>
            <div className='mb-4'>
              <label
                className='block text-sm font-medium mb-2'
                htmlFor='password'
              >
                Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                id='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='w-full bg-gray-100 border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-black'
              />
              <button
                type='button'
                className='text-sm text-blue-500 mt-2'
                onClick={togglePasswordVisibility}
              >
                {showPassword ? 'Hide' : 'Show'} Password
              </button>
              {errors.password && (
                <p className='text-red-500 text-xs mt-1'>{errors.password}</p>
              )}
            </div>
            {apiError && (
              <p className='text-red-500 text-sm mb-4'>{apiError}</p>
            )}
            <button
              type='submit'
              className='w-full bg-black text-white px-4 py-2 rounded-lg hover:bg-white hover:text-black border border-black transition'
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
          <div className='text-sm mt-4'>
            Don&apos;t have an account?{' '}
            <button onClick={toggleSignup} className='text-blue-500 underline'>
              Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginForm
