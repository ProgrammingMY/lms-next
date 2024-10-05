import { Menu } from 'lucide-react'
import React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"
import Sidebar from './sidebar'

function MobileSidebar() {
    return (
        <Sheet>
            <SheetTrigger className='md:hidden pr-4 hover:opacity-75 transition'>
                <Menu size={24} />
            </SheetTrigger>
            <SheetContent side={"left"} className='p-0 bg-white'>
                <Sidebar />
            </SheetContent>
        </Sheet>

    )
}

export default MobileSidebar