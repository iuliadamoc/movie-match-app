export default function MovieSkeleton() {
    return (
        <div className="bg-white rounded-xl shadow overflow-hidden animate-pulse">
            <div className="w-full h-80 bg-gray-200"></div>
            <div className="p-3 space-y-2">
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </div>
        </div>
    );
}