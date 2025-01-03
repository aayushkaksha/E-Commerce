import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
  Typography,
} from '@mui/material'
import { X as XIcon } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Cart({ open, onClose }) {
  const [products, setProducts] = useState([])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (open) {
      setLoading(true) // Start loading
      setError(null) // Reset any previous errors

      // Fetch cart data
      fetch('/api/cart', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Need to login')
          }
          return response.json()
        })
        .then((data) => {
          // Check the correct structure of the response and handle data
          if (data?.data?.items) {
            setProducts(data.data.items)
          } else {
            setProducts([]) // If no items in cart
          }
        })
        .catch((error) => {
          console.error('Error:', error)
          setError(error.message) // Set error state
        })
        .finally(() => {
          setLoading(false) // Stop loading
        })
    }
  }, [open])

  return (
    <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
      <DialogTitle>
        <div className='flex justify-between items-center'>
          <Typography variant='h6'>Shopping Cart</Typography>
          <IconButton onClick={onClose} edge='end'>
            <XIcon className='w-5 h-5' />
          </IconButton>
        </div>
      </DialogTitle>

      <DialogContent dividers>
        {loading && <Typography>Loading cart...</Typography>}{' '}
        {/* Show loading state */}
        {error && <Typography color='error'>{error}</Typography>}{' '}
        {/* Show error message */}
        {products.length === 0 && !loading && !error ? (
          <Typography>No items in your cart</Typography> // If cart is empty
        ) : (
          products.map((product) => (
            <div
              key={product.productId._id}
              className='flex py-4 border-b last:border-none'
            >
              <img
                src={product.productId.imageSrc}
                alt={product.productId.imageAlt}
                className='w-24 h-24 object-cover rounded-md mr-4'
              />
              <div className='flex flex-col justify-between'>
                <Typography variant='body1'>
                  {product.productId.name}
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  Color: {product.productId.color}
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  Quantity: {product.quantity}
                </Typography>
              </div>
              <Typography variant='body1' className='ml-auto'>
                ${product.productId.price.toFixed(2)}
              </Typography>
            </div>
          ))
        )}
      </DialogContent>

      <DialogActions>
        <div className='flex flex-col w-full p-4'>
          <Button
            variant='contained'
            color='primary'
            fullWidth
            className='mt-4'
          >
            Checkout
          </Button>
          <Button
            onClick={onClose}
            color='secondary'
            fullWidth
            className='mt-2'
          >
            Continue Shopping
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  )
}
