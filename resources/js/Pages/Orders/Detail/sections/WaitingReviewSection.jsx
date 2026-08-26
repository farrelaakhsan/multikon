import { HelpCircle } from 'lucide-react';
import Banner from '../../../../Components/Order/Banner';

export default function WaitingReviewSection() {
  return (
    <Banner
      variant="purple"
      icon={HelpCircle}
      title="Menunggu Peninjauan"
      description="Admin sedang meninjau kebutuhan dan menentukan harga untuk pesanan custom-mu."
    />
  );
}
