import { autumnHandler } from 'autumn-js/next';
import { getSession } from '~/lib/auth';

export const { GET, POST } = autumnHandler({
  identify: async () => {
    const session = await getSession();

    return {
      customerId: session?.user.id,
      customerData: {
        name: session?.user.name,
        email: session?.user.email,
      },
    };
  },
});
