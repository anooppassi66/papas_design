"use client";

export default function AnnouncementBar() {
  return (
    <div className="bg-[#f69a39] h-[30px] flex items-center justify-center relative">
      <div className="max-w-[1440px] w-full px-4 flex items-center justify-between text-[9.5px] font-medium text-white tracking-wide">
        <a href="/newsletter" className="underline hover:no-underline transition-all hidden md:block">
          Sign Up to our Newsletter
        </a>
        <div className="flex items-center gap-4 md:gap-6 mx-auto md:mx-0">
          <a href="/stores" className="underline hover:no-underline transition-all">Our Stores</a>
          <a href="/blogs/cricket" className="underline hover:no-underline transition-all">Cricket Blog</a>
        </div>
      </div>
    </div>
  );
}
