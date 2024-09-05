import { NextAuthProvider } from '../NextAuthProvider';

export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            {children}
        </>
    );
}
