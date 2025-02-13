import React from 'react'
import { Outlet } from 'react-router-dom'
import { NavBar } from '../components/shared/NavBar'
import { Navigation } from '../components/shared/Navigation'
import { QuickAccess } from '../components/shared/QuickAccess'
import FooterSection from '../components/FooterSection'
import SubscribeSection from '../components/SubscribeSection'

export const Rootlayout = () => {
  return (
    <div className="">
        <div className='max-w-[1280px] mx-auto'>
            <NavBar/>
        </div>
        <div className="bg-blue-500">
            <Navigation/>
        </div>
        <QuickAccess />
        <div className='max-w-[1280px] mx-auto'>
            <Outlet/>
        </div>
        <div className='mx-auto bg-slate-800'>
            <SubscribeSection />
            <FooterSection />
        </div>
    </div>
  )
}
