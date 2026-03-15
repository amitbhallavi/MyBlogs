import React from 'react'

const Loader = () => {
    return (
        <>


            <div
                className={`fixed inset-0 flex flex-col items-center justify-center bg-zinc-950 z-50 transition-opacity duration-700 ${fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"}`}
                style={{ fontFamily: "'DM Sans',sans-serif" }}
            >



                <style>{`
                                                               @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800&family=Playfair+Display:wght@700;900&display=swap');
                                                               @keyframes logoBreathe{0%,100%{transform:scale(1);box-shadow:0 0 40px rgba(251,191,36,.25)}50%{transform:scale(1.06);box-shadow:0 0 70px rgba(251,191,36,.45)}}
                                                               @keyframes orbitA{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
                                                               @keyframes orbitB{from{transform:rotate(0deg)}to{transform:rotate(-360deg)}}
                                                               @keyframes dotBounce{0%,80%,100%{transform:translateY(0);opacity:.4}40%{transform:translateY(-12px);opacity:1}}
                                                               @keyframes blobDrift{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(20px,-15px) scale(1.05)}}
                                                               .logo-breathe{animation:logoBreathe 2.4s ease-in-out infinite}
                                                               .orbit-a{animation:orbitA 4s linear infinite}
                                                               .orbit-b{animation:orbitB 6s linear infinite}
                                                               .dot-bounce{animation:dotBounce 1.3s ease-in-out infinite}
                                                               .blob{animation:blobDrift 6s ease-in-out infinite}
                  `}</style>

                {/* Background ambient blobs */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
                    <div className="blob absolute top-1/4 left-1/4 w-[480px] h-[480px] bg-amber-500 rounded-full opacity-[0.04] blur-3xl" />
                    <div className="blob absolute bottom-1/3 right-1/4 w-80 h-80 bg-orange-400 rounded-full opacity-[0.04] blur-3xl" style={{ animationDelay: "2s" }} />
                    <div className="blob absolute top-2/3 left-1/3 w-56 h-56 bg-yellow-300 rounded-full opacity-[0.03] blur-2xl" style={{ animationDelay: "4s" }} />
                </div>

                {/* Orbit rings + logo */}
                <div className="relative mb-10 flex items-center justify-center">
                    {/* Outer ring */}
                    <div className="orbit-a absolute w-28 h-28 rounded-full border border-amber-400/15" />
                    {/* Middle ring */}
                    <div className="orbit-b absolute w-20 h-20 rounded-full border border-amber-400/25" />
                    {/* Logo cube */}
                    <div className="logo-breathe relative w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-2xl shadow-amber-500/50 z-10">
                        <span className="text-zinc-900 font-black text-3xl" style={{ fontFamily: "'Playfair Display',serif" }}>G</span>
                    </div>
                    {/* Orbiting dot */}
                    <div className="orbit-a absolute w-28 h-28">
                        <div className="w-2 h-2 bg-amber-400 rounded-full shadow-md shadow-amber-400 absolute -top-1 left-1/2 -translate-x-1/2" />
                    </div>
                </div>

                {/* Brand */}
                <h1 className="text-white font-black text-4xl tracking-tight mb-1" style={{ fontFamily: "'Playfair Display',serif" }}>
                    MyGlogs
                </h1>
                <p className="text-zinc-600 text-xs mb-10 uppercase tracking-[0.25em]">Your personal blogging universe</p>

                {/* Progress */}
                <div className="w-72 space-y-2.5">
                    <div className="relative h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        {/* Shimmer */}
                        <div
                            className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-amber-400 via-orange-300 to-amber-400 transition-all duration-100 ease-linear"
                            style={{ width: `${progress}%`, boxShadow: "0 0 10px rgba(251,191,36,.7)" }}
                        />
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-zinc-500 text-xs">{loadingStep}</span>
                        <span className="text-amber-400 font-bold text-xs tabular-nums">{progress}%</span>
                    </div>
                </div>

                {/* Bouncing dots */}
                <div className="flex gap-2 mt-10">
                    {[0, 1, 2, 3, 4].map(i => (
                        <div
                            key={i}
                            className="dot-bounce w-1.5 h-1.5 bg-amber-400 rounded-full"
                            style={{ animationDelay: `${i * 160}ms` }}
                        />
                    ))}
                </div>
            </div>
            );
        </>
    )
}

export default Loader
