import React from "react";
import { CheckCircle2, Calendar, CreditCard, ArrowRight, Mail, Sparkles, MapPin } from "lucide-react";

const GenericConfirmationPage = ({
  type = "booking",
  orderId,
  customerEmail,
  details = {},
  onPrimaryAction,
}) => {
  const isSubscription = type === "subscription";

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        
        {/* HEADER */}
        <div className="bg-emerald-50/60 p-8 text-center border-b border-emerald-100">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-slate-900">
            {isSubscription ? "Subscription Active!" : "Booking Confirmed!"}
          </h1>
          <p className="text-slate-600 text-sm mt-2">
            Reference ID: <span className="font-semibold text-slate-900">#{orderId || "N/A"}</span>
          </p>
        </div>

        {/* DETAILS BODY */}
        <div className="p-6 md:p-8 space-y-6">
          
          {/* EMAIL NOTICE */}
          {customerEmail && (
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs md:text-sm text-slate-600">
              <Mail className="w-5 h-5 text-slate-400 shrink-0" />
              <span>
                Confirmation details sent to <strong className="text-slate-900">{customerEmail}</strong>.
              </span>
            </div>
          )}

          {/* SUMMARY CARD */}
          <div className="border border-slate-100 rounded-2xl p-5 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {isSubscription ? "Plan Summary" : "Trip Summary"}
            </h2>

            <div className="flex justify-between items-start gap-4">
              <div>
                <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                  {isSubscription && <Sparkles className="w-5 h-5 text-amber-500" />}
                  {details?.title || "Payment Item"}
                </h3>
                {details?.subtitle && (
                  <p className="text-xs text-slate-500 mt-1">{details.subtitle}</p>
                )}

                <div className="flex flex-wrap gap-4 text-xs text-slate-500 mt-3">
                  {isSubscription ? (
                    <>
                      {details?.nextBillingDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          Renews: {details.nextBillingDate}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                        Auto-renew active
                      </span>
                    </>
                  ) : (
                    <>
                      {details?.startDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {details.startDate}
                        </span>
                      )}
                      {details?.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {details.location}
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400 block">Total Charged</span>
                <span className="text-lg font-bold text-slate-900">{details?.amount || "$0.00"}</span>
              </div>
            </div>
          </div>

          {/* ACTION BUTTON */}
          <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              onClick={onPrimaryAction}
              className="w-full sm:flex-1 py-3 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm transition flex items-center justify-center gap-2"
            >
              {isSubscription ? "Go to Subscription Dashboard" : "View My Bookings"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default GenericConfirmationPage;