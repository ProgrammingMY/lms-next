"use server";

import { createClient } from "@/utils/supabase/server";

const getUser = async () => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user?.email;
};

export default getUser;
