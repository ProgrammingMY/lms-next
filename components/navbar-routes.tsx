"use client";

import React from 'react';
import SignOutButton from './forms/sign-out-button';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';
import { SearchInput } from './search-input';

const NavbarRoutes = async () => {
    const pathname = usePathname();

    const isTeacherPage = pathname?.startsWith('/teacher');
    const isPlayerPage = pathname?.includes('/courses');
    const isSearchPage = pathname === "/search";

    return (
        <>
            {isSearchPage && (
                <div className='hidden md:block'>
                    <SearchInput />
                </div>
            )}

            <div className='flex gap-x-2 ml-auto'>
                {isTeacherPage || isPlayerPage ?
                    <Link href={"/"}>
                        <Button size="sm" variant="ghost">
                            <LogOut className='h-4 w-4 mr-2' />
                            Exit
                        </Button>
                    </Link> :
                    <Link href={"/teacher/courses"}>
                        <Button size="sm" variant="ghost">
                            Teacher Mode
                        </Button>
                    </Link>
                }


                <SignOutButton />
            </div>
        </>
    )
}

export default NavbarRoutes;