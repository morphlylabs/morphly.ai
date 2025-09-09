'use client';

import { useCustomer } from 'autumn-js/react';
import { useSelectedModel } from '../stores/model.store';
import { toModelBillingName } from '../lib/ai/models';

export const useSubscriptionAccess = (): boolean => {
  const { check } = useCustomer();
  const selectedModel = useSelectedModel();

  // Check if user has a valid subscription
  const hasAccess = check({
    featureId: toModelBillingName(selectedModel),
  }).data.allowed;

  return hasAccess;
};
