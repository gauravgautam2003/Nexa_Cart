import Link from "next/link";
import { Compass } from "lucide-react";

export default function NotFound() {
    return (
        <div className="page-shell flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
            <Compass size={48} className="text-brand" />
            <h1 className="mt-4 text-3xl font-black text-gray-900">Page not found</h1>
            <p className="mt-2 max-w-sm text-sm text-gray-500">
                The page you are looking for was moved, deleted, or never existed.
            </p>
            <Link href="/" className="btn btn-primary mt-6">
                Back to home
            </Link>
        </div>
    );
}
