import React from 'react'
import SidebarRoutes from './sidebar-routes'

function Sidebar() {
    return (
        <div className='h-full border-r flex flex-col overflow-y-auto bg-white shadow-sm'>
            <div className='p-6'>
                {/* logo */}
            </div>
            <div className='flex flex-col h-full'>
                <SidebarRoutes />
            </div>
        </div>
    )
}

export default Sidebar