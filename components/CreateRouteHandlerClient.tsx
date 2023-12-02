import { createRouteHandlerClient as _createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { cache } from 'react';

export const createRouteHandlerClient = cache(() => {
    const cookieStore = cookies();
    return _createRouteHandlerClient<Database>({ cookies: () => cookieStore });
});