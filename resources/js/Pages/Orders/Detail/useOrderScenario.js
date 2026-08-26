import { usePage } from '@inertiajs/react';

/**
 * Custom hook untuk menghitung semua boolean flags dan derived state
 * berdasarkan order. Menentukan skenario pesanan (ready_stock_regular,
 * ready_stock_top, custom_full_payment, custom_termin).
 *
 * SINGLE SOURCE OF TRUTH untuk conditional rendering di scenario templates.
 */
export function useOrderScenario(order) {
  const { props } = usePage();
  const authUser = props.auth?.user ?? null;
  const paymentSettings = props.paymentSettings || {};
  const bankAccounts = paymentSettings.bank_accounts || [];

  // ─── Base flags ───────────────────────────────────────────
  const isCargo = order.shipping_method === 'cargo';
  const isPaid = order.payment_status === 'paid';
  const isCustom = order.is_custom;
  const isTop = order.payment_method === 'top';
  const isTermin = order.payment_method === 'termin';
  const isInstantPayment = order.payment_method?.startsWith('bank_') || order.payment_method === 'qris';
  const orderCancelled = order.status === 'cancelled' || order.payment_status === 'failed';

  // ─── Computed flags ───────────────────────────────────────
  const needsShippingCost =
    isCargo && !order.shipping_cost && !isPaid && order.status === 'waiting_payment' && order.estimated_weight;

  const showWaitingPayment =
    !isPaid && !needsShippingCost && order.status !== 'waiting_review' && !isTop;

  const showPaymentAction =
    !isPaid && !needsShippingCost && order.status !== 'waiting_review' && !isTop;

  const showCourierSelection =
    isCargo && !order.shipping_cost && !isPaid && order.status === 'waiting_payment' && order.estimated_weight;

  const showPaymentInstructionCard =
    !isPaid && isInstantPayment && !orderCancelled && order.status !== 'waiting_review' && !isTop && !isTermin && !order.payment_proof;

  const allTerminBillsPaid = isTermin && order.termin?.overallStatus === 'lunas';
  const showPaymentSummaryRow = isPaid && (!isTermin || allTerminBillsPaid);
  const showBigPaymentCard = !showPaymentSummaryRow && !isTermin && !needsShippingCost && order.status !== 'waiting_review';

  const hasCustomDetailFields =
    order.custom_requirements || order.custom_specifications || order.custom_notes || order.reference_file_url;

  // ─── Bank data for settlement ─────────────────────────────
  const settlementBankIndex = order.payment_method?.startsWith('bank_')
    ? parseInt(order.payment_method.replace('bank_', ''), 10)
    : (bankAccounts.length ? 0 : -1);
  const settlementBankData = settlementBankIndex >= 0 ? bankAccounts[settlementBankIndex] : null;

  // ─── Determine scenario ───────────────────────────────────
  let scenario;
  if (!isCustom && !isTop && !isTermin) {
    scenario = 'ready_stock_regular';
  } else if (!isCustom && isTop) {
    scenario = 'ready_stock_top';
  } else if (isCustom && !isTermin) {
    scenario = 'custom_full_payment';
  } else {
    scenario = 'custom_termin';
  }

  return {
    // Scenario key
    scenario,

    // Base flags
    isCargo,
    isPaid,
    isCustom,
    isTop,
    isTermin,
    isInstantPayment,
    orderCancelled,

    // Computed flags
    needsShippingCost,
    showWaitingPayment,
    showPaymentAction,
    showCourierSelection,
    showPaymentInstructionCard,
    allTerminBillsPaid,
    showPaymentSummaryRow,
    showBigPaymentCard,
    hasCustomDetailFields,

    // Payment settings
    authUser,
    paymentSettings,
    bankAccounts,
    settlementBankData,
  };
}
