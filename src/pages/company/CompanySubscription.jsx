import React, { useState } from "react";

import {
  Check,
  Sparkles,
  CreditCard,
  Building2,
  Zap,
  ShieldCheck,
  ArrowRight,
  Loader2,
  AlertCircle,
  RefreshCw,
  X,
  WalletCards,
  Smartphone,
  Clock,
  CalendarDays,
  TrendingUp,
  Crown,
  Gift,
} from "lucide-react";

import {
  useSubscriptionPlans,
  useCreateSubscriptionCheckout,
} from "../../api/queries/useSubscription";
import { useCreditHistory } from "../../api/queries/useCompany";

// ======================================================
// HELPERS
// ======================================================

const formatCurrency = (amount = 0, currency = "PKR") => {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatNumber = (number = 0) => {
  return new Intl.NumberFormat("en-US").format(number);
};

const formatDate = (date) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// ======================================================
// PAYMENT METHODS
// ======================================================

const PAYMENT_METHODS = [
  {
    id: "stripe",
    name: "Stripe",
    description: "Pay securely using Visa, Mastercard or other cards.",
    icon: CreditCard,
    available: true,
  },
  {
    id: "jazzcash",
    name: "JazzCash",
    description: "Pay using your JazzCash wallet.",
    icon: Smartphone,
    available: false,
  },
  {
    id: "easypaisa",
    name: "EasyPaisa",
    description: "Pay securely using your EasyPaisa account.",
    icon: WalletCards,
    available: false,
  },
];

// ======================================================
// PAYMENT MODAL
// ======================================================

const PaymentModal = ({
  plan,
  isOpen,
  onClose,
  onPayment,
  isProcessing,
}) => {
  const [selectedProvider, setSelectedProvider] = useState("stripe");

  if (!isOpen || !plan) {
    return null;
  }

  const handleContinue = () => {
    const selectedMethod = PAYMENT_METHODS.find(
      (method) => method.id === selectedProvider
    );

    if (!selectedMethod?.available) {
      return;
    }

    onPayment(selectedProvider);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl">
        {/* HEADER */}
        <div className="flex items-start justify-between border-b border-slate-100 p-6">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-yellow-100 text-yellow-600">
                <CreditCard size={18} />
              </span>
              <span className="badge-yellow">Secure Checkout</span>
            </div>
            <h2 className="text-2xl font-semibold text-slate-900">
              Choose Payment Method
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Select how you would like to pay for your subscription.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        {/* SELECTED PLAN */}
        <div className="mx-6 mt-6 rounded-xl border border-yellow-200 bg-yellow-50/50 p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-yellow-700">
                Selected Plan
              </p>
              <h3 className="mt-1 text-lg font-semibold text-slate-900">
                {plan.name}
              </h3>
            </div>
            <div className="text-right">
              <p className="text-xl font-semibold text-slate-900">
                {formatCurrency(plan.price, plan.currency)}
              </p>
              <p className="text-xs text-slate-500">
                {formatCurrency(plan.price, plan.currency)} / plan
              </p>
            </div>
          </div>
        </div>

        {/* PAYMENT METHODS */}
        <div className="p-6">
          <p className="mb-3 text-sm font-semibold text-slate-800">
            Payment method
          </p>
          <div className="space-y-3">
            {PAYMENT_METHODS.map((method) => {
              const Icon = method.icon;
              const isSelected = selectedProvider === method.id;

              return (
                <button
                  key={method.id}
                  type="button"
                  disabled={!method.available || isProcessing}
                  onClick={() =>
                    method.available && setSelectedProvider(method.id)
                  }
                  className={`relative flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-all ${
                    isSelected
                      ? "border-yellow-400 bg-yellow-50/60 ring-2 ring-yellow-200"
                      : method.available
                      ? "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                      : "cursor-not-allowed border-slate-200 bg-slate-50 opacity-70"
                  }`}
                >
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                      isSelected
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <Icon size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-slate-900">
                        {method.name}
                      </p>
                      {!method.available && (
                        <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                          Coming Soon
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {method.description}
                    </p>
                  </div>
                  {method.available && (
                    <div
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                        isSelected
                          ? "border-yellow-500 bg-yellow-500"
                          : "border-slate-300 bg-white"
                      }`}
                    >
                      {isSelected && (
                        <div className="h-2 w-2 rounded-full bg-white" />
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* SECURITY NOTE */}
          <div className="mt-5 flex items-start gap-3 rounded-xl bg-slate-50 p-4">
            <ShieldCheck size={18} className="mt-0.5 shrink-0 text-emerald-500" />
            <div>
              <p className="text-xs font-semibold text-slate-700">
                Secure payment
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Your payment is securely processed by the selected payment
                provider. TourismOS does not store your card details.
              </p>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="btn-outline"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleContinue}
              disabled={isProcessing}
              className="btn-primary"
            >
              {isProcessing ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Preparing Checkout...
                </>
              ) : (
                <>
                  Continue to Payment
                  <ArrowRight size={16} className="ml-2" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// cards

const PlanCard = ({ plan, onSubscribe, isSelected, isCurrentPlan }) => {
  const features = Array.isArray(plan.features) ? plan.features : [];

  return (
    <div
      className={`relative flex flex-col rounded-2xl border bg-white p-5 ${
        isCurrentPlan
          ? "border-yellow-400 ring-2 ring-yellow-200 bg-yellow-50/30"
          : isSelected
          ? "border-yellow-400 ring-2 ring-yellow-200"
          : "border-slate-200"
      }`}
    >
      {/* BADGE */}
      {isCurrentPlan && (
        <div className="absolute -top-2.5 left-5">
          <span className="inline-flex items-center gap-1 rounded-full bg-yellow-500 px-2.5 py-1 text-[10px] font-semibold text-white">
            <Check size={10} />
            Current
          </span>
        </div>
      )}

      {isSelected && !isCurrentPlan && (
        <div className="absolute -top-2.5 left-5">
          <span className="inline-flex items-center gap-1 rounded-full bg-yellow-500 px-2.5 py-1 text-[10px] font-semibold text-white">
            <Sparkles size={10} />
            Popular
          </span>
        </div>
      )}

      {/* PLAN NAME */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            {plan.name}
          </h3>
          <p className="text-xs text-slate-500">
            {isCurrentPlan ? "Current plan" : "Grow your business"}
          </p>
        </div>
      </div>

      {/* PRICE */}
      <div className="mt-3">
        <div className="flex items-end gap-1">
          <span className="text-2xl font-bold text-slate-900">
            {formatCurrency(plan.price, plan.currency)}
          </span>
        </div>
        <p className="text-[10px] text-slate-400">per period</p>
      </div>

      {/* AI CREDITS - Compact */}
      <div className="mt-3 rounded-lg bg-yellow-50 px-3 py-2">
        <div className="flex items-center gap-2">
          <Gift size={14} className="text-yellow-500" />
          <div>
            <p className="text-[10px] font-medium text-yellow-700">AI Credits</p>
            <p className="text-sm font-semibold text-slate-900">
              {formatNumber(plan.aiCredits || 0)}
            </p>
          </div>
        </div>
      </div>

      {/* FEATURES - Compact */}
      <div className="mt-4 flex-1">
        <p className="mb-2 text-xs font-semibold text-slate-700">
          What's included
        </p>
        <div className="space-y-1.5">
          {features.length > 0 ? (
            features.slice(0, 4).map((feature, index) => (
              <div key={`${feature}-${index}`} className="flex items-start gap-2">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
                  <Check size={10} strokeWidth={2.5} />
                </span>
                <span className="text-xs leading-5 text-slate-600">
                  {feature}
                </span>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-400">No features listed</p>
          )}
          {features.length > 4 && (
            <p className="text-[10px] text-slate-400">+{features.length - 4} more</p>
          )}
        </div>
      </div>

      {/* BUTTON */}
      <div className="mt-4 pt-1">
        {isCurrentPlan ? (
          <button
            type="button"
            disabled
            className="w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-400"
          >
            <Check size={12} className="mr-1.5 inline" />
            Current Plan
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onSubscribe(plan)}
            className="btn-primary w-full text-xs"
          >
            Subscribe
            <ArrowRight size={13} className="ml-1.5" />
          </button>
        )}
      </div>
    </div>
  );
};
// ======================================================
// CREDIT HISTORY CARD
// ======================================================

const CreditHistoryCard = ({ creditData, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 size={24} className="animate-spin text-yellow-500" />
      </div>
    );
  }

  if (!creditData) {
    return null;
  }

  const { currentBalance = 0, totalCredits = 0 } = creditData;
  const usedCredits = totalCredits - currentBalance;
  const percentageRemaining = totalCredits > 0 
    ? Math.round((currentBalance / totalCredits) * 100) 
    : 0;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-500 to-yellow-600 p-6 shadow-lg shadow-yellow-500/20">
      {/* Decorative elements */}
      <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-white/10 blur-2xl" />

      <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-white backdrop-blur-sm">
            <TrendingUp size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                Credit Balance
              </span>
              <span className="text-xs text-white/70">
                {formatDate(new Date().toISOString())}
              </span>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-6">
              <div>
                <p className="text-sm text-white/80">Available Credits</p>
                <p className="text-3xl font-semibold text-white">
                  {formatNumber(currentBalance)}
                  <span className="ml-1 text-sm font-normal text-white/60">
                    / {formatNumber(totalCredits)}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-sm text-white/80">Used</p>
                <p className="text-lg font-semibold text-white">
                  {formatNumber(usedCredits)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-64">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-white/90">
              {percentageRemaining}% remaining
            </span>
            <span className="text-xs text-white/60">
              {formatNumber(usedCredits)} used
            </span>
          </div>
          <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/20 backdrop-blur-sm">
            <div
              className="h-full rounded-full bg-white transition-all duration-500"
              style={{ width: `${percentageRemaining}%` }}
            />
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-white/60">
            <Clock size={12} />
            <span>Credits renew on subscription purchase</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ======================================================
// MAIN COMPONENT
// ======================================================

const CompanySubscription = () => {
  // STATE
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  // QUERIES
  const {
    data: plansResponse,
    isLoading: plansLoading,
    isError: plansError,
    refetch: refetchPlans,
    isFetching: plansFetching,
  } = useSubscriptionPlans();

  const {
    data: creditResponse,
    isLoading: creditLoading,
    isError: creditError,
    refetch: refetchCredits,
  } = useCreditHistory();

  // MUTATION
  const checkoutMutation = useCreateSubscriptionCheckout();

  // API DATA
  const plans = Array.isArray(plansResponse?.data)
    ? plansResponse.data
    : Array.isArray(plansResponse?.data?.data)
    ? plansResponse.data.data
    : [];

  const creditData = creditResponse?.data || null;

  // SUBSCRIBE
  const handleSubscribe = (plan) => {
    setSelectedPlan(plan);
    setIsPaymentOpen(true);
  };

  // CLOSE PAYMENT
  const handleClosePayment = () => {
    if (checkoutMutation.isPending) {
      return;
    }
    setIsPaymentOpen(false);
    setSelectedPlan(null);
  };

  // CREATE CHECKOUT
  const handlePayment = async (provider) => {
    if (!selectedPlan?._id) {
      return;
    }

    try {
      const response = await checkoutMutation.mutateAsync({
        planId: selectedPlan._id,
        provider,
      });

      const checkoutData = response?.data || response;
      const checkoutUrl = checkoutData?.checkoutUrl || checkoutData?.url;

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
        return;
      }

      console.error("Checkout URL not found:", response);
      alert("Unable to start checkout. Please try again.");
    } catch (error) {
      console.error("Subscription Checkout Error:", error);
      alert(
        error?.response?.data?.message ||
          "Unable to start checkout. Please try again."
      );
    }
  };

  // LOADING
  if (plansLoading || creditLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={30} className="animate-spin text-yellow-500" />
          <p className="text-sm text-slate-500">
            Loading subscription details...
          </p>
        </div>
      </div>
    );
  }

  // ERROR
  if (plansError || creditError) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-6">
        <div className="w-full max-w-md rounded-2xl border border-rose-100 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-500">
            <AlertCircle size={24} />
          </div>
          <h2 className="mt-4 text-xl font-semibold text-slate-900">
            Unable to load subscription details
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Something went wrong while loading your subscription information.
          </p>
          <button
            type="button"
            onClick={() => {
              refetchPlans();
              refetchCredits();
            }}
            disabled={plansFetching}
            className="btn-primary mt-5"
          >
            <RefreshCw
              size={16}
              className={`mr-2 ${plansFetching ? "animate-spin" : ""}`}
            />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ====================================================
  // RENDER
  // ====================================================

  const hasCurrentPlan = false; // Set based on your subscription status

  return (
    <div className="space-y-8 pb-10">
      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-yellow-600">
              Company Management
            </p>
            <span className="badge-yellow">Subscription</span>
          </div>
          <h1 className="mt-1 text-3xl font-semibold text-slate-900">
            Manage Your Subscription
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            View your current AI credit balance and choose a plan that fits your
            company's travel operations.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            refetchPlans();
            refetchCredits();
          }}
          disabled={plansFetching}
          className="btn-outline flex h-10 w-10 shrink-0 items-center justify-center rounded-xl p-0"
          title="Refresh"
        >
          <RefreshCw size={16} className={plansFetching ? "animate-spin" : ""} />
        </button>
      </div>

      {/* ==================================================
          CREDIT BALANCE
      ================================================== */}

      <CreditHistoryCard creditData={creditData} isLoading={creditLoading} />

      {/* ==================================================
          INFO BANNER
      ================================================== */}

      <div className="rounded-2xl border border-yellow-200 bg-yellow-50/50 p-5">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-yellow-500 shadow-sm">
            <Building2 size={19} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              {hasCurrentPlan
                ? "Upgrade your plan for more features"
                : "Choose a plan to get started"}
            </h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              {hasCurrentPlan
                ? "Select a new plan below to unlock additional AI credits and features."
                : "Select a plan that best fits your company's travel operations. Each plan includes AI credits and features configured by your TourismOS administrator."}
            </p>
          </div>
        </div>
      </div>

      {/* ==================================================
          PLANS
      ================================================== */}

      {plans.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-50 text-yellow-500">
            <Sparkles size={27} />
          </div>
          <h2 className="mt-5 text-xl font-semibold text-slate-900">
            No subscription plans available
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            There are currently no active subscription plans available. Please
            check again later.
          </p>
          <button
            type="button"
            onClick={() => refetchPlans()}
            className="btn-outline mt-6"
          >
            <RefreshCw size={16} className="mr-2" />
            Refresh
          </button>
        </div>
      ) : (
        <div
          className={`grid grid-cols-1 gap-6 ${
            plans.length === 2
              ? "mx-auto max-w-4xl md:grid-cols-2"
              : plans.length >= 3
              ? "md:grid-cols-2 xl:grid-cols-3"
              : "mx-auto max-w-md"
          }`}
        >
          {plans.map((plan, index) => {
            const isCurrentPlan = false; // Replace with actual logic
            const isPopular = index === 1 && plans.length >= 3 && !isCurrentPlan;

            return (
              <PlanCard
                key={plan._id || plan.id}
                plan={plan}
                isSelected={isPopular}
                isCurrentPlan={isCurrentPlan}
                onSubscribe={handleSubscribe}
              />
            );
          })}
        </div>
      )}

      {/* ==================================================
          PAYMENT MODAL
      ================================================== */}

      <PaymentModal
        plan={selectedPlan}
        isOpen={isPaymentOpen}
        onClose={handleClosePayment}
        onPayment={handlePayment}
        isProcessing={checkoutMutation.isPending}
      />
    </div>
  );
};

export default CompanySubscription;