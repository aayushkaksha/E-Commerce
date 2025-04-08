import SCard from '../components/SCard'
import AddProduct from '../components/AddProduct'
import { useProductStore } from '../store/product'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const SellersPage = () => {
  const { fetchProducts, products } = useProductStore()
  const [user, setUser] = useState({ name: '', email: '' })
  const navigate = useNavigate()

  // Fetch User Data
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
          throw new Error('Failed to fetch user data')
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
    fetchProducts()
  }, [fetchProducts, navigate])

  return (
    <div className='pt-6 min-h-screen font-poppins'>
      {/* Wrapper */}
      <div className='p-6 max-w-screen-xl flex flex-col lg:flex-row lg:space-x-8 items-center lg:items-start justify-between mx-auto bg-white rounded-lg shadow-md'>
        {/* AddProduct Section */}
        <div className='flex-1 w-full lg:w-2/3 mt-6 lg:mt-0'>
          <div className='p-6 rounded-lg'>
            <h3 className='text-lg font-semibold text-gray-800 mb-4'>
              Add New Product
            </h3>
            <AddProduct />
          </div>
        </div>
      </div>

      {/* Cards Section */}
      <div className='w-full mt-8 px-4 max-w-screen mx-auto'>
        <h2 className='text-2xl font-bold m-4 text-gray-800'>
          Product Collection
        </h2>

        {/* SCard component wrapped in a flex container */}
        <div className='flex flex-wrap gap-6 mb-6'>
          {products && products.length > 0 ? (
            products.map((product) => (
              <SCard key={product._id} product={product} />
            ))
          ) : (
            <p>No products available</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default SellersPage
