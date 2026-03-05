import { useNavigate } from "react-router";
import Cart from '../assets/—Pngtree—flat shopping cart png download_4441398.png';
import { useContext, useState } from "react";
import { CartContext } from "./Cart";

const Navbar: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const cartContext = useContext(CartContext);
  const itemsinCart = Array.isArray(cartContext)
    ? cartContext[0].reduce((sum, it) => sum + (it?.value || 0), 0)
    : 0;
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="w-full bg-linear-to-r from-blue-300 to-blue-950 text-white">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-7">
        <div className="flex items-center justify-between  h-16">
          
          <div className="flex items-center">
            <button
              className="mr-3 md:hidden p-2 rounded-md hover:bg-blue-500/20"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <span className="block w-4ī h-0.5 bg-black mb-1" />
              <span className="block w-6 h-0.5 bg-black mb-1" />
              <span className="block w-4 h-0.5 bg-black " />
            </button>

            <div
              className="text-2xl text-black font-extrabold cursor-pointer"
              onClick={() => navigate('/')}
            >
              Fincons
            </div>
          </div>

          {/* Center: links (hidden on mobile) */}
       

          {/* Right: cart */}
          <div className="flex items-center">
               <div className="hidden md:flex justify-end items-end space-x-8 text-lg mr-10">
            <button onClick={() => navigate('/shop')} className="hover:underline">Products</button>
            <button onClick={() => navigate('/')} className="hover:underline">Home</button>
          </div>
            <div className="relative">
              <img
                src={Cart}
                alt="cart"
                className="w-8 h-8 cursor-pointer"
                onClick={() => navigate('/shop')}
              />
              <span className="absolute -top-2 -right-3 bg-red-500 text-xs font-semibold text-white px-2 rounded-full">
                {itemsinCart}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-linear-to-r from-blue-300 to-blue-950 font-extrabold transition-transform">
          <div className="px-2 pt-2 pb-3 space-y-1 transition-all">
            <button
              className="block w-full text-left px-3 py-2 text-black hover:bg-blue-600 rounded"
              onClick={() => {
                navigate('/shop');
                setMobileOpen(false);
              }}
            >
              Products
            </button>
            <button
              className="block w-full text-left px-3 py-2 text-black hover:bg-blue-600 rounded"
              onClick={() => {
                navigate('/');
                setMobileOpen(false);
              }}
            >
              Home
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
