import Link from "next/link";

export default function NotFound() {
  return (
    <div className="bg-black min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-20">
      <p className="text-[#f69a39] text-[80px] md:text-[120px] font-bold leading-none">404</p>
      <h1 className="text-white text-[22px] md:text-[28px] font-semibold mt-2 mb-3">
        Page Not Found
      </h1>
      <p className="text-white/50 text-[14px] max-w-[420px] mb-8">
        The page you&apos;re looking for has been removed or the URL has changed. Keep your eye on the ball.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/"
          className="px-8 py-3 bg-[#f69a39] text-white text-[12px] font-semibold tracking-[0.5px] uppercase rounded-[3px] hover:bg-[#e8880d] transition-colors"
        >
          Back to Home
        </Link>
        <Link
          href="/products"
          className="px-8 py-3 border border-white/30 text-white text-[12px] font-semibold tracking-[0.5px] uppercase rounded-[3px] hover:border-white/60 transition-colors"
        >
          Browse Products
        </Link>
      </div>
    </div>
  );
}
