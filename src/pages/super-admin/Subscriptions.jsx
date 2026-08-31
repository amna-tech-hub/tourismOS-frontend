import React, { useState } from 'react';
import {
  Crown,
  Plus,
  Zap,
  CheckCircle2,
  Building2,
  DollarSign,
  Loader2,
  Edit3,
  Power,
  CreditCard,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';

import {
  useAdminSubscriptionPlans,
  useCreateSubscriptionPlan,
  useUpdateSubscriptionPlan,
  useToggleSubscriptionPlan,
  useCompanySubscriptionsLedger,
} from '../../api/queries/useSuperAdmin';

export default function Subscriptions() {
  // =========================================================
  // STATE
  // =========================================================

  const [activeTab, setActiveTab] = useState('plans');

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editingPlan, setEditingPlan] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    currency: 'PKR',
    aiCredits: 100,
    features: '',
    isActive: true,
  });

  // =========================================================
  // QUERIES
  // =========================================================

  const {
    data: plansResponse,
    isLoading: isLoadingPlans,
    isError: isErrorPlans,
  } = useAdminSubscriptionPlans();

  const {
    data: ledgerResponse,
    isLoading: isLoadingLedger,
  } = useCompanySubscriptionsLedger();

  // =========================================================
  // MUTATIONS
  // =========================================================

  const createPlanMutation = useCreateSubscriptionPlan();

  const updatePlanMutation = useUpdateSubscriptionPlan();

  const togglePlanMutation = useToggleSubscriptionPlan();

  // =========================================================
  // DATA
  // =========================================================

  const plans = plansResponse?.data || [];

  const companySubscriptions =
    ledgerResponse?.data?.subscriptions || [];

  const stats = ledgerResponse?.data?.stats || {
    totalRevenue: 0,
    activeSubscriptions: 0,
    totalSubscriptions: 0,
  };

  // =========================================================
  // OPEN CREATE MODAL
  // =========================================================

  const handleOpenCreateModal = () => {
    setEditingPlan(null);

    setFormData({
      name: '',
      price: 0,
      currency: 'PKR',
      aiCredits: 100,
      features: '',
      isActive: true,
    });

    createPlanMutation.reset();
    updatePlanMutation.reset();

    setIsModalOpen(true);
  };

  // =========================================================
  // OPEN EDIT MODAL
  // =========================================================

  const handleOpenEditModal = (plan) => {
    setEditingPlan(plan);

    setFormData({
      name: plan.name || '',
      price: plan.price || 0,
      currency: plan.currency || 'PKR',
      aiCredits: plan.aiCredits || 0,
      features: Array.isArray(plan.features)
        ? plan.features.join(', ')
        : plan.features || '',
      isActive: plan.isActive ?? true,
    });

    createPlanMutation.reset();
    updatePlanMutation.reset();

    setIsModalOpen(true);
  };

  // =========================================================
  // CLOSE MODAL
  // =========================================================

  const handleCloseModal = () => {
    if (isSubmitting) return;

    setIsModalOpen(false);
    setEditingPlan(null);
  };

  // =========================================================
  // TOGGLE PLAN STATUS
  // =========================================================

  const handleToggleStatus = (id) => {
    if (!id) {
      console.error('Cannot toggle plan: missing plan ID');
      return;
    }

    togglePlanMutation.mutate(id);
  };

  // =========================================================
  // SUBMIT CREATE / UPDATE
  // =========================================================

  const handleSubmit = (e) => {
    e.preventDefault();

    const formattedFeatures =
      typeof formData.features === 'string'
        ? formData.features
            .split(',')
            .map((feature) => feature.trim())
            .filter((feature) => feature.length > 0)
        : formData.features;

    const payload = {
      name: formData.name.trim(),
      price: Number(formData.price),
      currency: formData.currency,
      aiCredits: Number(formData.aiCredits),
      features: formattedFeatures,
      isActive: formData.isActive,
    };

    if (editingPlan) {
      const planId = editingPlan._id || editingPlan.id;

      if (!planId) {
        console.error('Cannot update subscription plan: missing ID');
        return;
      }

      updatePlanMutation.mutate(
        {
          id: planId,
          ...payload,
        },
        {
          onSuccess: () => {
            setIsModalOpen(false);
            setEditingPlan(null);
          },
        }
      );

      return;
    }

    createPlanMutation.mutate(payload, {
      onSuccess: () => {
        setIsModalOpen(false);
        setEditingPlan(null);
      },
    });
  };

  // =========================================================
  // HELPERS
  // =========================================================

  const formatPKR = (amount = 0) => {
    return `PKR ${Number(amount).toLocaleString()}`;
  };

  const isSubmitting =
    createPlanMutation.isPending ||
    updatePlanMutation.isPending;

  const submitError =
    updatePlanMutation.error ||
    createPlanMutation.error;

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8 font-sans">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-slate-200/60 pb-6">

        <div>
          <div className="flex items-center gap-2 mb-2">

            <span className="text-[10px] font-bold uppercase tracking-wider text-yellow-800 bg-yellow-100 px-3 py-1 rounded-full border border-yellow-200/60 inline-flex items-center gap-1.5">

              <Crown className="w-3 h-3 text-yellow-600" />

              Subscription Management

            </span>

          </div>

          <h1 className="text-3xl md:text-4xl font-bold font-serif text-slate-900">
            Plans & Subscriptions
          </h1>

          <p className="text-xs mt-1 text-slate-500">
            Configure subscription tiers, credit allocations, and monitor company subscriptions.
          </p>
        </div>

        <div className="flex items-center gap-3">

          <button
            onClick={handleOpenCreateModal}
            className="btn-primary text-xs py-2.5 px-4 gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Create Subscription Plan
          </button>

        </div>
      </div>

      {/* =====================================================
          METRICS
      ====================================================== */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Revenue */}

        <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center justify-between">

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Total Subscriptions Revenue
            </span>

            <h3 className="text-2xl font-bold text-slate-900 mt-1 font-serif">
              {formatPKR(stats.totalRevenue)}
            </h3>
          </div>

          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
            <DollarSign className="w-5 h-5" />
          </div>

        </div>

        {/* Active subscriptions */}

        <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center justify-between">

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Active Subscriptions
            </span>

            <h3 className="text-2xl font-bold text-slate-900 mt-1 font-serif">
              {stats.activeSubscriptions} Companies
            </h3>
          </div>

          <div className="w-10 h-10 rounded-xl bg-yellow-50 text-yellow-600 flex items-center justify-center border border-yellow-200">
            <Building2 className="w-5 h-5" />
          </div>

        </div>

        {/* Active plans */}

        <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center justify-between">

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Total Active Packages
            </span>

            <h3 className="text-2xl font-bold text-slate-900 mt-1 font-serif">
              {plans.filter((plan) => plan.isActive).length} Tiers
            </h3>
          </div>

          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
            <TrendingUp className="w-5 h-5" />
          </div>

        </div>

      </div>

      {/* =====================================================
          TABS
      ====================================================== */}

      <div className="flex items-center gap-2 border-b border-slate-200">

        <button
          onClick={() => setActiveTab('plans')}
          className={`pb-3 px-4 text-xs font-bold tracking-wide border-b-2 cursor-pointer ${
            activeTab === 'plans'
              ? 'border-yellow-500 text-yellow-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Subscription Packages ({plans.length})
        </button>

        <button
          onClick={() => setActiveTab('company-subscriptions')}
          className={`pb-3 px-4 text-xs font-bold tracking-wide border-b-2 cursor-pointer ${
            activeTab === 'company-subscriptions'
              ? 'border-yellow-500 text-yellow-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Active Company Subscriptions ({companySubscriptions.length})
        </button>

      </div>

      {/* =====================================================
          TAB 1 — PLANS
      ====================================================== */}

      {activeTab === 'plans' && (
        <>
          {isLoadingPlans ? (

            <div className="py-12 flex justify-center items-center text-slate-400 gap-2">

              <Loader2 className="w-5 h-5 animate-spin text-yellow-500" />

              <span className="text-xs">
                Loading subscription packages...
              </span>

            </div>

          ) : isErrorPlans ? (

            <div className="py-12 text-center text-rose-500 text-xs">
              Failed to load subscription plans.
            </div>

          ) : plans.length === 0 ? (

            <div className="py-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">

              <p className="text-xs text-slate-500">
                No subscription plans created yet.
              </p>

              <button
                onClick={handleOpenCreateModal}
                className="mt-3 btn-primary text-xs py-2 px-4 inline-flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Create First Plan
              </button>

            </div>

          ) : (

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {plans.map((plan) => {

                const planId = plan._id || plan.id;

                const isTogglingThisPlan =
                  togglePlanMutation.isPending &&
                  togglePlanMutation.variables === planId;

                return (
                  <div
                    key={planId}
                    className={`bg-white border rounded-2xl p-6 relative flex flex-col justify-between ${
                      plan.isActive
                        ? 'border-slate-200'
                        : 'border-slate-200 opacity-60 bg-slate-50/50'
                    }`}
                  >

                    <div>

                      {/* Plan header */}

                      <div className="flex items-center justify-between mb-4">

                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                            plan.isActive
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          {plan.isActive
                            ? 'Active Package'
                            : 'Archived'}
                        </span>

                        <div className="flex items-center gap-1">

                          {/* Edit */}

                          <button
                            onClick={() =>
                              handleOpenEditModal(plan)
                            }
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                            title="Edit Plan"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {/* Toggle */}

                          <button
                            onClick={() =>
                              handleToggleStatus(planId)
                            }
                            disabled={
                              togglePlanMutation.isPending
                            }
                            className={`p-1.5 rounded-lg cursor-pointer ${
                              plan.isActive
                                ? 'text-rose-400 hover:text-rose-600 hover:bg-rose-50'
                                : 'text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50'
                            }`}
                            title={
                              plan.isActive
                                ? 'Deactivate Plan'
                                : 'Activate Plan'
                            }
                          >
                            {isTogglingThisPlan ? (
                              <Loader2 className="w-4 h-4 animate-spin text-yellow-500" />
                            ) : (
                              <Power className="w-4 h-4" />
                            )}
                          </button>

                        </div>

                      </div>

                      {/* Name */}

                      <h3 className="text-xl font-bold font-serif text-slate-900">
                        {plan.name}
                      </h3>

                      {/* Price */}

                      <p className="text-3xl font-extrabold text-slate-900 mt-2 font-sans">

                        {formatPKR(plan.price)}

                        <span className="text-xs font-normal text-slate-400">
                          {' '}
                          / package
                        </span>

                      </p>

                      {/* AI Credits */}

                      <div className="my-6 p-3 rounded-xl bg-yellow-50/60 border border-yellow-200/50 flex items-center gap-3">

                        <div className="w-9 h-9 rounded-lg bg-yellow-100 flex items-center justify-center text-yellow-700">
                          <Zap className="w-5 h-5" />
                        </div>

                        <div>

                          <span className="text-[10px] font-bold uppercase text-yellow-800 block">
                            AI Credit Output
                          </span>

                          <span className="text-sm font-bold text-slate-900">
                            {plan.aiCredits?.toLocaleString()} Credits
                          </span>

                        </div>

                      </div>

                      {/* Features */}

                      <ul className="space-y-2 text-xs text-slate-600 mb-6">

                        {plan.features?.map(
                          (feature, index) => (
                            <li
                              key={index}
                              className="flex items-center gap-2"
                            >
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />

                              <span>{feature}</span>
                            </li>
                          )
                        )}

                      </ul>

                    </div>

                    {/* Created */}

                    <div className="pt-4 border-t border-slate-100 text-[10px] text-slate-400 text-center">

                      Created on{' '}

                      {plan.createdAt
                        ? new Date(
                            plan.createdAt
                          ).toLocaleDateString()
                        : 'N/A'}

                    </div>

                  </div>
                );
              })}

            </div>
          )}
        </>
      )}

      {/* =====================================================
          TAB 2 — COMPANY SUBSCRIPTIONS
      ====================================================== */}

      {activeTab === 'company-subscriptions' && (

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">

          <div className="p-6 border-b border-slate-100 flex items-center justify-between">

            <div>

              <h3 className="text-base font-bold font-serif text-slate-900 inline-flex items-center gap-2">

                <CreditCard className="w-5 h-5 text-yellow-500" />

                Subscription History

              </h3>

              <p className="text-xs text-slate-500 mt-0.5">
                Purchased company subscriptions and payment references
              </p>

            </div>

          </div>

          <div className="overflow-x-auto">

            {isLoadingLedger ? (

              <div className="py-12 flex justify-center items-center text-slate-400 gap-2">

                <Loader2 className="w-5 h-5 animate-spin text-yellow-500" />

                <span className="text-xs">
                  Loading company subscription history...
                </span>

              </div>

            ) : (

              <table className="w-full text-left text-xs">

                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100 uppercase tracking-wider">

                  <tr>

                    <th className="py-3.5 px-6">
                      Company
                    </th>

                    <th className="py-3.5 px-6">
                      Plan
                    </th>

                    <th className="py-3.5 px-6 text-right">
                      Price
                    </th>

                    <th className="py-3.5 px-6 text-center">
                      AI Credits
                    </th>

                    <th className="py-3.5 px-6 text-center">
                      Status
                    </th>

                    <th className="py-3.5 px-6 text-right">
                      Purchased At
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-100">

                  {companySubscriptions.length === 0 ? (

                    <tr>

                      <td
                        colSpan="6"
                        className="py-8 text-center text-slate-400"
                      >
                        No company subscription transactions
                        recorded yet.
                      </td>

                    </tr>

                  ) : (

                    companySubscriptions.map((sub) => (

                      <tr
                        key={sub._id || sub.id}
                        className="hover:bg-slate-50/50"
                      >

                        {/* Company */}

                        <td className="py-3.5 px-6">

                          <div className="flex items-center gap-3">

                            {sub.company?.logo ? (

                              <img
                                src={sub.company.logo}
                                alt=""
                                className="w-7 h-7 rounded-lg object-cover"
                              />

                            ) : (

                              <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                                {sub.company?.name?.[0] || 'C'}
                              </div>

                            )}

                            <div>

                              <p className="font-bold text-slate-900">
                                {sub.company?.companyName || 'N/A'}
                              </p>

                              <p className="text-[10px] text-slate-400">
                                {sub.company?.email || 'N/A'}
                              </p>

                            </div>

                          </div>

                        </td>

                        {/* Plan */}

                        <td className="py-3.5 px-6 font-semibold text-slate-800">
                          {sub.plan?.name || 'Custom Package'}
                        </td>

                        {/* Price */}

                        <td className="py-3.5 px-6 text-right font-bold text-slate-900">
                          {formatPKR(
                            sub.plan?.price ||
                              sub.payment?.amount ||
                              0
                          )}
                        </td>

                        {/* AI Credits */}

                        <td className="py-3.5 px-6 text-center">

                          <span className="inline-flex items-center gap-1 font-semibold text-yellow-700 bg-yellow-50 px-2 py-0.5 rounded-md border border-yellow-200/50">

                            <Zap className="w-3 h-3 text-yellow-500" />

                            {sub.plan?.aiCredits?.toLocaleString() ||
                              0}

                          </span>

                        </td>

                        {/* Status */}

                        <td className="py-3.5 px-6 text-center">

                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              sub.status === 'active'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {sub.status}
                          </span>

                        </td>

                        {/* Purchased */}

                        <td className="py-3.5 px-6 text-right text-slate-500">

                          {sub.createdAt
                            ? new Date(
                                sub.createdAt
                              ).toLocaleDateString()
                            : 'N/A'}

                        </td>

                      </tr>

                    ))

                  )}

                </tbody>

              </table>

            )}

          </div>

        </div>
      )}

      {/* =====================================================
          CREATE / EDIT MODAL
      ====================================================== */}

      {isModalOpen && (

        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">

          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200">

            {/* Modal Header */}

            <h3 className="text-lg font-bold font-serif text-slate-900 mb-1">

              {editingPlan
                ? 'Edit Subscription Plan'
                : 'Create Subscription Plan'}

            </h3>

            <p className="text-xs text-slate-500 mb-4">
              Set pricing details and AI credit limits.
            </p>

            {/* Error */}

            {submitError && (

              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-700">

                <AlertCircle className="w-4 h-4 shrink-0" />

                <span>
                  {submitError?.response?.data?.message ||
                    submitError?.message ||
                    'Failed to save subscription plan'}
                </span>

              </div>

            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >

              {/* Plan Name */}

              <div>

                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Plan Name
                </label>

                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                    })
                  }
                  placeholder="e.g. Premium Agency"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200"
                  required
                />

              </div>

              {/* Price + Credits */}

              <div className="grid grid-cols-2 gap-3">

                <div>

                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Price (PKR)
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200"
                    required
                  />

                </div>

                <div>

                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    AI Credits
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={formData.aiCredits}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        aiCredits: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200"
                    required
                  />

                </div>

              </div>

              {/* Features */}

              <div>

                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Features (Comma Separated)
                </label>

                <textarea
                  rows="3"
                  value={formData.features}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      features: e.target.value,
                    })
                  }
                  placeholder="200 AI Credits, Priority Support, Custom Branding"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200"
                />

              </div>

              {/* Buttons */}

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">

                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="btn-outline text-xs py-2 px-4 w-1/2 cursor-pointer"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary text-xs py-2 px-4 w-1/2 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                >

                  {isSubmitting && (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  )}

                  {editingPlan
                    ? 'Update Plan'
                    : 'Save Plan'}

                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}