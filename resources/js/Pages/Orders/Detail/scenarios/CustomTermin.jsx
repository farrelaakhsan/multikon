import { useState } from 'react';
import { router } from '@inertiajs/react';
import { useOrderScenario } from '../useOrderScenario';
import LayoutShell from '../LayoutShell';
import { formatPrice } from '../../../../utils/format';

// Sections
import PaymentSummarySection from '../sections/PaymentSummarySection';
import WaitingReviewSection from '../sections/WaitingReviewSection';
import TerminBillsSection from '../sections/TerminBillsSection';
import CourierSelectionSection from '../sections/CourierSelectionSection';
import InTransitSection from '../sections/InTransitSection';
import PickupReadySection from '../sections/PickupReadySection';
import ShippingInfoSection from '../sections/ShippingInfoSection';
import PickupLocationSection from '../sections/PickupLocationSection';
import ProductListSection from '../sections/ProductListSection';
import DocumentSection from '../sections/DocumentSection';
import PopupMetodeBayar from '../modals/PopupMetodeBayar';

// Shared components
import SectionCard from '../../../../Components/Order/SectionCard';
import Timeline from '../../../../Components/Order/Timeline';
import ImageLightboxModal from '../../../../Components/Order/ImageLightboxModal';

export default function CustomTermin({ order }) {
  const flags = useOrderScenario(order);
  const {
    isCargo, orderCancelled, needsShippingCost,
    showPaymentSummaryRow, showCourierSelection,
    hasCustomDetailFields, authUser,
  } = flags;

  const [selectedCourier, setSelectedCourier] = useState(null);
  const [couriers, setCouriers] = useState(null);
  const [loadingCouriers, setLoadingCouriers] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const [metodeBayarOpen, setMetodeBayarOpen] = useState(false);
  const [activeTerminStage, setActiveTerminStage] = useState(null);

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

  const handlePayStage = (stageKey, options = {}) => {
    const stage = order.termin?.stages?.find((s) => s.key === stageKey);
    if (stage) {
      setActiveTerminStage(stage);
      setMetodeBayarOpen(true);
    }
  };

  return (
    <LayoutShell orderCode={order.order_code}>
      {order.status === 'waiting_review' && <WaitingReviewSection />}

      {order.termin && !needsShippingCost && order.status !== 'waiting_review' && (
        <TerminBillsSection order={order} onPayStage={handlePayStage} />
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

      <PopupMetodeBayar
        orderId={order.id}
        orderCode={order.order_code}
        stage={activeTerminStage}
        isOpen={metodeBayarOpen}
        onClose={() => { setMetodeBayarOpen(false); setActiveTerminStage(null); }}
      />

      {modalImage && <ImageLightboxModal src={modalImage.src} title={modalImage.title} onClose={() => setModalImage(null)} />}
    </LayoutShell>
  );
}
