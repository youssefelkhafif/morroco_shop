<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $unreadNotifications = $user
            ? $user->unreadNotifications()->latest()
            : null;

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $user,
            ],
            'notifications' => [
                'unread_count' => $unreadNotifications?->count() ?? 0,
                'latest' => $unreadNotifications?->take(5)->get()->map(fn ($notification) => [
                    'id' => $notification->id,
                    'type' => class_basename($notification->type),
                    'message' => $notification->data['message'] ?? null,
                    'whatsapp_url' => $notification->data['whatsapp_url'] ?? null,
                    'created_at' => $notification->created_at?->toISOString(),
                ])->values()->all(),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }
}
