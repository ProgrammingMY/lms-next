"use server";

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

const SignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    console.log("log out");
    return redirect("/login");
}

export default SignOut;