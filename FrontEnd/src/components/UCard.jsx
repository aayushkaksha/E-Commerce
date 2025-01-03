import { Heart, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useProductStore } from '../store/product'

const UCard = () => {
  const navigate = useNavigate()
  const { products, fetchProducts, loading, error } = useProductStore()

  useEffect(() => {
    fetchProducts() // Fetch products on component mount
  }, [fetchProducts])

  const handleCardClick = (id) => {
    navigate(`/product/${id}`)
  }

  if (loading) return <p>Loading products...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div className='main-container flex justify-left items-center font-poppins'>
      <div className='w-full grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 my-6 px-4'>
        {products.map((item) => (
          <div
            key={item._id}
            className='relative max-w-sm rounded-lg overflow-hidden shadow-md bg-white transition-transform duration-200 hover:shadow-lg hover:scale-105 cursor-pointer'
          >
            <div className='relative h-0 pb-[75%]'>
              <img
                className='absolute top-0 left-0 w-full h-full object-cover rounded-t-lg'
                src={item.image}
                alt={item.name}
                onClick={() => handleCardClick(item._id)}
              />
              <button className='absolute bottom-2 right-2 bg-white rounded-full p-1 shadow hover:shadow-md transition-colors'>
                <Heart className='w-5 h-5 text-gray-500 hover:text-red-500' />
              </button>
              <button className='absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:shadow-md'>
                <Plus className='w-5 h-5 text-gray-500' />
              </button>
            </div>
            <div className='mt-2 p-2 flex justify-between'>
              <div>
                <h3 className='text-sm text-gray-700'>{item.name}</h3>
              </div>
              <p className='text-sm font-bold'>Rs.{item.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default UCard
