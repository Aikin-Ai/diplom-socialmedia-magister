import { createServerActionClient as _createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { cache } from 'react';

export const createServerActionClient = cache(() => {
    const cookieStore = cookies();
    return _createServerActionClient<Database>({ cookies: () => cookieStore });
});