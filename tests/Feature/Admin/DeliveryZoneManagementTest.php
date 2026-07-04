<?php

use App\Models\DeliveryZone;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

function deliveryZoneAdmin(): User
{
    return User::factory()->create([
        'is_admin' => true,
    ]);
}

it('a normal user cannot manage delivery zones', function () {
    $user = User::factory()->create([
        'is_admin' => false,
    ]);

    $this->actingAs($user)
        ->get(route('admin.delivery-zones.index'))
        ->assertForbidden();
});

it('an admin can view delivery zones', function () {
    DeliveryZone::factory()->create([
        'city' => 'Casablanca',
        'district' => 'Maarif',
        'zone_name' => 'Standard',
        'delivery_fee_mad' => 20,
        'estimated_delivery_days' => 2,
        'is_active' => true,
    ]);

    $this->actingAs(deliveryZoneAdmin())
        ->get(route('admin.delivery-zones.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/delivery-zones/index')
            ->has('deliveryZones.data', 1)
            ->where('deliveryZones.data.0.city', 'Casablanca')
            ->where('deliveryZones.data.0.district', 'Maarif')
            ->where('deliveryZones.data.0.zone_name', 'Standard')
            ->where('deliveryZones.data.0.delivery_fee_mad', '20.00')
            ->where('deliveryZones.data.0.estimated_delivery_days', 2)
            ->where('deliveryZones.data.0.is_active', true),
        );
});

it('an admin can create a delivery zone', function () {
    $this->actingAs(deliveryZoneAdmin())
        ->post(route('admin.delivery-zones.store'), [
            'city' => 'Casablanca',
            'district' => 'Maarif',
            'zone_name' => 'Standard',
            'delivery_fee_mad' => '25.50',
            'estimated_delivery_days' => 1,
            'is_active' => true,
        ])
        ->assertRedirect(route('admin.delivery-zones.index'));

    $this->assertDatabaseHas('delivery_zones', [
        'city' => 'Casablanca',
        'district' => 'Maarif',
        'zone_name' => 'Standard',
        'delivery_fee_mad' => '25.50',
        'estimated_delivery_days' => 1,
        'is_active' => true,
    ]);
});

it('an admin can create multiple zones in the same city', function () {
    DeliveryZone::factory()->create([
        'city' => 'Casablanca',
        'district' => 'Maarif',
        'zone_name' => 'Standard',
    ]);

    $this->actingAs(deliveryZoneAdmin())
        ->post(route('admin.delivery-zones.store'), [
            'city' => 'Casablanca',
            'district' => 'Sidi Maarouf',
            'zone_name' => 'Standard',
            'delivery_fee_mad' => '30.00',
            'estimated_delivery_days' => 2,
            'is_active' => true,
        ])
        ->assertRedirect(route('admin.delivery-zones.index'));

    expect(DeliveryZone::query()
        ->where('city', 'Casablanca')
        ->count())->toBe(2);
});

it('a delivery zone requires a unique city district zone combination valid fee and valid delivery days', function () {
    DeliveryZone::factory()->create([
        'city' => 'Casablanca',
        'district' => 'Maarif',
        'zone_name' => 'Standard',
    ]);

    $this->actingAs(deliveryZoneAdmin())
        ->post(route('admin.delivery-zones.store'), [
            'city' => 'Casablanca',
            'district' => 'Maarif',
            'zone_name' => 'Standard',
            'delivery_fee_mad' => '-0.01',
            'estimated_delivery_days' => 0,
            'is_active' => true,
        ])
        ->assertSessionHasErrors([
            'zone_name',
            'delivery_fee_mad',
            'estimated_delivery_days',
        ]);

    expect(DeliveryZone::count())->toBe(1);
});

it('an admin can update a delivery zone and deactivate it', function () {
    $deliveryZone = DeliveryZone::factory()->create([
        'city' => 'Rabat',
        'district' => 'Agdal',
        'zone_name' => 'Standard',
        'delivery_fee_mad' => 20,
        'estimated_delivery_days' => 2,
        'is_active' => true,
    ]);

    $this->actingAs(deliveryZoneAdmin())
        ->put(route('admin.delivery-zones.update', $deliveryZone), [
            'city' => 'Marrakesh',
            'district' => 'Gueliz',
            'zone_name' => 'Express',
            'delivery_fee_mad' => '35.00',
            'estimated_delivery_days' => 3,
        ])
        ->assertRedirect(route('admin.delivery-zones.index'));

    $deliveryZone->refresh();

    expect($deliveryZone->city)->toBe('Marrakesh')
        ->and($deliveryZone->district)->toBe('Gueliz')
        ->and($deliveryZone->zone_name)->toBe('Express')
        ->and($deliveryZone->delivery_fee_mad)->toBe('35.00')
        ->and($deliveryZone->estimated_delivery_days)->toBe(3)
        ->and($deliveryZone->is_active)->toBeFalse();
});

it('an admin can delete a delivery zone', function () {
    $deliveryZone = DeliveryZone::factory()->create();

    $this->actingAs(deliveryZoneAdmin())
        ->delete(route('admin.delivery-zones.destroy', $deliveryZone))
        ->assertRedirect(route('admin.delivery-zones.index'));

    $this->assertDatabaseMissing('delivery_zones', [
        'id' => $deliveryZone->id,
    ]);
});