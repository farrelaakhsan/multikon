export default function ImageUploadSection({ data, set, errors }) {
    return (
        <div>
            <h2 className="text-sm font-semibold text-slate-700 mb-4">Foto Produk</h2>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">URL Gambar</label>
                    <input
                        type="text"
                        value={data.image}
                        onChange={(e) => set("image", e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/20 focus:border-[#F59E0B] transition-all"
                        placeholder="https://contoh.com/gambar.jpg"
                    />
                </div>

                <div className="relative flex items-center gap-3">
                    <div className="flex-1 h-px bg-slate-200" />
                    <span className="text-xs font-medium text-slate-400">atau upload file</span>
                    <div className="flex-1 h-px bg-slate-200" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Upload File Gambar</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => set("image_file", e.target.files[0] || null)}
                        className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#F59E0B] file:text-[#1E293B] hover:file:brightness-105 transition cursor-pointer"
                    />
                    <p className="text-xs text-slate-400 mt-1">JPG, JPEG, PNG, WEBP — maks. 2MB</p>
                    {errors.image_file && <p className="text-xs text-red-500 mt-1">{errors.image_file}</p>}
                </div>

                {data.image && !data.image_file && (
                    <div>
                        <p className="text-xs font-medium text-slate-500 mb-2">Preview</p>
                        <div className="rounded-lg border border-slate-200 overflow-hidden bg-slate-50">
                            <img
                                src={data.image.startsWith("http") ? data.image : `/storage/${data.image}`}
                                alt="Preview"
                                className="h-48 w-full object-cover"
                                onError={(e) => { e.target.style.display = "none"; }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
