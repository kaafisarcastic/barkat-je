import React from "react";
import RevealonScroll from "./ServiceforAnimation/RevealonScroll";
import RevealTextwithWipe from "./ServiceforAnimation/RevealTextwithWipe";
import { FileText, House, MoreHorizontal, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

const navItems = [
  { icon: <House size={20} />, label: "AI Powered" },
  { icon: <FileText size={20} />, label: "100% Secure" },
  { icon: <Zap size={20} />, label: "Impactful Questions" },
  { icon: <MoreHorizontal size={20} />, label: "Risk Analysis" },
];

function Introduction() {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/getstarted");
  };

  const handleReadRules = () => {
    const rulesSection = document.getElementById("rules-section");
    if (rulesSection) {
      rulesSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="rounded-2xl bg-[#ffffff] w-full py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <RevealTextwithWipe delay={0.2}>
          <h1 className="text-black font-sanserif text-4xl sm:text-6xl lg:text-8xl leading-tight sm:leading-none">
            Welcome to the compatibility test.
          </h1>
        </RevealTextwithWipe>
        <RevealonScroll delay={0.4}>
          <p className="text-[#555555] font-sanserif text-base sm:text-lg mt-4 sm:mt-6 leading-snug">
            Align your expectations. Build a stronger foundation. Start honest
            conversations before you say “I do.”
          </p>
        </RevealonScroll>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4 px-4 sm:px-0 py-10 sm:py-20">
        <button
          className="w-full  sm:w-auto px-6 py-3 bg-white/20 backdrop-blur-md text-black rounded-md shadow border border-[#000000] hover:bg-[#e94e4e] transition"
          onClick={handleReadRules}
        >
          Read Rules
        </button>
        <button
          className="w-full sm:w-auto px-6 py-3 bg-black text-white rounded-md shadow hover:bg-[#e94e4e] transition"
          onClick={handleLogin}
        >
          Get Started
        </button>
      </div>
    </section>
  );
}

export default Introduction;
