import { useState, useEffect } from 'react'
import { User, ShoppingCart, Menu, MailIcon, Store } from 'lucide-react'
import Cart from './Cart'
import { NavLink, useNavigate } from 'react-router-dom'
import SearchBox from './SearchBox'

const NavBar = () => {
  const navigate = useNavigate();

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
    setSearchOpen(!searchOpen);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const openCart = () => {
    const token = localStorage.getItem('token');

    if (!token) {
      // Redirect to login if user is not authenticated
      navigate('/login');
    } else {
      setIsCartOpen(true); // Open cart if authenticated
    }
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  const handleProfileNavigation = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('User not authenticated. Redirecting to login.');
      navigate('/login');
    } else {
      navigate('/profile');
    }
  };
  

  const GotoTop = () => {
    window.scrollTo(0, 0);
  };

  return (
    <div className="sticky top-0 z-50 w-full bg-white shadow-md">
      <div className="container mx-auto relative">
        <nav className="flex items-center justify-between py-4 pr-4 font-poppins">
          <NavLink to="/" className="text-2xl font-bold pl-4 font-poppins">
            Brand<span className="text-primary">.</span>
          </NavLink>

          <ul className="hidden lg:flex space-x-6">
            <li>
              <NavLink to="/shop" className="flex items-center" onClick={GotoTop}>
                Shop
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" className="text-primary" onClick={GotoTop}>
                About
              </NavLink>
            </li>
            <li>
              <NavLink to="/contactPage" onClick={GotoTop}>
                Contact
              </NavLink>
            </li>
          </ul>

          <div className="flex items-center space-x-4">
            <NavLink
              to="/test"
              className="p-2 hover:bg-gray-100 rounded-full"
              aria-label="Go to test"
            >
              <span>Test</span>
            </NavLink>

            <button
              onClick={handleProfileNavigation}
              className="p-2 hover:bg-gray-100 rounded-full"
              aria-label="Go to profile"
            >
              <User className="w-5 h-5" />
            </button>

            <NavLink
              to="/message"
              className="relative p-2 hover:bg-gray-100 rounded-full"
              aria-label="Go to messages"
            >
              <MailIcon className="w-5 h-5" />
            </NavLink>

            <button
              onClick={openCart}
              className="relative p-2 hover:bg-gray-100 rounded-full"
              aria-label="Open cart"
            >
              <ShoppingCart className="w-5 h-5" />
            </button>

            <button
              onClick={toggleMenu}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-full"
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {user?.role === 'seller' && (
              <NavLink
                to='/seller'
                className='p-2 hover:bg-gray-100 rounded-full'
                aria-label='Seller Dashboard'
              >
                <Store className='w-5 h-5' />
              </NavLink>
            )}
          </div>
        </nav>

        {searchOpen && <SearchBox toggleSearch={toggleSearch} />}
        {isMenuOpen && (
          <div className="lg:hidden mt-2 py-2 bg-white border-t font-poppins">
            <ul className="space-y-2">
              <li>
                <NavLink
                  to="/shop"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={GotoTop}
                >
                  Shop
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/about"
                  className="block px-4 py-2 hover:bg-gray-100 text-primary"
                  onClick={GotoTop}
                >
                  About
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/contactPage"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={GotoTop}
                >
                  Contact
                </NavLink>
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Render Cart */}
      <Cart open={isCartOpen} onClose={closeCart} />
    </div>
  );
};

export default NavBar;
