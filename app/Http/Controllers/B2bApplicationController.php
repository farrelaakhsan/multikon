<?php

namespace App\Http\Controllers;

use App\Models\B2bApplication;
use App\Models\Order;
use App\Models\User;
use App\Services\OrderStatusFlowService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class B2bApplicationController extends Controller
{
    public function __construct(private readonly OrderStatusFlowService $flowService)
    {
    }

    /**
     * Halaman status & form pengajuan B2B — untuk semua user (termasuk verified).
     */
    public function show(Request $request): Response
    {
        return $this->renderApplication($request->user());
    }

    /**
     * Dashboard B2B — hanya untuk user yang sudah terverifikasi.
     */
    public function dashboard(Request $request): Response
    {
        $user = $request->user();

        if (! $user->is_b2b_verified) {
            return redirect()->route('b2b.show');
        }

        return $this->renderDashboard($user);
    }

    private function renderApplication(User $user): Response
    {
        $latest = $user->latestB2bApplication;

        return Inertia::render('B2B/Application', [
            'b2b_status'         => $user->b2b_status,
            'b2b_status_label'   => $user->b2b_status_label,
            'is_b2b_verified'    => $user->is_b2b_verified,
            'credit_limit'       => $user->credit_limit,
            'remaining_credit'   => $user->remaining_credit,
            'top_tenure_days'    => $user->top_tenure_days,
            'rejection_reason'   => $user->rejection_reason,
            'termin_scheme'      => $user->termin_scheme,
            'can_apply'          => in_array($user->b2b_status, [
                User::B2B_STATUS_NONE,
                User::B2B_STATUS_REJECTED,
            ], true),
            'latest_application' => $latest ? [
                'id'              => $latest->id,
                'status'          => $latest->status,
                'status_label'    => $latest->status_label,
                'company_name'    => $latest->company_name,
                'company_npwp'    => $latest->company_npwp,
                'company_nib'     => $latest->company_nib,
                'npwp_file_url'   => $latest->npwp_file_url,
                'nib_file_url'    => $latest->nib_file_url,
                'siup_file_url'   => $latest->siup_file_url,
                'rejection_reason'=> $latest->rejection_reason,
                'reviewed_at'     => $latest->reviewed_at?->format('d M Y H:i'),
                'created_at'      => $latest->created_at?->format('d M Y H:i'),
            ] : null,
        ]);
    }

    private function renderDashboard(User $user): Response
    {
        $creditSummary = [
            'credit_limit'       => $user->credit_limit,
            'remaining_credit'   => $user->remaining_credit,
            'top_tenure_days'    => $user->top_tenure_days,
            'top_disabled'       => (bool) $user->top_disabled,
            'company_name'       => $user->latestB2bApplication?->company_name,
            'company_npwp'       => $user->latestB2bApplication?->company_npwp,
        ];

        $topBills = $user->orders()
            ->where('payment_method', Order::PAYMENT_TOP)
            ->whereIn('status', ['shipped', Order::STATUS_WAITING_SETTLEMENT])
            ->where('po_verification_status', 'verified')
            ->orderByDesc('po_verified_at')
            ->get()
            ->map(fn (Order $o) => $this->serializeTopBill($o))
            ->values();

        $terminOrders = $user->orders()
            ->where('payment_method', Order::PAYMENT_TERMIN)
            ->whereNotIn('status', ['completed', 'done', 'cancelled'])
            ->orderByDesc('id')
            ->with(['product', 'items'])
            ->get()
            ->map(fn (Order $o) => $this->serializeTerminOrder($o))
            ->values();

        $documents = $user->orders()
            ->has('documents')
            ->with('documents')
            ->orderByDesc('id')
            ->get()
            ->flatMap(function (Order $o) {
                return $o->documents->map(fn ($d) => [
                    'order_code'      => $o->order_code,
                    'type'            => $d->type,
                    'document_number' => $d->document_number,
                    'url'             => $d->file_url,
                    'issued_at'       => $d->issued_at?->format('d M Y, H:i'),
                ]);
            })
            ->values();

        return Inertia::render('B2B/Dashboard', [
            'summary'        => $creditSummary,
            'top_bills'      => $topBills,
            'termin_orders'  => $terminOrders,
            'documents'      => $documents,
        ]);
    }

    private function serializeTopBill(Order $o): array
    {
        $due = $o->settlement_due_at;
        $daysLeft = $due ? (int) now()->diffInDays($due, false) : null;
        $overdue = $due !== null && $daysLeft < 0;

        return [
            'id'                => $o->id,
            'order_code'        => $o->order_code,
            'total_price'       => $o->total_price,
            'credit_used'       => $o->credit_used,
            'due_at'            => $due?->format('d M Y'),
            'days_left'         => $daysLeft !== null ? (int) $daysLeft : null,
            'overdue'           => $overdue,
            'settlement_status' => $o->settlement_status,
            'settlement_label'  => $o->settlement_label,
            'settlement_proof'  => $o->settlement_proof_url,
            'status'            => $o->status,
            'progress_steps'    => $this->flowService->buildSteps($o, 'user'),
        ];
    }

    private function serializeTerminOrder(Order $o): array
    {
        $bills = $o->termin_bills ?? [];
        $paidBills = $o->paid_bills ?? [];
        $currentBill = collect($bills)->first(fn ($b) => ! in_array($b['key'], $paidBills, true));

        $firstItem = $o->items->first();

        return [
            'id'           => $o->id,
            'order_code'    => $o->order_code,
            'product_name' => $firstItem?->product_name
                ?? $o->custom_requirements
                ?? ($o->product?->name ?? 'Pesanan Custom'),
            'total_price'    => $o->total_price,
            'status'        => $o->status,
            'current_bill'  => $currentBill ? [
                'key'    => $currentBill['key'],
                'label'  => $currentBill['label'],
                'amount' => $currentBill['amount'],
            ] : null,
        ];
    }

    /**
     * Simpan pengajuan B2B baru.
     */
    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();

        if (! in_array($user->b2b_status, [User::B2B_STATUS_NONE, User::B2B_STATUS_REJECTED], true)) {
            return redirect()->route('b2b.show')
                ->with('error', 'Pengajuan B2B Anda sedang diproses atau sudah disetujui.');
        }

        $data = $request->validate([
            'company_name' => ['required', 'string', 'max:255'],
            'company_npwp' => ['required', 'string', 'regex:/^[0-9]+$/', 'min:15', 'max:16'],
            'company_nib'  => ['required', 'string', 'regex:/^[0-9]+$/', 'size:13'],
            'npwp_file'    => ['required', 'file', 'mimes:pdf,jpg,jpeg,png,webp', 'max:2048'],
            'nib_file'     => ['required', 'file', 'mimes:pdf,jpg,jpeg,png,webp', 'max:2048'],
            'siup_file'    => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png,webp', 'max:2048'],
            'terms_accepted' => ['required', 'accepted'],
        ]);

        $files = [
            'npwp_file' => $request->file('npwp_file'),
            'nib_file'  => $request->file('nib_file'),
            'siup_file' => $request->file('siup_file'),
        ];

        $paths = [];
        foreach ($files as $field => $file) {
            if ($file) {
                $paths[$field] = $file->store('b2b_documents', 'public');
            }
        }

        // Hapus file pengajuan lama milik user yang sudah digantikan pengajuan baru
        $user->b2bApplications()->get()->each(function (B2bApplication $old) {
            foreach (['npwp_file', 'nib_file', 'siup_file'] as $field) {
                if ($old->{$field} && ! str_starts_with($old->{$field}, 'http')) {
                    Storage::disk('public')->delete($old->{$field});
                }
            }
        });

        $user->b2bApplications()->create([
            'status'       => User::B2B_STATUS_PENDING,
            'company_name' => $data['company_name'],
            'company_npwp' => $data['company_npwp'],
            'company_nib'  => $data['company_nib'],
            'npwp_file'    => $paths['npwp_file'],
            'nib_file'     => $paths['nib_file'],
            'siup_file'    => $paths['siup_file'] ?? null,
        ]);

        $user->update([
            'b2b_status'        => User::B2B_STATUS_PENDING,
            'rejection_reason'  => null,
            'terms_accepted_at' => now(),
        ]);

        return redirect()->route('b2b.show')
            ->with('success', 'Pengajuan B2B berhasil dikirim. Silakan tunggu peninjauan admin.');
    }
}
