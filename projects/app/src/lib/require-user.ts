import 'server-only';

import { redirect } from 'next/navigation';
import { getSession } from './auth';
import { cache } from 'react';

export const requireUser = cache(async () => {
  const session = await getSession();

  if (!session) {
    return redirect('/login');
  }

  return session;
});
