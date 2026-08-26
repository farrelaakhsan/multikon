<style>
    .kop { width: 100%; border-bottom: 3px solid #1e293b; padding-bottom: 10px; margin-bottom: 16px; }
    .kop .kop-row { width: 100%; }
    .kop .kop-name { font-size: 17px; font-weight: bold; color: #1e293b; letter-spacing: 0.5px; }
    .kop .kop-addr { font-size: 10px; color: #475569; margin-top: 3px; line-height: 1.5; }
    .kop .kop-contact { font-size: 10px; color: #475569; margin-top: 3px; }
</style>

<div class="kop">
    <div class="kop-row">
        @if (! empty($company['logo']))
            <img src="{{ public_path($company['logo']) }}" alt="{{ $company['name'] }}" style="height: 48px; float: left; margin-right: 14px;">
        @endif
        <div>
            <div class="kop-name">{{ $company['name'] }}</div>
            <div class="kop-addr">{{ $company['address'] }}</div>
            <div class="kop-contact">
                Telp. {{ $company['phone'] }}
                @if (! empty($company['phone2']))&nbsp;/&nbsp;{{ $company['phone2'] }}@endif
                &nbsp;•&nbsp; Email: {{ $company['email'] }}
                &nbsp;•&nbsp; NPWP: {{ $company['npwp'] }}
            </div>
        </div>
    </div>
</div>