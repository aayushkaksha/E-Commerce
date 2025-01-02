import { useState, useEffect } from 'react';
import { X, ShoppingCart } from 'lucide-react';
import { Box, Button, Typography, Modal } from '@mui/material';

const Wishlist = () => {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);

  useEffect(() => {
    // Fetch wishlist data
    fetch('/api/wishlist', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch wishlist data');
        }
        return response.json();
      })
      .then((data) => setItems(data.wishlistItems))
      .catch((error) => console.error('Error:', error));
  }, []);

  const handleOpen = (item) => {
    setItemToRemove(item);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleRemove = () => {
    if (itemToRemove) {
      fetch(`/api/wishlist/${itemToRemove.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to remove item');
          }
          setItems(items.filter((item) => item.id !== itemToRemove.id));
          setItemToRemove(null);
          handleClose();
        })
        .catch((error) => console.error('Error:', error));
    }
  };

  return (
    <div className="container mx-auto mt-10 flex justify-center">
      <table className="w-full md:w-3/4 lg:w-1/2 bg-white">
        <thead>
          <tr>
            <th className="text-left py-3 px-4 uppercase font-semibold text-sm font-poppins">
              Product Info
            </th>
            <th className="text-left py-3 px-4 uppercase font-semibold text-sm font-poppins">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td className="py-4 px-4">
                <div className="flex items-center space-x-4">
                  <img
                    className="h-20 w-20 lg:h-24 lg:w-24 object-cover rounded-md"
                    src={item.image}
                    alt={item.name}
                  />
                  <div className="text-sm md:text-base lg:text-lg">
                    <h5 className="font-medium">{item.name}</h5>
                    <p className="text-gray-600">Rs. {item.price}</p>
                    <p className="text-sm text-gray-500">{item.stockStatus}</p>
                  </div>
                </div>
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center space-x-4">
                  <ShoppingCart className="text-gray-500 cursor-pointer hover:text-gray-700" />
                  <X
                    className="text-gray-500 cursor-pointer hover:text-gray-700"
                    onClick={() => handleOpen(item)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            p: 4,
          }}
        >
          <Typography variant="h6">Confirm Removal</Typography>
          <Typography sx={{ mt: 2 }}>
            Are you sure you want to remove this item from your wishlist?
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleClose} sx={{ mr: 2 }}>
              Cancel
            </Button>
            <Button onClick={handleRemove} variant="contained" color="error">
              Remove
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default Wishlist;
