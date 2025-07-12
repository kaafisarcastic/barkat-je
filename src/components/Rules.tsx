import React from "react";
import RevealonScroll from "./ServiceforAnimation/RevealonScroll";
import RevealTextwithWipe from "./ServiceforAnimation/RevealTextwithWipe";

function Rules() {
  return (
    <section
      className=" bg-[#ffffff] rounded-2xl w-full py-30"
      id="rules-section"
    >
      <div className=" rounded-2xl  text-center max-w-3xl mx-auto px-6 py-8 bg-[#f9f9f9] backdrop-blur-md shadow-lg border border-white/20">
        <RevealTextwithWipe delay={0.2}>
          {" "}
          <h1 className="text-black font-sanserif text-8xl leading-none">
            Rules
          </h1>
        </RevealTextwithWipe>
        <RevealonScroll delay={0.4}>
          {" "}
          <p className="text-[#555555] font-sanserif text-base  leading-none">
            Kindly follow these rules to build a healthy and lifetime
            relationship
          </p>
          <div className="flex flex-col items-center justify-between space-y-4 min-w-80 min-h-60 px-6 py-4 rounded-2xl  backdrop-blur-md shadow-lg border border-white/20 mx-auto mt-10">
            <h1 className="text-[#555555] hover:text-[#e94e4e] text-left">
              Answer honestly
            </h1>
            <h1 className="text-[#555555] hover:text-[#e94e4e] text-left">
              Both partners must participate
            </h1>
            <h1 className="text-[#555555] hover:text-[#e94e4e] text-left">
              No liability - this is a facilitatory tool
            </h1>
          </div>
        </RevealonScroll>
      </div>
    </section>
  );
}

export default Rules;
