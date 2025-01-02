import { useParams, useNavigate } from 'react-router-dom' // Import useNavigate
import { useProductStore } from "../store/product";


export default function ProductDesc() {
  const { products } = useProductStore();
  
  const { id } = useParams()
  const navigate = useNavigate() // Initialize useNavigate
  const product = products.find((item) => item.id === parseInt(id))
  

  if (!product) {
    return <p className='text-center text-red-500'>Product not found.</p>
  }
  
  return (
    <div className='bg-gray-50 p-6 mt-6 sm:p-8 max-w-6xl mx-auto shadow-lg rounded-lg'>
      {/* Product Info Section */}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
        {/* Image Section */}
        <div className='rounded-lg overflow-hidden'>
          <img
            src={product.images}
            alt={`Image of ${product.name}`}
            className='w-full h-full object-cover'
          />
        </div>

        {/* Details Section */}
        <div className='flex flex-col space-y-4'>
          <h1 className='text-3xl font-bold text-gray-900'>{product.name}</h1>
          <p className='text-xl font-semibold text-gray-800'>
            Price: {product.price}
          </p>
          <p className='text-sm text-gray-700'>
            {product.description || 'No description available.'}
          </p>

          {/* Colors */}
          <div>
            <span className='text-sm font-medium text-gray-700 block mb-2'>
              Colors:
            </span>
            <div className='flex space-x-4'>
              {product.colors.map((color, index) => (
                <label key={index} className='flex items-center space-x-2'>
                  <input
                    type='radio'
                    name='color'
                    value={color.name}
                    className='w-4 h-4 text-blue-600 focus:ring-blue-500'
                  />
                  <span className='text-sm text-gray-700'>{color.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div>
            <span className='text-sm font-medium text-gray-700 block mb-2'>
              Sizes:
            </span>
            <div className='flex space-x-2'>
              {product.sizes.map((size, index) => (
                <button
                  key={index}
                  className={`px-3 py-1 text-sm rounded border ${
                    size.inStock
                      ? 'border-gray-300 bg-white text-gray-700 hover:bg-gray-100'
                      : 'border-gray-300 bg-gray-200 text-gray-400 cursor-disabled'
                  }`}
                  disabled={!size.inStock}
                >
                  {size.name}
                </button>
              ))}
            </div>
          </div>

          {/* Highlights */}
          <div>
            <span className='text-sm font-medium text-gray-700'>
              Highlights:
            </span>
            <ul className='list-disc list-inside text-sm text-gray-600'>
              {product.highlights.map((highlight, index) => (
                <li key={index}>{highlight}</li>
              ))}
            </ul>
          </div>

          {/* Call to Action */}
          <div className='mt-6 flex space-x-4'>
            <button className='bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700'>
              Add to Cart
            </button>
            <button
              className='bg-gray-200 text-gray-800 px-4 py-2 rounded shadow hover:bg-gray-300'
              onClick={() => navigate(-1)} // Go back to the last visited page
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}