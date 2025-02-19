import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { NavBar } from '../components/shared/NavBar'
import { Navigation } from '../components/shared/Navigation'
import { QuickAccess } from '../components/shared/QuickAccess'
import FooterSection from '../components/FooterSection'
import SubscribeSection from '../components/SubscribeSection'

export const Rootlayout = () => {
  const [isExpanded, setIsExpaned] = useState(false)

  const expandNav = () => {
    setIsExpaned(!isExpanded)
    console.log("click")
  }

  const propsChild = {
    isExpanded: isExpanded,
    expFunc: () => expandNav()
  }

  useEffect(() => {
    if (isExpanded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isExpanded])

  return (
    <div className="transition-all overflow-x-hidden scroll-smooth">
        {isExpanded && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50"></div>
        )}
        <div className='max-w-[1280px] mx-auto z-999'>
            <NavBar props={propsChild}/>
        </div>
        <div className={`bg-blue-500 max-md:h-screen max-md:w-fit max-md:p-6 p-3 max-md:absolute z-50 max-md:right-0 max-md:top-0 shadow-sm max-md:rounded-s-lg ${isExpanded? "z-999": " max-md:invisible z-50"}`}>
            <Navigation props={propsChild}/>
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