<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class RajaOngkirService
{
    protected string $apiKey;
    protected string $baseUrl;
    protected int $originDistrictId;
    protected string $couriers;

    public function __construct()
    {
        $this->apiKey            = config('services.rajaongkir.api_key');
        $this->baseUrl           = config('services.rajaongkir.base_url');
        $this->originDistrictId  = (int) config('services.rajaongkir.origin_district_id', 1363);
        $this->couriers          = config('services.rajaongkir.couriers', 'jne:sicepat:ide:sap:jnt:ninja:tiki:lion:anteraja:pos:ncs:rex:rpx:sentral:star:wahana');
    }

    /**
     * Cari kecamatan berdasarkan nama kota/kecamatan.
     */
    public function searchDestination(string $query): array
    {
        $response = Http::withHeaders(['key' => $this->apiKey])
            ->get($this->baseUrl . '/destination/domestic-destination', [
                'search' => $query,
                'limit'  => 20,
                'offset' => 0,
            ]);

        if (! $response->successful()) {
            Log::warning('RajaOngkir: search destination failed', ['status' => $response->status()]);
            return [];
        }

        return $response->json('data') ?? [];
    }

    /**
     * Ambil daftar provinsi.
     */
    public function getProvinces(): array
    {
        $response = Http::withHeaders(['key' => $this->apiKey])
            ->get($this->baseUrl . '/destination/province');

        if (! $response->successful()) return [];

        return $response->json('data') ?? [];
    }

    /**
     * Ambil daftar kota berdasarkan province_id.
     */
    public function getCities(int $provinceId): array
    {
        $response = Http::withHeaders(['key' => $this->apiKey])
            ->get($this->baseUrl . '/destination/city/' . $provinceId);

        if (! $response->successful()) return [];

        return $response->json('data') ?? [];
    }

    /**
     * Ambil daftar kecamatan berdasarkan city_id.
     */
    public function getDistricts(int $cityId): array
    {
        $response = Http::withHeaders(['key' => $this->apiKey])
            ->get($this->baseUrl . '/destination/district/' . $cityId);

        if (! $response->successful()) return [];

        return $response->json('data') ?? [];
    }

    /**
     * Ambil daftar kelurahan berdasarkan district_id.
     */
    public function getSubdistricts(int $districtId): array
    {
        $response = Http::withHeaders(['key' => $this->apiKey])
            ->get($this->baseUrl . '/destination/sub-district/' . $districtId);

        if (! $response->successful()) return [];

        return $response->json('data') ?? [];
    }

    /**
     * Hitung ongkos kirim (subdistrict-level) — 1 request semua kurir.
     *
     * @param int $destinationSubdistrictId
     * @param int $weight  Berat dalam gram
     * @return array|null
     */
    public function getCost(int $destinationSubdistrictId, int $weight): ?array
    {
        if (! $this->apiKey) {
            Log::error('RajaOngkir: API key not configured');
            return null;
        }

        $payload = [
            'origin'      => config('services.rajaongkir.origin_subdistrict_id', 17733),
            'destination' => $destinationSubdistrictId,
            'weight'      => $weight,
            'courier'     => $this->couriers,
            'price'       => 'lowest',
        ];

        Log::info('RajaOngkir: requesting cost', [
            'url'     => $this->baseUrl . '/calculate/domestic-cost',
            'payload' => $payload,
        ]);

        $response = Http::withHeaders([
            'key'          => $this->apiKey,
            'Content-Type' => 'application/x-www-form-urlencoded',
        ])->asForm()->timeout(30)->post($this->baseUrl . '/calculate/domestic-cost', $payload);

        Log::info('RajaOngkir: cost response', [
            'status'   => $response->status(),
            'success'  => $response->successful(),
            'body'     => $response->body(),
        ]);

        if (! $response->successful()) {
            Log::warning('RajaOngkir: cost failed', [
                'status' => $response->status(),
                'body'   => $response->body(),
            ]);
            return null;
        }

        $data = $response->json('data');

        if (empty($data)) {
            Log::warning('RajaOngkir: cost returned empty data', [
                'full_response' => $response->json(),
            ]);
        }

        return $data;
    }
}
