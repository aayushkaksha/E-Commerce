import { useEffect, useState } from 'react'
import { LogOut, Store } from 'lucide-react' // Importing the LogOut icon
import Wishlist from '../components/Wishlist'
import { NavLink, useNavigate } from 'react-router-dom'
import SellersPageContent from './SellersPage' // Add this import at the top
import useAuthStore from '../store/auth'

const Profile = () => {
  const navigate = useNavigate()
  const { user, setUser, clearUser } = useAuthStore()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/auth/profile', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error('Error fetching user data')
        }

        const data = await response.json()
        if (data.success) {
          setUser(data.user)
        } else {
          throw new Error(data.message || 'Failed to load user data')
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
        navigate('/login')
      }
    }

    fetchUserData()
  }, [navigate, setUser])

  const handleLogout = () => {
    localStorage.removeItem('token')
    clearUser()
    navigate('/login')
  }

  if (!user) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
      </div>
    )
  }

  return (
    <div className='flex flex-col min-h-screen bg-gray-50'>
      {/* Main Content */}
      <div className='container mx-auto px-4 py-6'>
        <div className='mx-8'>
          {/* Profile Info and Buttons */}
          <div className='p-6 max-w-screen-lg mx-auto flex flex-col md:flex-row items-center justify-between bg-white shadow rounded-lg'>
            {/* Profile Section */}
            <div className='flex items-center space-x-6'>
              <div className='w-20 h-20 rounded-full overflow-hidden shadow-lg'>
                <img
                  src='https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Eug%C3%A8ne_Delacroix_-_La_libert%C3%A9_guidant_le_peuple.jpg/330px-Eug%C3%A8ne_Delacroix_-_La_libert%C3%A9_guidant_le_peuple.jpg'
                  alt='Profile'
                  className='w-full h-full object-cover'
                />
              </div>
              <div>
                <h2 className='text-3xl font-bold text-gray-800 text-center'>
                  {user.name}
                </h2>
                <p className='text-gray-600 text-center'>{user.email}</p>
              </div>
            </div>

            {/* Buttons Section */}
            <div className='flex flex-col items-center space-y-3 mt-6 md:mt-0 md:ml-8'>
              <button
                onClick={handleLogout}
                className='flex items-center space-x-2 bg-red-600 text-white px-5 py-2 rounded-lg shadow hover:bg-red-500 transition focus:ring-2 focus:ring-red-300'
                aria-label='Logout'
              >
                <LogOut className='w-5 h-5' />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Conditional Rendering Section */}
      <div className='container mx-auto px-4 py-6'>
        {user.role === 'seller' ? (
          <SellersPageContent />
        ) : (
          <div className='bg-white shadow p-6 rounded-lg'>
            <h2 className='text-2xl font-bold text-gray-900 mb-4'>
              My Wishlist
            </h2>
            <Wishlist />
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile
