import { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, MessageCircle, CircleCheck } from 'lucide-react';
import PublicLayout from '../../Layouts/PublicLayout';
import ImageLightboxModal from '../../Components/Order/ImageLightboxModal';
import PaymentCard from '../../Components/Payment/PaymentCard';
import UploadProofModal from '../../Components/Payment/UploadProofModal';
import TerminBillsCard from '../../Components/Payment/TerminBillsCard';
import ProofSentCard from '../../Components/Payment/ProofSentCard';
import TopStatusCard from '../../Components/Payment/TopStatusCard';

export default function Payment({ order }) {
    const { props } = usePage();
    const paymentSettings = props.paymentSettings || {};
    const bankAccounts = paymentSettings.bank_accounts || [];
    const qrisImageUrl = paymentSettings.qris_image_url;

    const isBank = order.payment_method?.startsWith('bank_');
    const bankIndex = isBank ? parseInt(order.payment_method.replace('bank_', ''), 10) : -1;
    const bankData = isBank && bankAccounts[bankIndex] ? bankAccounts[bankIndex] : null;

    const isTop = order.payment_method === 'top';
    const isTermin = order.payment_method === 'termin';

    const bills = order.termin_bills || [];
    const paidBills = order.paid_bills || [];
    const currentBill = bills.find((b) => !paidBills.includes(b.key)) || null;

    const [modalOpen, setModalOpen] = useState(false);
    const [uploadModalOpen, setUploadModalOpen] = useState(false);

    const isPaid = order.payment_status === 'paid';
    const hasProof = !!order.payment_proof;
    const showProofSent = hasProof;

    if (isPaid) {
        return (
            <PublicLayout>
                <Head title={`Pembayaran - ${order.order_code}`} />
                <div className="max-w-content mx-auto px-6 py-6 md:py-8">
                    <div className="mb-5">
                        <Link href={`/order/${order.order_code}/tracking`} className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-3">
                            <ArrowLeft className="w-4 h-4" /> Kembali
                        </Link>
                        <h1 className="text-xl font-bold text-slate-900">Pembayaran</h1>
                    </div>

                    <div className="relative bg-white border border-slate-200 rounded-[20px] overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500" />
                        <div className="px-[30px] py-[30px] pl-[34px] text-center">
                            <div className="w-[52px] h-[52px] rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-3.5">
                                <CircleCheck className="w-[26px] h-[26px] text-emerald-500" />
                            </div>
                            <p className="text-[18px] font-extrabold text-slate-800 mb-1.5">Pembayaran Terkonfirmasi</p>
                            <p className="text-[13px] text-slate-600 leading-relaxed mb-5 max-w-[380px] mx-auto">
                                Pembayaran Anda telah kami verifikasi. Pesanan sedang kami proses.
                            </p>
                            <Link
                                href={`/order/${order.order_code}/tracking`}
                                className="inline-block text-[14px] font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl px-7 py-[13px] transition-colors"
                            >
                                Lacak Pesanan
                            </Link>
                        </div>
                    </div>
                </div>
            </PublicLayout>
        );
    }

    return (
        <PublicLayout>
            <Head title={`Pembayaran - ${order.order_code}`} />

            <div className="max-w-content mx-auto px-6 py-6 md:py-8">
                <div className="mb-5">
                    <Link href={`/order/${order.order_code}/tracking`} className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-3">
                        <ArrowLeft className="w-4 h-4" /> Kembali
                    </Link>
                    <h1 className="text-xl font-bold text-slate-900">Pembayaran</h1>
                </div>

                <div className="space-y-4">
                    {isTop && <TopStatusCard order={order} />}

                    {isTermin && <TerminBillsCard terminBills={order.termin_bills} paidBills={order.paid_bills} />}

                    {showProofSent && (
                        <ProofSentCard
                            order={order}
                            onViewProof={() => setModalOpen(true)}
                            onReupload={() => setUploadModalOpen(true)}
                        />
                    )}

                    {!showProofSent && (
                        <PaymentCard
                            order={order}
                            bankData={bankData}
                            qrisImageUrl={qrisImageUrl}
                            onOpenUploadModal={() => setUploadModalOpen(true)}
                            activeBill={isTermin ? currentBill : null}
                        />
                    )}

                    {showProofSent && (
                        <div className="flex flex-col gap-2">
                            <Link href={`/order/${order.order_code}/tracking`} className="block text-center px-5 py-3 rounded-[12px] border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition">
                                Lihat Detail Pesanan
                            </Link>
                            <a
                                href="https://wa.me/6285156094757"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-1.5 px-5 py-3 rounded-[12px] bg-emerald-50 text-emerald-700 text-sm font-semibold hover:bg-emerald-100 transition"
                            >
                                <MessageCircle className="w-4 h-4" /> Bantuan CS
                            </a>
                        </div>
                    )}
                </div>
            </div>

            <UploadProofModal
                order={order}
                isOpen={uploadModalOpen}
                onClose={() => setUploadModalOpen(false)}
            />

            {modalOpen && (
                <ImageLightboxModal src={order.payment_proof} title="Bukti Pembayaran" onClose={() => setModalOpen(false)} />
            )}
        </PublicLayout>
    );
}
