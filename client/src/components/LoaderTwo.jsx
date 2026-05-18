import React from "react";

const LoaderTwo = () => {
    return (
        <div className="flex min-h-[55vh] items-center justify-center bg-transparent px-4">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Archivo:wght@600;800;900&family=Fraunces:opsz,wght@9..144,800&display=swap');
                .loader-shell{font-family:'Archivo',sans-serif}
                .loader-display{font-family:'Fraunces',serif}
                @keyframes loaderSlide{0%{transform:translateX(-120%)}100%{transform:translateX(120%)}}
            `}</style>
            <div className="loader-shell w-full max-w-sm rounded-[2rem] border border-[#111315] bg-white p-6 text-center shadow-[8px_8px_0_#f6cf4f]">
                <div className="mx-auto h-3 w-full overflow-hidden rounded-full bg-zinc-100">
                    <div className="h-full w-1/2 rounded-full bg-[#111315]" style={{ animation: "loaderSlide 1s ease-in-out infinite alternate" }} />
                </div>
                <h2 className="loader-display mt-5 text-4xl leading-none text-[#111315]">Loading</h2>
                <p className="mt-2 text-sm font-bold text-zinc-500">Connecting to your MyBlogs workspace.</p>
            </div>
        </div>
    );
};

export default LoaderTwo;
