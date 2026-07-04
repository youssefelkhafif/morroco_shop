<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreDeliveryZoneRequest;
use App\Http\Requests\Admin\UpdateDeliveryZoneRequest;
use App\Models\DeliveryZone;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class DeliveryZoneController extends Controller
{
    public function index(): Response
    {
        $deliveryZones = DeliveryZone::query()
            ->orderByDesc('is_active')
            ->orderBy('city')
            ->orderBy('district')
            ->orderBy('zone_name')
            ->paginate(20)
            ->through(fn (DeliveryZone $deliveryZone) => [
                'id' => $deliveryZone->id,
                'city' => $deliveryZone->city,
                'district' => $deliveryZone->district,
                'zone_name' => $deliveryZone->zone_name,
                'delivery_fee_mad' => $deliveryZone->delivery_fee_mad,
                'estimated_delivery_days' => $deliveryZone->estimated_delivery_days,
                'is_active' => $deliveryZone->is_active,
            ]);

        return Inertia::render('admin/delivery-zones/index', [
            'deliveryZones' => $deliveryZones,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/delivery-zones/create');
    }

    public function store(
        StoreDeliveryZoneRequest $request,
    ): RedirectResponse {
        DeliveryZone::create($request->validated());

        return to_route('admin.delivery-zones.index')
            ->with('success', 'Delivery zone created successfully.');
    }

    public function edit(DeliveryZone $deliveryZone): Response
    {
        return Inertia::render('admin/delivery-zones/edit', [
            'deliveryZone' => [
                'id' => $deliveryZone->id,
                'city' => $deliveryZone->city,
                'district' => $deliveryZone->district,
                'zone_name' => $deliveryZone->zone_name,
                'delivery_fee_mad' => $deliveryZone->delivery_fee_mad,
                'estimated_delivery_days' => $deliveryZone->estimated_delivery_days,
                'is_active' => $deliveryZone->is_active,
            ],
        ]);
    }

    public function update(
        UpdateDeliveryZoneRequest $request,
        DeliveryZone $deliveryZone,
    ): RedirectResponse {
        $deliveryZone->update($request->validated());

        return to_route('admin.delivery-zones.index')
            ->with('success', 'Delivery zone updated successfully.');
    }

    public function destroy(
        DeliveryZone $deliveryZone,
    ): RedirectResponse {
        $deliveryZone->delete();

        return to_route('admin.delivery-zones.index')
            ->with('success', 'Delivery zone deleted successfully.');
    }
}