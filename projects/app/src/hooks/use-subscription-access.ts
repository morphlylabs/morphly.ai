'use client';

import { useCustomer } from 'autumn-js/react';

export const useSubscriptionAccess = (): boolean => {
  const { check } = useCustomer();

  // Check if user has a valid subscription
  const hasSubscription =
    check({
      productId: 'plus',
    }).data.allowed !== false;

  return hasSubscription;
};
