import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Clock } from 'lucide-react';
import { useOrderScenario } from '../useOrderScenario';
import LayoutShell from '../LayoutShell';
import { formatPrice } from '../../../../utils/format';

// Sections
import ProofUnderReviewSection from '../sections/ProofUnderReviewSection';
import PaymentSummarySection from '../sections/PaymentSummarySection';
import WaitingReviewSection from '../sections/WaitingReviewSection';
import CourierSelectionSection from '../sections/CourierSelectionSection';
import InTransitSection from '../sections/InTransitSection';
import PickupReadySection from '../sections/PickupReadySection';
import ShippingInfoSection from '../sections/ShippingInfoSection';
import PickupLocationSection from '../sections/PickupLocationSection';
import ProductListSection from '../sections/ProductListSection';
import DocumentSection from '../sections/DocumentSection';

// Shared components
import SectionCard from '../../../../Components/Order/SectionCard';
import Timeline from '../../../../Components/Order/Timeline';
import HeroCard from '../../../../Components/Order/HeroCard';
import StatusBadge from '../../../../Components/Order/StatusBadge';
import Banner from '../../../../Components/Order/Banner';
import PaymentInstructionCard from '../../../../Components/Order/PaymentInstructionCard';
import ImageLightboxModal from '../../../../Components/Order/ImageLightboxModal';

// Payment method selection
import PaymentMethodSelectionCard from '../sections/PaymentMethodSelectionCard';
import QrisPaymentCard from '../sections/QrisPaymentCard';

export default function CustomFullPayment({ order }) {
  const flags = useOrderScenario(order);
  const {
    isCargo, isPaid, orderCancelled, needsShippingCost,
    showPaymentSummaryRow, showBigPaymentCard,
    showPaymentInstructionCard, showWaitingPayment, showPaymentAction,
    showCourierSelection, hasCustomDetailFields, authUser,
  } = flags;

  const [selectedCourier, setSelectedCourier] = useState(null);
  const [couriers, setCouriers] = useState(null);
  const [loadingCouriers, setLoadingCouriers] = useState(false);
  const [modalImage, setModalImage] = useState(null);

  const handleCekOngkir = async () => {
    setLoadingCouriers(true);
    try {
      const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
      const res = await fetch(`/orders/${order.id}/shipping-cost`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': token },
      });
      const data = await res.json();
      setCouriers(data.couriers || []);
    } finally {
      setLoadingCouriers(false);
    }
  };

  const handleSaveCourier = () => {
    if (!selectedCourier) return;
    router.patch(`/orders/${order.id}/shipping`, {
      courier_name: selectedCourier.name, courier_service: selectedCourier.service, shipping_cost: selectedCourier.cost,
    });
  };

  const handleCancelCourier = () => { setCouriers(null); setSelectedCourier(null); };
  const handleConfirmReceived = () => router.post(`/orders/${order.id}/confirm-received`);
  const copyResi = () => navigator.clipboard.writeText(order.tracking_number);

  return (
    <LayoutShell orderCode={order.order_code}>
      {order.status === 'waiting_review' && <WaitingReviewSection />}

      {showBigPaymentCard && (
        !isPaid ? (
          order.payment_proof ? (
            <ProofUnderReviewSection order={order} />
          ) : order.payment_method === 'pending' ? (
            <PaymentMethodSelectionCard order={order} />
          ) : order.payment_method === 'qris' ? (
            <QrisPaymentCard
              orderId={order.id}
              orderCode={order.order_code}
              totalFormatted={formatPrice(order.total_price)}
              paymentDeadline={order.payment_deadline}
              ctaHref={`/order/payment/${order.order_code}`}
            />
          ) : showPaymentInstructionCard ? (
            <PaymentInstructionCard
              orderId={order.id}
              orderCode={order.order_code} totalFormatted={formatPrice(order.total_price)}
              bankName={order.bank_name} bankCode={order.bank_code}
              bankAccountNumber={order.bank_account_number} bankAccountName={order.bank_account_name}
              paymentDeadline={order.payment_deadline} ctaHref={`/order/payment/${order.order_code}`}
            />
          ) : (
            <HeroCard
              statusSlot={<StatusBadge status={order.status} />}
              metaText={order.order_code}
              label="Total Tagihan"
              value={needsShippingCost ? undefined : `Rp ${formatPrice(order.total_price)}`}
              banner={showWaitingPayment ? <Banner variant="warning" icon={Clock} title="Menunggu pembayaran" /> : null}
              action={showPaymentAction ? (
                <a href={`/order/payment/${order.order_code}`} className="block text-center px-5 py-3 rounded-pill bg-brand-amber text-brand-900 text-sm font-bold hover:brightness-95 transition">
                  Bayar Sekarang
                </a>
              ) : null}
            />
          )
        ) : null
      )}

      {showCourierSelection && (
        <CourierSelectionSection
          couriers={couriers} loadingCouriers={loadingCouriers}
          selectedCourier={selectedCourier} setSelectedCourier={setSelectedCourier}
          onCekOngkir={handleCekOngkir} onSaveCourier={handleSaveCourier} onCancelCourier={handleCancelCourier}
        />
      )}

      {order.status === 'shipped' && (
        isCargo ? <InTransitSection order={order} onConfirmReceived={handleConfirmReceived} />
                : <PickupReadySection order={order} onConfirmReceived={handleConfirmReceived} />
      )}

      <SectionCard>
        <Timeline steps={order.progress_steps} cancelled={orderCancelled} />
      </SectionCard>

      {isCargo ? <ShippingInfoSection order={order} onCopyTrackingNumber={copyResi} onPreviewImage={setModalImage} /> : <PickupLocationSection order={order} />}

      <ProductListSection order={order} hasCustomDetailFields={hasCustomDetailFields} needsShippingCost={needsShippingCost} onPreviewImage={setModalImage} />

      <DocumentSection order={order} authUser={authUser} />

      {showPaymentSummaryRow && <PaymentSummarySection order={order} />}

      {modalImage && <ImageLightboxModal src={modalImage.src} title={modalImage.title} onClose={() => setModalImage(null)} />}
    </LayoutShell>
  );
}
