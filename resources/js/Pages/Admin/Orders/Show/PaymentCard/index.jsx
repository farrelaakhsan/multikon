import TopPayment from "./TopPayment";
import TerminPayment from "./TerminPayment";
import StandardPayment from "./StandardPayment";

export default function PaymentCard({ order, onConfirm, onReject, onPreviewProof, accentColor }) {
    const isTop = order.payment_method === 'top';
    const isTermin = order.payment_method === 'termin';

    if (isTop) {
        return <TopPayment order={order} accentColor={accentColor} />;
    }

    if (isTermin && order.termin_bills?.length > 0) {
        return <TerminPayment order={order} accentColor={accentColor} />;
    }

    return (
        <StandardPayment
            order={order}
            onConfirm={onConfirm}
            onReject={onReject}
            onPreviewProof={onPreviewProof}
            accentColor={accentColor}
        />
    );
}
