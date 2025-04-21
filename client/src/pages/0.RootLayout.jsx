import React from 'react'
import { Outlet } from 'react-router-dom'
import { NavBar, Navigation } from '../components/ui/Navbar'
import FooterSection from '../components/ui/FooterSection'
import { CartProvider } from '../store/CartContext'
import Cart from '../components/Cart'

export const RootLayout = () => {
  return (
    <div className=''>
        <CartProvider>
            <div className='max-w-[1280px] mx-auto z-999'>
                <NavBar/>
            </div>
            <div className="w-full bg-blue-500">
                <Navigation/>
            </div>
            <div className='max-w-[1280px] mx-auto '>
                <Outlet />
                <Cart/>
            </div>
            <div className='mx-auto bg-slate-800 w-full'>
                <FooterSection/>
            </div>
        </CartProvider>
    </div>
  )
}
