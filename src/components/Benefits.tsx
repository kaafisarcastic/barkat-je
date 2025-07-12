import React from "react";
import RevealonScroll from "./ServiceforAnimation/RevealonScroll";
import RevealTextwithWipe from "./ServiceforAnimation/RevealTextwithWipe";
import { House, FileText, Zap, MoreHorizontal } from "lucide-react";
const navItems = [
  { icon: <House size={20} />, label: "AI Powered" },
  { icon: <FileText size={20} />, label: "100% Secure" },
  { icon: <Zap size={20} />, label: "Impactful Questions" },
  { icon: <MoreHorizontal size={20} />, label: "Risk Analysis" },
];
function Benefits() {
  return (
    <section className="bg-[#ffffff] rounded-2xl w-full py-30">
      <div className=" rounded-2xl  text-center max-w-3xl mx-auto px-6 py-8 bg-[#f9f9f9] backdrop-blur-md shadow-lg border border-white/20">
        <RevealTextwithWipe delay={0.2}>
          {" "}
          <h1 className="text-black font-sanserif text-8xl leading-none">
            Benefits
          </h1>
        </RevealTextwithWipe>
        <RevealonScroll delay={0.4}>
          {" "}
          <p className="text-[#555555] font-sanserif text-base  leading-none">
            Tool that helps couples explore core areas of their relationshp
            before marriage.
          </p>
          <div className="flex items-center justify-around min-w-80 min-h-30 px-4 py-2 rounded-full bg-[#f9f9f9] backdrop-blur-md shadow-lg border border-white/20 mx-auto mt-10">
            {navItems.map((item, index) => (
              <div
                key={index}
                className={`flex flex-col items-center justify-center px-4 py-2 rounded-full transition-all duration-300 text-gray-500 hover:text-black `}
              >
                {item.icon}
                <span className="text-sm mt-1">{item.label}</span>
              </div>
            ))}
          </div>
        </RevealonScroll>
      </div>
    </section>
  );
}

export default Benefits;
