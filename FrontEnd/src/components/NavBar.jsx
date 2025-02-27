import { useState, useEffect } from 'react'
import { User, Menu, MailIcon, Store, History } from 'lucide-react'
import Cart from './Cart'
import { NavLink, useNavigate } from 'react-router-dom'
import SearchBox from './SearchBox'
import { ShoppingCart } from 'lucide-react'

const NavBar = () => {
  const navigate = useNavigate()

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token')
      if (!token) return

      try {
        const response = await fetch('/api/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
        }
      } catch (error) {
        console.error('Error fetching user:', error)
      }
    }

    fetchUser()
  }, [])

  const toggleSearch = () => {
    setSearchOpen(!searchOpen)
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }
  const openCart = () => {
    const token = localStorage.getItem('token')

    if (!token) {
      // Redirect to login if user is not authenticated
      navigate('/login')
    } else {
      setIsCartOpen(true) // Open cart if authenticated
    }
  }
  const closeCart = () => {
    setIsCartOpen(false)
  }

  const GotoTop = () => {
    window.scrollTo(0, 0)
  }

  return (
    <div className='sticky top-0 z-50 w-full bg-white shadow-md'>
      <div className='container mx-auto relative'>
        <nav className='flex items-center justify-between py-4 pr-4 font-poppins'>
          <NavLink to='/' className='text-2xl font-bold pl-4 font-poppins'>
            Brand<span className='text-primary'>.</span>
          </NavLink>

          {user?.role !== 'seller' && (
            <ul className='hidden lg:flex space-x-6'>
              <li>
                <NavLink
                  to='/Men'
                  className='flex items-center'
                  onClick={GotoTop}
                >
                  Shop
                </NavLink>
              </li>
              <li>
                <NavLink to='/About' className='text-primary' onClick={GotoTop}>
                  About
                </NavLink>
              </li>
              <li>
                <NavLink to='/ContactPage' onClick={GotoTop}>
                  Contact
                </NavLink>
              </li>
            </ul>
          )}

          <div className='flex items-center space-x-4'>
            <NavLink
              to='/profile'
              className='p-2 hover:bg-gray-100 rounded-full'
              aria-label='Go to profile'
            >
              <User className='w-5 h-5' />
            </NavLink>

            <NavLink
              to='/message'
              className='relative p-2 hover:bg-gray-100 rounded-full'
              aria-label='Go to messages'
            >
              <MailIcon className='w-5 h-5' />
            </NavLink>

            {/* {user?.role === 'seller' && (
              <NavLink
                to='/orders/:orderId'
                className='relative p-2 hover:bg-gray-100 rounded-full'
                aria-label='Order History'
              >
                <History className='w-5 h-5' />
              </NavLink>
            )} */}

            {user?.role === 'buyer' && (
              <button
                onClick={openCart}
                className='relative p-2 hover:bg-gray-100 rounded-full'
                aria-label='Open cart'
              >
                <ShoppingCart className='w-5 h-5' />
              </button>
            )}

            <button
              onClick={toggleMenu}
              className='lg:hidden p-2 hover:bg-gray-100 rounded-full'
              aria-label='Toggle menu'
            >
              <Menu className='w-5 h-5' />
            </button>
          </div>
        </nav>
        {searchOpen && <SearchBox toggleSearch={toggleSearch} />}
        {isMenuOpen && (
          <div className='lg:hidden mt-2 py-2 bg-white border-t font-poppins'>
            <ul className='space-y-2'>
              {user?.role !== 'seller' ? (
                <>
                  <li>
                    <NavLink
                      to='/Men'
                      className='block px-4 py-2 hover:bg-gray-100'
                      onClick={GotoTop}
                    >
                      Men
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to='/Women'
                      className='block px-4 py-2 hover:bg-gray-100'
                      onClick={GotoTop}
                    >
                      Women
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to='/About'
                      className='block px-4 py-2 hover:bg-gray-100 text-primary'
                      onClick={GotoTop}
                    >
                      About
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to='/ContactPage'
                      className='block px-4 py-2 hover:bg-gray-100'
                      onClick={GotoTop}
                    >
                      Contact
                    </NavLink>
                  </li>
                </>
              ) : (
                <li>
                  <NavLink
                    to='/order-history'
                    className='block px-4 py-2 hover:bg-gray-100'
                    onClick={GotoTop}
                  >
                    Order History
                  </NavLink>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>

      {user?.role !== 'seller' && (
        <Cart open={isCartOpen} onClose={closeCart} />
      )}
    </div>
  )
}

export default NavBar
