// src/api/endpoints/subscription.api.js

import api from "../axios";

export const subscriptionApi = {
  // ==========================================
  // SUBSCRIPTION PLANS
  // ==========================================

  // Get active subscription plans
  getPlans: async () => {
    const { data } = await api.get("/subscription/plans");
    return data;
  },

  // ==========================================
  // SUBSCRIPTION CHECKOUT
  // ==========================================

  createCheckoutSession: async ({ planId, provider = "stripe" }) => {
    const { data } = await api.post("/subscription/checkout", {
      planId,
      provider,
    });

    return data;
  },
};