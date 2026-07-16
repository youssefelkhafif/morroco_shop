import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { ArrowLeft, Mail, Lock, User, AlertTriangle, MessageCircle } from 'lucide-react';

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

            <main className="min-h-screen bg-[#f7f7f3] text-[#111111]">
                {/* Header */}
                <header className="sticky top-0 z-20 border-b border-black/10 bg-white/90 backdrop-blur">
                    <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
                        <Link href="/" className="text-lg font-black uppercase tracking-[0.24em]">
                            Streetwear Caps
                        </Link>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-black/60">Welcome, {auth?.user?.name}</span>
                        </div>
                    </div>
                </header>

                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <div className="mb-8 flex items-center gap-2 text-sm text-black/60">
                        <Link href="/notification" className="hover:text-black">Home</Link>
                        <span>/</span>
                        <Link href="/notification" className="hover:text-black">Settings</Link>
                        <span>/</span>
                        <span className="text-black font-semibold">Account</span>
                    </div>

                    <div className="grid gap-8 lg:grid-cols-[250px_1fr]">
                        {/* Sidebar Navigation */}
                        <div className="space-y-4">
                            <button
                                onClick={() => setActiveTab('account')}
                                className={`w-full rounded-lg px-4 py-3 text-left font-semibold transition ${
                                    activeTab === 'account'
                                        ? 'bg-red-50 text-red-600'
                                        : 'text-black/70 hover:bg-black/5'
                                }`}
                            >
                                <User className="mb-2 inline-block w-5 h-5 mr-3" />
                                Account
                            </button>

                            <button
                                onClick={() => setActiveTab('security')}
                                className={`w-full rounded-lg px-4 py-3 text-left font-semibold transition ${
                                    activeTab === 'security'
                                        ? 'bg-red-50 text-red-600'
                                        : 'text-black/70 hover:bg-black/5'
                                }`}
                            >
                                <Lock className="mb-2 inline-block w-5 h-5 mr-3" />
                                Security
                            </button>

                            <button
                                onClick={() => setActiveTab('danger')}
                                className={`w-full rounded-lg px-4 py-3 text-left font-semibold transition ${
                                    activeTab === 'danger'
                                        ? 'bg-red-50 text-red-600'
                                        : 'text-black/70 hover:bg-black/5'
                                }`}
                            >
                                <AlertTriangle className="mb-2 inline-block w-5 h-5 mr-3" />
                                Danger Zone
                            </button>

                            <div className="rounded-lg border border-black/10 bg-red-50 p-4 mt-8">
                                <div className="flex items-start gap-3 mb-3">
                                    <MessageCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-semibold text-black mb-1">Need help?</h3>
                                        <p className="text-xs text-black/60 mb-3">
                                            If you need assistance, our support team is here to help.
                                        </p>
                                        <a
                                            href="https://www.instagram.com/street_wearcap"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1"
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
                                <div className="rounded-2xl border border-black/10 bg-white p-8">
                                    <h2 className="mb-2 text-2xl font-bold">Shop Information</h2>
                                    <p className="mb-6 text-sm text-black/60">Update your account name and email address.</p>

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
                                                <p className="mt-2 text-sm text-red-600">{profileErrors.name}</p>
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
                                                <p className="mt-2 text-sm text-red-600">{profileErrors.email}</p>
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
                                <div className="rounded-2xl border border-black/10 bg-white p-8">
                                    <h2 className="mb-2 text-2xl font-bold">Change Password</h2>
                                    <p className="mb-6 text-sm text-black/60">Update your password to keep your account secure.</p>

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
                                                <p className="mt-2 text-sm text-red-600">{passwordErrors.current_password}</p>
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
                                                <p className="mt-2 text-sm text-red-600">{passwordErrors.password}</p>
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
                                                <p className="mt-2 text-sm text-red-600">{passwordErrors.password_confirmation}</p>
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
                                <div className="rounded-2xl border border-red-300 bg-red-50 p-8">
                                    <div className="flex items-start gap-4">
                                        <AlertTriangle className="w-6 h-6 text-red-600 mt-1 flex-shrink-0" />
                                        <div className="flex-1">
                                            <h2 className="mb-2 text-2xl font-bold text-red-600">Delete Account</h2>
                                            <p className="mb-4 text-sm text-black/70">
                                                Permanently delete your account and all of your data. This action cannot be undone.
                                            </p>

                                            {!showDeleteConfirm ? (
                                                <button
                                                    type="button"
                                                    onClick={() => setShowDeleteConfirm(true)}
                                                    className="rounded-lg border-2 border-red-600 px-6 py-3 text-base font-semibold text-red-600 transition hover:bg-red-50"
                                                >
                                                    Delete My Account
                                                </button>
                                            ) : (
                                                <div className="rounded-lg border-2 border-red-600 bg-white p-6">
                                                    <p className="mb-4 font-semibold text-black">Are you absolutely sure?</p>
                                                    <p className="mb-4 text-sm text-black/70">
                                                        This will permanently delete your account and remove all your data from our servers.
                                                    </p>
                                                    <div className="flex gap-3">
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowDeleteConfirm(false)}
                                                            className="flex-1 rounded-lg border border-black/10 px-4 py-2 text-sm font-semibold text-black transition hover:bg-black/5"
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
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

