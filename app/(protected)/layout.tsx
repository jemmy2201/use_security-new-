import { NextAuthProvider } from '../NextAuthProvider';

export default function ProtectedLayout({
    children, // will be a page or nested layout
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <NextAuthProvider>{children}</NextAuthProvider>
        </>
    )
}