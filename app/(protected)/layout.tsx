import { NextAuthProvider } from '../NextAuthProvider';

export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div style={{ height: '100%' }}>
            {children}
        </div>
    );
}
