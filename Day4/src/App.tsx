import { BrowserRouter,Routes,Route } from 'react-router';
import './App.css'
import {Home} from './pages/Home';
import { Products } from './pages/Products';
import { ProductDetails } from './pages/ProductDetails';
import Navbar from './components/Navbar';
import { CartContext,type CartItem } from './components/Cart';
import { useState } from 'react';
import { Sidebars } from './components/SideBars';
function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  return (
    <>
  {/* 3.webp:1 
 GET https://cdn.dummyjson.com/product-images/fragrances/calvin-klein-ck-one/1.w…s://cdn.dummyjson.com/product-images/fragrances/calvin-klein-ck-one/3.webp 404 (Not Found)
<img>	 */}
    <BrowserRouter>
    
    <CartContext.Provider value={[cartItems, setCartItems]}>
        
     <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/shop' element={<Products/>}/>
        <Route path='/products/:id' element={<ProductDetails/>}/>
      </Routes>
    </CartContext.Provider>
    </BrowserRouter>
    
    </>
  )
}

export default App
