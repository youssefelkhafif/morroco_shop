import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Lock, User, AlertTriangle, MessageCircle } from 'lucide-react';
import ShopNavigation from '@/components/shop-navigation';

export default function AccountSettings({ auth }) {
    const { data: profileData, setData: setProfileData, post: updateProfile, processing: profileProcessing, errors: profileErrors } = useForm({
        name: auth?.user?.name || '',
        email: auth?.user?.email || '',
    });

    const { data: passwordData, setData: setPasswordData, post: updatePassword, processing: passwordProcessing, errors: passwordErrors, reset: resetPassword } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const [activeTab, setActiveTab] = useState('account');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleProfileSubmit = (e) => {
        e.preventDefault();
        updateProfile(route('account.profile.update'));
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        updatePassword(route('account.password.update'), {
            onSuccess: () => {
                resetPassword();
            },
        });
    };

    return (
        <>
            <Head title="Account Settings" />

            <main className="min-h-screen bg-background text-foreground">
                <ShopNavigation auth={auth} cartItemCount={0} />

                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <div className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
                        <Link href="/notification" className="hover:text-foreground">Home</Link>
                        <span>/</span>
                        <Link href="/notification" className="hover:text-foreground">Settings</Link>
                        <span>/</span>
                        <span className="font-semibold text-foreground">Account</span>
                    </div>

                    <div className="grid gap-8 lg:grid-cols-[250px_1fr]">
                        {/* Sidebar Navigation */}
                        <div className="space-y-4">
                            <button
                                onClick={() => setActiveTab('account')}
                                className={`w-full rounded-lg px-4 py-3 text-left font-semibold transition ${
                                    activeTab === 'account'
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-muted-foreground hover:bg-muted'
                                }`}
                            >
                                <User className="mb-2 inline-block w-5 h-5 mr-3" />
                                Account
                            </button>

                            <button
                                onClick={() => setActiveTab('security')}
                                className={`w-full rounded-lg px-4 py-3 text-left font-semibold transition ${
                                    activeTab === 'security'
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-muted-foreground hover:bg-muted'
                                }`}
                            >
                                <Lock className="mb-2 inline-block w-5 h-5 mr-3" />
                                Security
                            </button>

                            <button
                                onClick={() => setActiveTab('danger')}
                                className={`w-full rounded-lg px-4 py-3 text-left font-semibold transition ${
                                    activeTab === 'danger'
                                        ? 'bg-destructive/10 text-destructive'
                                        : 'text-muted-foreground hover:bg-muted'
                                }`}
                            >
                                <AlertTriangle className="mb-2 inline-block w-5 h-5 mr-3" />
                                Danger Zone
                            </button>

                            <div className="mt-8 rounded-lg border border-border bg-muted/80 p-4">
                                <div className="mb-3 flex items-start gap-3">
                                    <MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                                    <div>
                                        <h3 className="mb-1 font-semibold text-foreground">Need help?</h3>
                                        <p className="mb-3 text-xs text-muted-foreground">
                                            If you need assistance, our support team is here to help.
                                        </p>
                                        <a
                                            href="https://www.instagram.com/street_wearcap"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80"
                                        >
                                            Contact Support
                                            <span>→</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="space-y-8">
                            {/* Account Tab */}
                            {activeTab === 'account' && (
                                <div className="rounded-2xl border border-border bg-card p-8">
                                    <h2 className="mb-2 text-2xl font-bold">Shop Information</h2>
                                    <p className="mb-6 text-sm text-muted-foreground">Update your account name and email address.</p>

                                    <form onSubmit={handleProfileSubmit} className="space-y-6">
                                        {/* Name Field */}
                                        <div>
                                            <label className="block text-sm font-semibold text-black/70 mb-2">
                                                Full Name
                                            </label>
                                            <input
                                                type="text"
                                                value={profileData.name}
                                                onChange={(e) => setProfileData('name', e.target.value)}
                                                className="w-full rounded-lg border border-black/10 px-4 py-3 text-base transition focus:border-black focus:outline-none"
                                                placeholder="Your full name"
                                            />
                                            {profileErrors.name && (
                                                <p className="mt-2 text-sm text-destructive">{profileErrors.name}</p>
                                            )}
                                        </div>

                                        {/* Email Field */}
                                        <div>
                                            <label className="block text-sm font-semibold text-black/70 mb-2">
                                                Email Address
                                            </label>
                                            <input
                                                type="email"
                                                value={profileData.email}
                                                onChange={(e) => setProfileData('email', e.target.value)}
                                                className="w-full rounded-lg border border-black/10 px-4 py-3 text-base transition focus:border-black focus:outline-none"
                                                placeholder="your@email.com"
                                            />
                                            {profileErrors.email && (
                                                <p className="mt-2 text-sm text-destructive">{profileErrors.email}</p>
                                            )}
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={profileProcessing}
                                            className="rounded-lg bg-red-600 px-6 py-3 text-base font-semibold text-white transition hover:bg-red-700 disabled:bg-red-600/50"
                                        >
                                            {profileProcessing ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </form>
                                </div>
                            )}

                            {/* Security Tab */}
                            {activeTab === 'security' && (
                                <div className="rounded-2xl border border-border bg-card p-8">
                                    <h2 className="mb-2 text-2xl font-bold">Change Password</h2>
                                    <p className="mb-6 text-sm text-muted-foreground">Update your password to keep your account secure.</p>

                                    <form onSubmit={handlePasswordSubmit} className="space-y-6">
                                        {/* Current Password */}
                                        <div>
                                            <label className="block text-sm font-semibold text-black/70 mb-2">
                                                Current Password
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="password"
                                                    value={passwordData.current_password}
                                                    onChange={(e) => setPasswordData('current_password', e.target.value)}
                                                    className="w-full rounded-lg border border-black/10 px-4 py-3 text-base transition focus:border-black focus:outline-none"
                                                    placeholder="Enter your current password"
                                                />
                                            </div>
                                            {passwordErrors.current_password && (
                                                <p className="mt-2 text-sm text-destructive">{passwordErrors.current_password}</p>
                                            )}
                                        </div>

                                        {/* New Password */}
                                        <div>
                                            <label className="block text-sm font-semibold text-black/70 mb-2">
                                                New Password
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="password"
                                                    value={passwordData.password}
                                                    onChange={(e) => setPasswordData('password', e.target.value)}
                                                    className="w-full rounded-lg border border-black/10 px-4 py-3 text-base transition focus:border-black focus:outline-none"
                                                    placeholder="Enter your new password"
                                                />
                                            </div>
                                            {passwordErrors.password && (
                                                <p className="mt-2 text-sm text-destructive">{passwordErrors.password}</p>
                                            )}
                                        </div>

                                        {/* Confirm Password */}
                                        <div>
                                            <label className="block text-sm font-semibold text-black/70 mb-2">
                                                Confirm New Password
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="password"
                                                    value={passwordData.password_confirmation}
                                                    onChange={(e) => setPasswordData('password_confirmation', e.target.value)}
                                                    className="w-full rounded-lg border border-black/10 px-4 py-3 text-base transition focus:border-black focus:outline-none"
                                                    placeholder="Confirm your new password"
                                                />
                                            </div>
                                            {passwordErrors.password_confirmation && (
                                                <p className="mt-2 text-sm text-destructive">{passwordErrors.password_confirmation}</p>
                                            )}
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={passwordProcessing}
                                            className="rounded-lg bg-red-600 px-6 py-3 text-base font-semibold text-white transition hover:bg-red-700 disabled:bg-red-600/50"
                                        >
                                            {passwordProcessing ? 'Updating...' : 'Update Password'}
                                        </button>
                                    </form>
                                </div>
                            )}

                            {/* Danger Zone Tab */}
                            {activeTab === 'danger' && (
                                <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-8">
                                    <div className="flex items-start gap-4">
                                        <AlertTriangle className="mt-1 h-6 w-6 shrink-0 text-destructive" />
                                        <div className="flex-1">
                                            <h2 className="mb-2 text-2xl font-bold text-destructive">Delete Account</h2>
                                            <p className="mb-4 text-sm text-muted-foreground">
                                                Permanently delete your account and all of your data. This action cannot be undone.
                                            </p>

                                            {!showDeleteConfirm ? (
                                                <button
                                                    type="button"
                                                    onClick={() => setShowDeleteConfirm(true)}
                                                    className="rounded-lg border-2 border-destructive px-6 py-3 text-base font-semibold text-destructive transition hover:bg-destructive/10"
                                                >
                                                    Delete My Account
                                                </button>
                                            ) : (
                                                <div className="rounded-lg border-2 border-red-600 bg-white p-6">
                                                    <p className="mb-4 font-semibold text-foreground">Are you absolutely sure?</p>
                                                    <p className="mb-4 text-sm text-muted-foreground">
                                                        This will permanently delete your account and remove all your data from our servers.
                                                    </p>
                                                    <div className="flex gap-3">
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowDeleteConfirm(false)}
                                                            className="flex-1 rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-muted"
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="flex-1 rounded-lg bg-destructive px-4 py-2 text-sm font-semibold text-white transition hover:bg-destructive/90"
                                                        >
                                                            Yes, Delete Account
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}

