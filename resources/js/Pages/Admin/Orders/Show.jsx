import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { DollarSign } from 'lucide-react';
import AdminLayout from '../../../Layouts/AdminLayout';
import ImageLightboxModal from '../../../Components/Order/ImageLightboxModal';
import { STATUS_TONE_MAP, ACCENT_MAP, WORKSHOP } from './Show/constants';
import OrderHeader from './Show/OrderHeader';
import { ReadyStatusCTACard, CompleteOverrideCTACard } from './Show/CtaCards';
import OrderStatusCard from './Show/OrderStatusCard';
import PaymentCard from './Show/PaymentCard';
import ProductTableCard from './Show/ProductTableCard';
import CustomerInfoCard from './Show/CustomerInfoCard';
import ShippingInfoCard from './Show/ShippingInfoCard';
import DocumentsCard from './Show/DocumentsCard';
import SetPriceModal from './Show/modals/SetPriceModal';
import ShippingDataModal from './Show/modals/ShippingDataModal';

export default function OrderShow({ order }) {
    const [modalImage, setModalImage] = useState(null);
    const [shippingModalOpen, setShippingModalOpen] = useState(false);
    const [priceModalOpen, setPriceModalOpen] = useState(false);
    const [shippingForm, setShippingForm] = useState({
        courier_name: order.courier_name || '',
        tracking_number: order.tracking_number || '',
        driver_contact: order.driver_contact || '',
        proof: null,
    });
    const [priceForm, setPriceForm] = useState({ custom_price: order.custom_price || '', estimated_weight: order.estimated_weight || '' });

    const isCargo = order.shipping_method === 'cargo';
    const isCustom = order.order_type === 'custom';
    const statusTone = STATUS_TONE_MAP[order.status] || 'menunggu';
    const accentColor = ACCENT_MAP[statusTone] || ACCENT_MAP.menunggu;
    const isProcessing = order.status === 'processing' || order.status === 'in_production';
    const isShipped = order.status === 'shipped';

    const copyCode = () => navigator.clipboard.writeText(order.order_code);
    const handleConfirmPayment = () => router.post(`/admin/orders/${order.id}/confirm-payment`);
    const handleRejectPayment = () => router.post(`/admin/orders/${order.id}/reject-payment`);

    const handleSubmitShipping = () => {
        const formData = new FormData();
        formData.append('courier_name', shippingForm.courier_name);
        formData.append('tracking_number', shippingForm.tracking_number);
        formData.append('driver_contact', shippingForm.driver_contact);
        if (shippingForm.proof) formData.append('shipping_proof', shippingForm.proof);
        router.post(`/admin/orders/${order.id}/shipping`, formData, { forceFormData: true, onSuccess: () => setShippingModalOpen(false) });
    };

    const handleSubmitPrice = () => {
        router.patch(`/admin/orders/${order.id}/set-price`, {
            custom_price: priceForm.custom_price,
            estimated_weight: isCargo ? priceForm.estimated_weight : null,
        }, { onSuccess: () => setPriceModalOpen(false) });
    };

    const handleOverrideComplete = () => {
        const finalStatus = isCustom ? 'done' : 'completed';
        router.patch(`/admin/orders/${order.id}/status`, { status: finalStatus });
    };

    const customerData = {
        name: order.customer_name,
        phone: order.whatsapp_number,
        note: order.notes,
        customDetails: isCustom ? {
            requirements: order.custom_requirements,
            specifications: order.custom_specifications,
            notes: order.custom_notes,
            referenceFileUrl: order.reference_file_url,
        } : null,
    };

    const shippingData = {
        method: order.shipping_method,
        workshopName: WORKSHOP.name,
        pickupPIC: WORKSHOP.pic,
        address: order.address,
        courierName: order.courier_name,
        trackingNumber: order.tracking_number,
        driverContact: order.driver_contact,
        proofUrl: order.shipping_proof,
    };

    const items = order.items?.length > 0
        ? order.items
        : [{ product_image: order.product_image, product_name: order.product_name, quantity: order.quantity, unit_price: order.product_price }];

    return (
        <AdminLayout>
            <Head title={`Detail Pesanan - ${order.order_code}`} />

            <div className="px-6 py-6 md:py-8 pb-24">
                <OrderHeader orderCode={order.order_code} onCopyCode={copyCode} />

                {isProcessing && (
                    <ReadyStatusCTACard shippingMethod={order.shipping_method} onConfirm={() => setShippingModalOpen(true)} />
                )}

                {isShipped && (
                    <CompleteOverrideCTACard onConfirm={handleOverrideComplete} />
                )}

                <OrderStatusCard
                    statusLabel={order.status_label}
                    steps={order.progress_steps}
                    cancelled={order.status === 'cancelled'}
                    accentColor={accentColor}
                />

                <PaymentCard
                    order={order}
                    onConfirm={handleConfirmPayment}
                    onReject={handleRejectPayment}
                    onPreviewProof={(src, title) => setModalImage({ src, title })}
                    accentColor={accentColor}
                />

                <ProductTableCard
                    items={items}
                    subtotal={order.subtotal}
                    shippingCost={isCargo ? order.shipping_cost : null}
                    total={order.total_price}
                    isCustom={isCustom}
                    accentColor={accentColor}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                    <CustomerInfoCard customer={customerData} isCustom={isCustom} accentColor={accentColor} />
                    <ShippingInfoCard shipping={shippingData} onEdit={() => setShippingModalOpen(true)} onPreviewProof={(src, title) => setModalImage({ src, title })} accentColor={accentColor} />
                </div>

                <DocumentsCard
                    documents={order.documents}
                    orderId={order.id}
                    onReissue={(docType) => router.post(`/admin/orders/${order.id}/documents/${docType}/issue`)}
                    accentColor={accentColor}
                />
            </div>

            {isCustom && order.status === 'waiting_review' && !order.custom_price && (
                <div className="fixed bottom-0 inset-x-0 lg:left-64 z-40 bg-white border-t border-slate-200 border-l-4 border-l-amber-400 shadow-sticky">
                    <div className="px-6 py-3 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-amber-100 shrink-0">
                                <DollarSign className="w-4.5 h-4.5 text-amber-600" />
                            </span>
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-slate-900">Pesanan Custom — Belum ada harga</p>
                                <p className="text-xs text-slate-500">Tetapkan harga untuk melanjutkan ke pembayaran</p>
                            </div>
                        </div>
                        <button type="button" onClick={() => setPriceModalOpen(true)} className="px-5 py-2.5 rounded-pill bg-brand-amber text-brand-900 text-sm font-bold hover:brightness-95 transition shrink-0">
                            Tetapkan Harga
                        </button>
                    </div>
                </div>
            )}

            <SetPriceModal
                open={priceModalOpen}
                onClose={() => setPriceModalOpen(false)}
                priceForm={priceForm}
                setPriceForm={setPriceForm}
                onSubmit={handleSubmitPrice}
                isCargo={isCargo}
            />

            <ShippingDataModal
                open={shippingModalOpen}
                onClose={() => setShippingModalOpen(false)}
                shippingForm={shippingForm}
                setShippingForm={setShippingForm}
                onSubmit={handleSubmitShipping}
                isCargo={isCargo}
            />

            {modalImage && (
                <ImageLightboxModal src={modalImage.src} title={modalImage.title} onClose={() => setModalImage(null)} />
            )}
        </AdminLayout>
    );
}
