import { Link, usePage } from '@inertiajs/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import AdminSidebar from '@/components/admin/admin-sidebar';
import { useInitials } from '@/hooks/use-initials';

const mainLinks = [
    { label: 'Dashboard', href: '/admin' },
    { label: 'Orders', href: '/admin/orders' },
    { label: 'Products', href: '/admin/products' },
    { label: 'Categories', href: '/admin/categories' },
];

export default function AdminNavbar() {
    const page = usePage();
    const { auth } = page.props;
    const getInitials = useInitials();

    return (
        <header className="border-b border-border bg-card/90 px-6 py-4 backdrop-blur-sm">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin"
                        className="text-lg font-semibold text-foreground"
                    >
                        Admin
                    </Link>

                    <nav className="hidden items-center gap-2 text-sm text-muted-foreground sm:flex">
                        {mainLinks.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="rounded-full px-3 py-2 transition hover:bg-muted hover:text-foreground"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className="flex items-center gap-3">
                    <span className="hidden text-sm text-muted-foreground sm:block">
                        Admin panel
                    </span>

                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full"
                            >
                                <Avatar className="size-8 overflow-hidden rounded-full">
                                    <AvatarImage
                                        src={auth.user?.avatar}
                                        alt={auth.user?.name}
                                    />
                                    <AvatarFallback className="rounded-full bg-muted text-foreground">
                                        {getInitials(auth.user?.name ?? '')}
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </SheetTrigger>

                        <SheetContent side="left" className="p-0 sm:max-w-sm">
                            <SheetHeader className="border-b border-border px-6 py-4">
                                <SheetTitle>Admin menu</SheetTitle>
                            </SheetHeader>
                            <div className="h-full overflow-y-auto bg-background">
                                <AdminSidebar
                                    currentPath={page.url}
                                    variant="drawer"
                                />
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
