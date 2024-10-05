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

const SignOutButton = async () => {
    const [user, setUser] = useState("test");

    // useEffect(() => {
    //     const fetchUser = async () => {
    //         const data = await getUser();

    //         setUser(data!);
    //     }
    //     fetchUser();
    // }, [])

    

    return (
        <DropdownMenu>

            <DropdownMenuTrigger>
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>
                    <div className="text-foreground">
                        {user}
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>
                    <form action={SignOut}>
                        <button className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover">
                            Logout
                        </button>
                    </form>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default SignOutButton