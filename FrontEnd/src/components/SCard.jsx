import { useState } from 'react'
import { Edit, Minus } from 'lucide-react'
import {
  Snackbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from '@mui/material'
import { useProductStore } from '../store/product'
import EditProductModal from './Editmodal'

const SCard = ({ product }) => {
  const { deleteProduct, updateProduct } = useProductStore()

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    type: '',
  })
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isEditDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [updatedProduct, setUpdatedProduct] = useState(product)

  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false })

  const openDeleteDialog = (product) => {
    setSelectedProduct(product)
    setDeleteDialogOpen(true)
  }

  const closeDeleteDialog = () => setDeleteDialogOpen(false)

  const handleConfirmDelete = async () => {
    const { success, message } = await deleteProduct(selectedProduct._id)
    setSnackbar({
      open: true,
      message: success ? 'Product deleted successfully!' : message,
      type: success ? 'success' : 'error',
    })
    closeDeleteDialog()
  }

  const openEditDialog = (product) => {
    setUpdatedProduct(product)
    setEditDialogOpen(true)
  }

  const closeEditDialog = () => setEditDialogOpen(false)

  const handleUpdateProduct = async () => {
    const { success, message } = await updateProduct(
      updatedProduct._id,
      updatedProduct
    )
    setSnackbar({
      open: true,
      message: success ? 'Product updated successfully!' : message,
      type: success ? 'success' : 'error',
    })
    closeEditDialog()
  }

  const handleAddField = (field, defaultValue) => {
    setUpdatedProduct((prev) => ({
      ...prev,
      [field]: [...(prev[field] || []), defaultValue],
    }))
  }

  const handleRemoveField = (field, index) => {
    setUpdatedProduct((prev) => {
      const updatedField = [...(prev[field] || [])]
      updatedField.splice(index, 1)
      return { ...prev, [field]: updatedField }
    })
  }

  return (
    <div className='main-container flex justify-left items-center'>
      <div className='relative w-[250px] rounded-lg overflow-hidden shadow-md bg-white transition-transform duration-200 hover:shadow-lg hover:scale-105'>
        <div className='relative h-0 pb-[75%]'>
          <img
            className='absolute top-0 left-0 w-full h-full object-cover rounded-t-lg'
            src={product.image}
            alt={product.name}
          />
          <button
            className='absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:shadow-md'
            onClick={() => openDeleteDialog(product)}
          >
            <Minus className='w-5 h-5 text-gray-500' />
          </button>
          <button
            className='absolute bottom-2 right-2 bg-white rounded-full p-1 shadow hover:shadow-md'
            onClick={() => openEditDialog(product)}
          >
            <Edit className='w-5 h-5 text-gray-500 hover:text-blue-500' />
          </button>
        </div>
        <div className='mt-2 p-2 flex flex-col'>
          <h3 className='text-sm text-gray-700'>{product.name}</h3>
          <p className='text-sm font-medium text-gray-900'>
            Rs. {product.price}
          </p>
          {product.desc && (
            <p className='text-sm text-gray-500'>{product.desc}</p>
          )}
        </div>
      </div>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={snackbar.message}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onClose={closeDeleteDialog}>
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogContent>
          Are you sure you want to delete &quot;{selectedProduct?.name}&quot;?
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} color='secondary'>
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color='primary'>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Product Modal */}
      <EditProductModal
        isEditDialogOpen={isEditDialogOpen}
        closeEditDialog={closeEditDialog}
        updatedProduct={updatedProduct}
        setUpdatedProduct={setUpdatedProduct}
        handleUpdateProduct={handleUpdateProduct}
        handleAddField={handleAddField}
        handleRemoveField={handleRemoveField}
      />
    </div>
  )
}

export default SCard
