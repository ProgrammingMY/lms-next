import React, { useEffect, useState } from 'react'
import {
    DropdownMenu,
    DropdownMenuLabel,
    DropdownMenuItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Avatar,
    AvatarImage,
} from "@/components/ui/avatar";
import SignOut from '@/components/actions/signout';
import getUser from '../actions/getUser';

const SignOutButton = () => {

    // useEffect(() => {
    //     const fetchUser = async () => {
    //         const data = await getUser();

    //         setUser(data!);
    //     }
    //     fetchUser();
    // }, [])

    const onSignOut = async () => {
        try {
            await SignOut();
        } catch (error) {
            console.log(error);
        }
    }



    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem onClick={onSignOut}>
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default SignOutButton