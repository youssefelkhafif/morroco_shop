import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Bell, X } from 'lucide-react';

export default function NotificationBell() {
    const { notifications } = usePage().props;
    const [isOpen, setIsOpen] = useState(false);

    const unreadCount = notifications?.unread_count ?? 0;
    const latestNotifications = notifications?.latest ?? [];

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setIsOpen((open) => !open)}
                className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50"
                aria-label="View notifications"
            >
                <Bell className="h-5 w-5" />

                {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-emerald-600 px-1.5 text-[11px] font-semibold text-white">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 z-20 mt-3 w-80 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg">
                    <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                        <div>
                            <p className="text-sm font-semibold text-slate-900">Notifications</p>
                            <p className="text-xs text-slate-500">Latest unread updates</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="rounded-full p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                            aria-label="Close notifications"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    {latestNotifications.length === 0 ? (
                        <div className="p-4 text-sm text-slate-600">
                            No new notifications.
                        </div>
                    ) : (
                        <div className="space-y-2 p-3">
                            {latestNotifications.map((notification) => (
                                <article
                                    key={notification.id}
                                    className="rounded-3xl border border-slate-200 bg-slate-50 p-3"
                                >
                                    <p className="text-sm font-semibold text-slate-900">
                                        {notification.message}
                                    </p>
                                    {notification.whatsapp_url && (
                                        <a
                                            href={notification.whatsapp_url}
                                            target="_blank"
                                            rel="noreferrer noopener"
                                            className="mt-3 inline-flex rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-700"
                                        >
                                            Open WhatsApp
                                        </a>
                                    )}
                                </article>
                            ))}
                        </div>
                    )}

                    <div className="border-t border-slate-200 px-4 py-3">
                        <Link
                            href="/dashboard"
                            className="inline-flex w-full justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                            View all notifications
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
