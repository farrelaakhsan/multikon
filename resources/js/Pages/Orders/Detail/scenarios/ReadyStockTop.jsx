import { useState } from 'react';
import { router } from '@inertiajs/react';
import { useOrderScenario } from '../useOrderScenario';
import LayoutShell from '../LayoutShell';
import { formatPrice } from '../../../../utils/format';

// Sections
import ProofUnderReviewSection from '../sections/ProofUnderReviewSection';
import PaymentSummarySection from '../sections/PaymentSummarySection';
import TopPoSection from '../sections/TopPoSection';
import TopSettlementSection from '../sections/TopSettlementSection';
import CourierSelectionSection from '../sections/CourierSelectionSection';
import InTransitSection from '../sections/InTransitSection';
import PickupReadySection from '../sections/PickupReadySection';
import ShippingInfoSection from '../sections/ShippingInfoSection';
import PickupLocationSection from '../sections/PickupLocationSection';
import ProductListSection from '../sections/ProductListSection';
import DocumentSection from '../sections/DocumentSection';
import SettlementUploadModal from '../modals/SettlementUploadModal';

// Shared components
import SectionCard from '../../../../Components/Order/SectionCard';
import Timeline from '../../../../Components/Order/Timeline';
import ImageLightboxModal from '../../../../Components/Order/ImageLightboxModal';

export default function ReadyStockTop({ order }) {
  const flags = useOrderScenario(order);
  const {
    isCargo, orderCancelled, needsShippingCost,
    showPaymentSummaryRow, showCourierSelection,
    hasCustomDetailFields, authUser,
    settlementBankData, paymentSettings,
  } = flags;

  const [selectedCourier, setSelectedCourier] = useState(null);
  const [couriers, setCouriers] = useState(null);
  const [loadingCouriers, setLoadingCouriers] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const [showMethodPicker, setShowMethodPicker] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [settlementModalOpen, setSettlementModalOpen] = useState(false);

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
      {order.payment_proof && <ProofUnderReviewSection order={order} />}

      <TopPoSection order={order} />

      {order.status === 'waiting_settlement' && (
        <TopSettlementSection
          order={order} showMethodPicker={showMethodPicker} setShowMethodPicker={setShowMethodPicker}
          selectedMethod={selectedMethod} setSelectedMethod={setSelectedMethod}
          onOpenSettlementModal={() => setSettlementModalOpen(true)}
        />
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

      <SettlementUploadModal
        orderId={order.id} orderCode={order.order_code}
        isOpen={settlementModalOpen} onClose={() => setSettlementModalOpen(false)}
        initialMethod={selectedMethod}
        bankInfo={{
          bankName: order.bank_name || settlementBankData?.bank,
          accountNumber: order.bank_account_number || settlementBankData?.account,
          accountHolder: order.bank_account_name || settlementBankData?.name,
        }}
        qrisImageUrl={paymentSettings.qris_image_url}
      />

      {modalImage && <ImageLightboxModal src={modalImage.src} title={modalImage.title} onClose={() => setModalImage(null)} />}
    </LayoutShell>
  );
}
