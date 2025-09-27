function Loading({height="100vh"}) {
    return (
        <div style={{height}} className="w-full h-full flex justify-center items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
        </div>
    );
}
export default Loading;