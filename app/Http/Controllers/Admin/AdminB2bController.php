<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\B2bApplication;
use App\Models\Order;
use App\Models\User;
use App\Services\OrderStatusFlowService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminB2bController extends Controller
{
    public function __construct(private readonly OrderStatusFlowService $flowService)
    {
    }
    public function index(): Response
    {
        $applications = B2bApplication::with('user')
            ->orderByRaw("FIELD(status, 'pending', 'approved', 'rejected')")
            ->latest('updated_at')
            ->paginate(20)
            ->through(fn (B2bApplication $a) => [
                'id'            => $a->id,
                'status'        => $a->status,
                'status_label'  => $a->status_label,
                'company_name'  => $a->company_name,
                'company_npwp'  => $a->company_npwp,
                'user_name'     => $a->user?->name,
                'user_email'    => $a->user?->email,
                'created_at'    => $a->created_at?->format('d M Y H:i'),
            ]);

        return Inertia::render('Admin/B2B/Index', [
            'applications' => $applications,
        ]);
    }

    public function show(B2bApplication $application): Response
    {
        $application->load(['user', 'reviewer']);

        return Inertia::render('Admin/B2B/Show', [
            'application' => [
                'id'              => $application->id,
                'status'          => $application->status,
                'status_label'    => $application->status_label,
                'company_name'    => $application->company_name,
                'company_npwp'    => $application->company_npwp,
                'company_nib'     => $application->company_nib,
                'npwp_file_url'   => $application->npwp_file_url,
                'nib_file_url'    => $application->nib_file_url,
                'siup_file_url'   => $application->siup_file_url,
                'credit_limit'    => $application->credit_limit,
                'top_tenure_days' => $application->top_tenure_days,
                'rejection_reason'=> $application->rejection_reason,
                'reviewed_at'     => $application->reviewed_at?->format('d M Y H:i'),
                'reviewer_name'   => $application->reviewer?->name,
                'created_at'      => $application->created_at?->format('d M Y H:i'),
                'user'            => [
                    'id'    => $application->user?->id,
                    'name'  => $application->user?->name,
                    'email' => $application->user?->email,
                ],
            ],
        ]);
    }

    public function approve(Request $request, B2bApplication $application): RedirectResponse
    {
        if ($application->status !== User::B2B_STATUS_PENDING) {
            return redirect()->route('admin.b2b.show', $application)
                ->with('error', 'Hanya pengajuan berstatus menunggu yang bisa disetujui.');
        }

        $data = $request->validate([
            'credit_limit'    => ['required', 'numeric', 'min:1'],
            'top_tenure_days' => ['required', 'integer', 'min:1', 'max:365'],
        ]);

        $application->update([
            'status'          => User::B2B_STATUS_APPROVED,
            'credit_limit'    => $data['credit_limit'],
            'top_tenure_days' => $data['top_tenure_days'],
            'reviewed_by'     => $request->user()->id,
            'reviewed_at'     => now(),
        ]);

        $application->user->update([
            'b2b_status'       => User::B2B_STATUS_APPROVED,
            'credit_limit'     => $data['credit_limit'],
            'remaining_credit' => $data['credit_limit'],
            'top_tenure_days'  => $data['top_tenure_days'],
            'rejection_reason' => null,
            'b2b_approved_at'  => now(),
        ]);

        return redirect()->route('admin.b2b.show', $application)
            ->with('success', 'Pengajuan B2B disetujui. Akun kini terverifikasi B2B.');
    }

    public function reject(Request $request, B2bApplication $application): RedirectResponse
    {
        if ($application->status !== User::B2B_STATUS_PENDING) {
            return redirect()->route('admin.b2b.show', $application)
                ->with('error', 'Hanya pengajuan berstatus menunggu yang bisa ditolak.');
        }

        $data = $request->validate([
            'rejection_reason' => ['required', 'string', 'max:1000'],
        ]);

        $application->update([
            'status'           => User::B2B_STATUS_REJECTED,
            'rejection_reason' => $data['rejection_reason'],
            'reviewed_by'      => $request->user()->id,
            'reviewed_at'      => now(),
        ]);

        $application->user->update([
            'b2b_status'       => User::B2B_STATUS_REJECTED,
            'rejection_reason' => $data['rejection_reason'],
        ]);

        return redirect()->route('admin.b2b.show', $application)
            ->with('success', 'Pengajuan B2B ditolak.');
    }

    /**
     * Panel kelola B2B — manajemen limit kredit, pembekuan ToP,
     * tagihan ToP, milestone termin, dan peringatan jatuh tempo.
     */
    public function manage(): Response
    {
        // Daftar perusahaan B2B approved
        $companies = User::where('b2b_status', User::B2B_STATUS_APPROVED)
            ->orderBy('name')
            ->get()
            ->map(fn (User $u) => [
                'id'               => $u->id,
                'name'             => $u->name,
                'email'            => $u->email,
                'company_name'     => $u->latestB2bApplication?->company_name,
                'company_npwp'     => $u->latestB2bApplication?->company_npwp,
                'credit_limit'     => $u->credit_limit,
                'remaining_credit' => $u->remaining_credit,
                'top_tenure_days'  => $u->top_tenure_days,
                'top_disabled'     => (bool) $u->top_disabled,
                'b2b_approved_at'  => $u->b2b_approved_at?->format('d M Y'),
            ])
            ->values();

        // Pesanan ToP berjalan (pending settlement atau awaiting shipped)
        $topOrders = Order::with('user')
            ->where('payment_method', Order::PAYMENT_TOP)
            ->whereIn('status', ['po_verification', 'processing', 'shipped', Order::STATUS_WAITING_SETTLEMENT])
            ->orderByDesc('po_verified_at')
            ->get()
            ->map(function (Order $o) {
                $due = $o->settlement_due_at;
                $daysLeft = $due ? (int) now()->diffInDays($due, false) : null;

                return [
                    'id'                => $o->id,
                    'order_code'        => $o->order_code,
                    'customer_name'     => $o->customer_name,
                    'company_name'      => $o->user?->latestB2bApplication?->company_name,
                    'total_price'       => $o->total_price,
                    'credit_used'       => $o->credit_used,
                    'status'            => $o->status,
                    'status_label'      => $o->status_label,
                    'po_verification_status' => $o->po_verification_status,
                    'settlement_status' => $o->settlement_status,
                    'settlement_label'  => $o->settlement_label,
                    'due_at'            => $due?->format('d M Y'),
                    'days_left'         => $daysLeft !== null ? (int) $daysLeft : null,
                    'overdue'           => $due !== null && $daysLeft < 0,
                    'progress_steps'    => $this->flowService->buildSteps($o, 'admin'),
                ];
            })
            ->values();

        // Milestone termin di semua pesanan custom
        $terminOrders = Order::with('user')
            ->where('payment_method', Order::PAYMENT_TERMIN)
            ->whereNotIn('status', ['completed', 'done', 'cancelled'])
            ->orderByDesc('id')
            ->get()
            ->map(fn (Order $o) => [
                'id'           => $o->id,
                'order_code'   => $o->order_code,
                'customer_name' => $o->customer_name,
                'company_name' => $o->user?->latestB2bApplication?->company_name,
                'total_price'  => $o->total_price,
                'status'       => $o->status,
                'status_label' => $o->status_label,
                'termin_bills' => $o->termin_bills ?? [],
                'paid_bills'   => $o->paid_bills ?? [],
            ])
            ->values();

        return Inertia::render('Admin/B2B/Manage', [
            'companies'     => $companies,
            'top_orders'    => $topOrders,
            'termin_orders' => $terminOrders,
        ]);
    }

    /**
     * Perbarui nominal Batas Kredit & resetkan sisa limit.
     */
    public function updateCredit(Request $request, User $user): RedirectResponse
    {
        $data = $request->validate([
            'credit_limit'    => ['required', 'numeric', 'min:0'],
            'top_tenure_days' => ['required', 'integer', 'min:1', 'max:365'],
        ]);

        $currentRemaining = (float) ($user->remaining_credit ?? 0);
        $currentLimit = (float) ($user->credit_limit ?? 0);
        $difference = (float) $data['credit_limit'] - $currentLimit;

        // Penyesuaian: jika limit naik, sisa naik sesuai selisih; turun tidak
        // boleh membuat sisa negatif.
        if ($currentLimit !== 0.0 && $difference !== 0.0) {
            $newRemaining = $currentRemaining + $difference;
            $user->remaining_credit = max($newRemaining, 0);
        } else {
            $user->remaining_credit = $data['credit_limit'];
        }

        $user->update([
            'credit_limit'    => $data['credit_limit'],
            'top_tenure_days' => $data['top_tenure_days'],
        ]);

        return redirect()->route('admin.b2b.manage')
            ->with('success', 'Limit kredit ' . ($user->name) . ' berhasil diperbarui.');
    }

    /**
     * Bekukan / aktifkan kembali fitur ToP untuk user B2B.
     */
    public function toggleTop(User $user): RedirectResponse
    {
        $user->update([
            'top_disabled' => ! $user->top_disabled,
        ]);

        $state = $user->top_disabled ? 'dibekukan' : 'diaktifkan kembali';

        return redirect()->route('admin.b2b.manage')
            ->with('success', "Fasilitas ToP untuk {$user->name} berhasil {$state}.");
    }
}
