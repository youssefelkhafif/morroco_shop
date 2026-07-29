<?php

namespace App\Policies;

use App\Models\Order;
use App\Models\User;

class OrderPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isAdmin();
    }

    public function view(User $user, Order $order): bool
    {
        return $user->isAdmin();
    }

    public function confirm(User $user, Order $order): bool
    {
        return $user->isAdmin();
    }

    public function cancel(User $user, Order $order): bool
    {
        return $user->isAdmin();
    }

    public function prepare(User $user, Order $order): bool
    {
        return $user->isAdmin();
    }

    public function ship(User $user, Order $order): bool
    {
        return $user->isAdmin();
    }

    public function deliver(User $user, Order $order): bool
    {
        return $user->isAdmin();
    }

    public function assignCarrierAndTracking(User $user, Order $order): bool
    {
        return $user->isAdmin();
    }
}
