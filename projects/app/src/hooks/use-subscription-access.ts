'use client';

import { useMemo } from 'react';
import { useCustomer } from 'autumn-js/react';
import { useSelectedModel } from '../stores/model.store';
import { toModelBillingName } from '../lib/ai/models';

export const useSubscriptionAccess = (): boolean => {
  const { check, isLoading } = useCustomer();
  const selectedModel = useSelectedModel();

  const hasAccess = useMemo(() => {
    if (isLoading) {
      return true;
    }

    const result = check({
      featureId: toModelBillingName(selectedModel),
    });

    return result.data.allowed;
  }, [selectedModel, check, isLoading]);

  return hasAccess;
};
