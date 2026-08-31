import {
  useQuery,
  useMutation,
} from "@tanstack/react-query";

import { subscriptionApi } from "../endpoints/subscription.api";
import { QUERY_KEYS } from "../../constants/queryKeys";

// ==========================================
// GET ACTIVE SUBSCRIPTION PLANS
// ==========================================

export const useSubscriptionPlans = () => {
  return useQuery({
    queryKey: QUERY_KEYS.COMPANY.SUBSCRIPTION_PLANS,
    queryFn: subscriptionApi.getPlans,
    staleTime: 1000 * 60 * 10,
  });
};

// ==========================================
// CREATE CHECKOUT SESSION
// ==========================================

export const useCreateSubscriptionCheckout = () => {
  return useMutation({
    mutationFn: ({ planId, provider }) =>
      subscriptionApi.createCheckoutSession({
        planId,
        provider,
      }),
  });
};