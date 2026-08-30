import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Lock, User, AlertTriangle, MessageCircle, ShieldCheck, Truck } from 'lucide-react';
import ShopNavigation from '@/components/shop-navigation';
import { useAppContext } from '@/context/appContext';
import { useAppearance } from '@/hooks/use-appearance';
import { resolveTranslation } from '@/lib/translations';

export default function AccountSettings({ auth }) {
    const { selectedLanguage } = useAppContext();
    const t = (key, fallback = key) => resolveTranslation(selectedLanguage, key, fallback);
    const { resolvedAppearance } = useAppearance();
    const isDarkMode = resolvedAppearance === 'dark';
    const labelTextClass = isDarkMode ? 'text-white/80' : 'text-black/70';
    const inputClass = isDarkMode
        ? 'w-full rounded-lg border border-white/10 bg-[#111111] px-4 py-3 text-base text-white placeholder:text-white/40 transition focus:border-white/40 focus:outline-none'
        : 'w-full rounded-lg border border-black/10 bg-white px-4 py-3 text-base text-black placeholder:text-black/40 transition focus:border-black focus:outline-none';

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
            <Head title={t('account.title')} />

            <main className="min-h-screen bg-background text-foreground">
                <ShopNavigation auth={auth} cartItemCount={0} />

                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <div className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
                        <Link href="/notification" className="hover:text-foreground">{t('account.home')}</Link>
                        <span>/</span>
                        <Link href="/notification" className="hover:text-foreground">{t('account.settings')}</Link>
                        <span>/</span>
                        <span className="font-semibold text-foreground">{t('account.account')}</span>
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
                                {t('account.account')}
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
                                {t('account.security')}
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveTab('shipping')}
                                className={`w-full rounded-lg px-4 py-3 text-left font-semibold transition ${
                                    activeTab === 'shipping'
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-muted-foreground hover:bg-muted'
                                }`}
                            >
                                <Truck className="mb-2 inline-block w-5 h-5 mr-3" />
                                {t('account.shippingPolicy')}
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveTab('privacy')}
                                className={`w-full rounded-lg px-4 py-3 text-left font-semibold transition ${
                                    activeTab === 'privacy'
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-muted-foreground hover:bg-muted'
                                }`}
                            >
                                <ShieldCheck className="mb-2 inline-block w-5 h-5 mr-3" />
                                {t('account.privacyPolicy')}
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
                                {t('common.dangerZone')}
                            </button>

                            <div className="mt-8 rounded-lg border border-border bg-muted/80 p-4">
                                <div className="mb-3 flex items-start gap-3">
                                    <MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                                    <div>
                                        <h3 className="mb-1 font-semibold text-foreground">{t('account.help')}</h3>
                                        <p className="mb-3 text-xs text-muted-foreground">
                                            {t('account.helpCopy')}
                                        </p>
                                        <a
                                            href="https://www.instagram.com/street_wearcap"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80"
                                        >
                                            {t('account.contactSupport')}
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
                                    <h2 className="mb-2 text-2xl font-bold">{t('account.shopInformation')}</h2>
                                    <p className="mb-6 text-sm text-muted-foreground">{t('account.shopInformationCopy')}</p>

                                    <form onSubmit={handleProfileSubmit} className="space-y-6">
                                        {/* Name Field */}
                                        <div>
                                            <label className={`block text-sm font-semibold mb-2 ${labelTextClass}`}>
                                                {t('account.fullName')}
                                            </label>
                                            <input
                                                type="text"
                                                value={profileData.name}
                                                onChange={(e) => setProfileData('name', e.target.value)}
                                                className={inputClass}
                                                placeholder={t('account.yourFullName')}
                                            />
                                            {profileErrors.name && (
                                                <p className="mt-2 text-sm text-destructive">{profileErrors.name}</p>
                                            )}
                                        </div>

                                        {/* Email Field */}
                                        <div>
                                            <label className={`block text-sm font-semibold mb-2 ${labelTextClass}`}>
                                                {t('account.emailAddress')}
                                            </label>
                                            <input
                                                type="email"
                                                value={profileData.email}
                                                onChange={(e) => setProfileData('email', e.target.value)}
                                                className={inputClass}
                                                placeholder={t('account.emailPlaceholder')}
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
                                            {profileProcessing ? t('common.saving') : t('common.saveChanges')}
                                        </button>
                                    </form>
                                </div>
                            )}

                            {/* Security Tab */}
                            {activeTab === 'security' && (
                                <div className="rounded-2xl border border-border bg-card p-8">
                                    <h2 className="mb-2 text-2xl font-bold">{t('account.changePassword')}</h2>
                                    <p className="mb-6 text-sm text-muted-foreground">{t('account.changePasswordCopy')}</p>

                                    <form onSubmit={handlePasswordSubmit} className="space-y-6">
                                        {/* Current Password */}
                                        <div>
                                            <label className={`block text-sm font-semibold mb-2 ${labelTextClass}`}>
                                                {t('account.currentPassword')}
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="password"
                                                    value={passwordData.current_password}
                                                    onChange={(e) => setPasswordData('current_password', e.target.value)}
                                                    className={inputClass}
                                                    placeholder={t('account.currentPasswordPlaceholder')}
                                                />
                                            </div>
                                            {passwordErrors.current_password && (
                                                <p className="mt-2 text-sm text-destructive">{passwordErrors.current_password}</p>
                                            )}
                                        </div>

                                        {/* New Password */}
                                        <div>
                                            <label className={`block text-sm font-semibold mb-2 ${labelTextClass}`}>
                                                {t('account.newPassword')}
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="password"
                                                    value={passwordData.password}
                                                    onChange={(e) => setPasswordData('password', e.target.value)}
                                                    className={inputClass}
                                                    placeholder={t('account.newPasswordPlaceholder')}
                                                />
                                            </div>
                                            {passwordErrors.password && (
                                                <p className="mt-2 text-sm text-destructive">{passwordErrors.password}</p>
                                            )}
                                        </div>

                                        {/* Confirm Password */}
                                        <div>
                                            <label className={`block text-sm font-semibold mb-2 ${labelTextClass}`}>
                                                {t('account.confirmPassword')}
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="password"
                                                    value={passwordData.password_confirmation}
                                                    onChange={(e) => setPasswordData('password_confirmation', e.target.value)}
                                                    className={inputClass}
                                                    placeholder={t('account.confirmPasswordPlaceholder')}
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
                                            {passwordProcessing ? t('common.updating') : t('common.updatePassword')}
                                        </button>
                                    </form>
                                </div>
                            )}

                            {/* Shipping Policy Tab */}
                            {activeTab === 'shipping' && (
                                <div className="rounded-2xl border border-border bg-card p-8">
                                    <div className="mb-6 flex items-center gap-3">
                                        <Truck className="h-6 w-6 text-foreground" />
                                        <h2 className="text-2xl font-bold">{t('account.shippingHeading')}</h2>
                                    </div>

                                    <div className="space-y-5 text-base leading-8 text-muted-foreground">
                                        <p>{t('shippingPolicy.paragraph1')}</p>
                                        <p>{t('shippingPolicy.paragraph2')}</p>
                                        <p>{t('shippingPolicy.paragraph3')}</p>
                                        <p>{t('shippingPolicy.paragraph4')}</p>
                                    </div>
                                </div>
                            )}

                            {/* Privacy Policy Tab */}
                            {activeTab === 'privacy' && (
                                <div className="rounded-2xl border border-border bg-card p-8">
                                    <div className="mb-6 flex items-center gap-3">
                                        <ShieldCheck className="h-6 w-6 text-foreground" />
                                        <h2 className="text-2xl font-bold">{t('account.privacyHeading')}</h2>
                                    </div>

                                    <div className="space-y-5 text-base leading-8 text-muted-foreground">
                                        <p>{t('privacyPolicy.paragraph1')}</p>
                                        <p>{t('privacyPolicy.paragraph2')}</p>
                                        <p>{t('privacyPolicy.paragraph3')}</p>
                                        <p>{t('privacyPolicy.paragraph4')}</p>
                                    </div>
                                </div>
                            )}

                            {/* Danger Zone Tab */}
                            {activeTab === 'danger' && (
                                <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-8">
                                    <div className="flex items-start gap-4">
                                        <AlertTriangle className="mt-1 h-6 w-6 shrink-0 text-destructive" />
                                        <div className="flex-1">
                                            <h2 className="mb-2 text-2xl font-bold text-destructive">{t('account.deleteAccount')}</h2>
                                            <p className="mb-4 text-sm text-muted-foreground">
                                                {t('account.deleteAccountCopy')}
                                            </p>

                                            {!showDeleteConfirm ? (
                                                <button
                                                    type="button"
                                                    onClick={() => setShowDeleteConfirm(true)}
                                                    className="rounded-lg border-2 border-destructive px-6 py-3 text-base font-semibold text-destructive transition hover:bg-destructive/10"
                                                >
                                                    {t('account.deleteWarning')}
                                                </button>
                                            ) : (
                                                <div className="rounded-lg border-2 border-red-600 bg-white p-6">
                                                    <p className="mb-4 font-semibold text-foreground">{t('account.areYouSure')}</p>
                                                    <p className="mb-4 text-sm text-muted-foreground">
                                                        {t('account.deleteConfirmationCopy')}
                                                    </p>
                                                    <div className="flex gap-3">
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowDeleteConfirm(false)}
                                                            className="flex-1 rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-muted"
                                                        >
                                                            {t('common.cancel')}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="flex-1 rounded-lg bg-destructive px-4 py-2 text-sm font-semibold text-white transition hover:bg-destructive/90"
                                                        >
                                                            {t('common.yesDeleteAccount')}
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

