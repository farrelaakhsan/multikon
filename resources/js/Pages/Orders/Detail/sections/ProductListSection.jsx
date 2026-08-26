import { Package } from 'lucide-react';
import FileThumbnail from '../../../../Components/Order/FileThumbnail';
import ProductImage from '../../../../Components/ui/ProductImage';
import { formatPrice } from '../../../../utils/format';

export default function ProductListSection({ order, hasCustomDetailFields, needsShippingCost, onPreviewImage }) {
  const isCustom = order.is_custom;

  return (
    <div className="bg-white border border-slate-200 rounded-[20px] overflow-hidden">
      <div className="px-7 pt-6 pb-4 flex items-center gap-2">
        <Package className="w-[17px] h-[17px] text-slate-400" />
        <p className="text-[15px] font-bold text-slate-800">Produk Dipesan</p>
      </div>

      {/* Desktop table header */}
      <div className="hidden sm:grid px-7 pb-3 border-b border-slate-200"
           style={{ gridTemplateColumns: '56px 1fr 130px 50px 130px', gap: '12px' }}>
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Foto</span>
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Produk</span>
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Harga</span>
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Qty</span>
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide text-right">Total</span>
      </div>

      <div className="px-7">
        {(order.items?.length > 1 ? order.items : [{ product_image: order.product_image, product_name: order.product_name, quantity: order.quantity, unit_price: order.product_price, is_custom: isCustom }]).map((item, idx) => (
          <div key={idx}>
            {/* Desktop row */}
            <div
              className={`hidden sm:grid items-center py-4 border-b border-slate-100 last:border-b-0 ${hasCustomDetailFields ? 'last:pb-5' : ''}`}
              style={{ gridTemplateColumns: '56px 1fr 130px 50px 130px', gap: '12px' }}
            >
              <ProductImage src={item.product_image} alt={item.product_name} className="w-[52px] h-[52px] rounded-[10px]" />
              <div>
                <p className="text-[13.5px] font-semibold text-slate-800">{item.product_name}</p>
                <span className={`inline-block text-[10.5px] font-semibold px-2 py-0.5 rounded-full mt-1 ${
                  item.is_custom ? 'bg-brand-900 text-brand-amber' : 'bg-emerald-50 text-emerald-700'
                }`}>
                  {item.is_custom ? 'Product Custom' : 'Ready Stock'}
                </span>
              </div>
              <p className="text-[13px] text-slate-800 font-medium">Rp{formatPrice(item.unit_price)}</p>
              <p className="text-[13px] text-slate-600">{item.quantity}</p>
              <p className="text-[13.5px] font-bold text-slate-800 text-right">Rp{formatPrice(item.unit_price * item.quantity)}</p>
            </div>

            {/* Mobile row */}
            <div className={`sm:hidden flex gap-3 py-4 border-b border-slate-100 last:border-b-0 ${hasCustomDetailFields ? 'last:pb-5' : ''}`}>
              <ProductImage src={item.product_image} alt={item.product_name} className="w-14 h-14 rounded-[10px] shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[13.5px] font-semibold text-slate-800">{item.product_name}</p>
                <span className={`inline-block text-[10.5px] font-semibold px-2 py-0.5 rounded-full mt-1 mb-1.5 ${
                  item.is_custom ? 'bg-brand-900 text-brand-amber' : 'bg-emerald-50 text-emerald-700'
                }`}>
                  {item.is_custom ? 'Product Custom' : 'Ready Stock'}
                </span>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-[12px] text-slate-500">Rp{formatPrice(item.unit_price)} x {item.quantity}</p>
                  <p className="text-[13.5px] font-bold text-slate-800">Rp{formatPrice(item.unit_price * item.quantity)}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {hasCustomDetailFields && (
        <div className="border-t border-slate-200 px-7 pt-5 pb-5 space-y-3">
          {order.custom_requirements && (
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-0.5">Kebutuhan</p>
              <p className="text-[13px] text-slate-700 max-w-prose">{order.custom_requirements}</p>
            </div>
          )}
          {order.custom_specifications && (
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-0.5">Spesifikasi</p>
              <p className="text-[13px] text-slate-700 whitespace-pre-line max-w-prose">{order.custom_specifications}</p>
            </div>
          )}
          {order.custom_notes && (
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-0.5">Catatan</p>
              <p className="text-[13px] text-slate-700 max-w-prose">{order.custom_notes}</p>
            </div>
          )}
          {order.reference_file_url && (
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">File Referensi</p>
              <FileThumbnail
                url={order.reference_file_url}
                label="Referensi"
                onPreview={() => onPreviewImage?.({ src: order.reference_file_url, title: 'File Referensi' })}
              />
            </div>
          )}
        </div>
      )}

      {/* Rincian Tagihan */}
      <div className="border-t border-slate-200 px-7 pt-5 pb-6">
        <div className="flex justify-between mb-4">
          <p className="text-[13px] text-slate-600">Subtotal Produk ({order.items?.length || 1} Barang)</p>
          <p className="text-[13px] text-slate-800 font-semibold">Rp{formatPrice(order.subtotal)}</p>
        </div>

        <div className="border-t border-dashed border-slate-200 pt-3.5 mb-4">
          <div className="flex justify-between">
            <p className="text-[13px] text-slate-600">Ongkos Kirim</p>
            <p className={`text-[13px] font-semibold ${order.shipping_cost ? 'text-slate-800' : 'text-emerald-700'}`}>
              {needsShippingCost ? 'Belum Ditentukan' : order.shipping_cost ? `Rp${formatPrice(order.shipping_cost)}` : 'Gratis'}
            </p>
          </div>
        </div>

        {!needsShippingCost && (
          <div className="border-t border-slate-200 pt-4 flex justify-between items-center">
            <p className="text-[14.5px] font-bold text-slate-800">Total Belanja</p>
            <p className="text-[22px] font-extrabold text-amber-500">Rp{formatPrice(order.total_price)}</p>
          </div>
        )}
      </div>
    </div>
  );
}
