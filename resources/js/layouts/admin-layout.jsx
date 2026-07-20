import AdminNavbar from '@/components/admin/admin-navbar';

export default function AdminLayout({ children }) {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <AdminNavbar />
            <div className="w-full">{children}</div>
        </div>
    );
}
