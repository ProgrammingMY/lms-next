import React from 'react'
import MobileSidebar from '@/components/sidebar/mobile-sidebar'
import NavbarRoutes from '@/components/navbar-routes'

const Navbar = async ({
    isTeacher = false
}: {
    isTeacher?: boolean
}) => {
    return (
        <div className='p-4 border-b h-full flex items-center bg-white shadow-sm'>
            <MobileSidebar />
            <NavbarRoutes isTeacher={isTeacher} />
        </div>
    )
}

export default Navbar