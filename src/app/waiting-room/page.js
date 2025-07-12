"use client";
import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function WaitingRoom() {
  const [timeLeft, setTimeLeft] = useState(24 * 60 * 60); // 24 hours in seconds
  const router = useRouter();

  const searchParams = useSearchParams();
  const [invite, setinvite] = useState("");

  useEffect(() => {
    const inviteId = searchParams.get("inviteid");
    console.log("Invite ID:", inviteId);
    setinvite(inviteId);
  }, [searchParams]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const handleResendInvite = () => {
    alert("Resent invite (implement API call)");
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard");
  };

  const handleRefreshStatus = () => {
    router.push(`/report?inviteid=${invite}`);
  };

  return (
    <section
      className="bg-[#ffffff] rounded-2xl w-full py-30"
      id="waiting-room"
    >
      <div className="rounded-2xl text-center max-w-3xl mx-auto px-6 py-8 bg-[#f9f9f9] backdrop-blur-md shadow-lg border border-white/20">
        <h1 className="text-black font-sanserif text-8xl leading-none">
          Thanks!
        </h1>
        <p className="text-[#555555] font-sanserif text-base leading-none mt-2">
          We’ve recorded your answers. Now we’re awaiting your partner’s
          response.
        </p>

        <div className="flex flex-col items-center justify-between space-y-4 min-w-80 min-h-60 px-6 py-4 rounded-2xl backdrop-blur-md shadow-lg border border-white/20 mx-auto mt-10">
          <h1 className="text-[#555555] text-xl">
            ⏳ Partner has{" "}
            <span className="text-[#e94e4e] font-mono">
              {formatTime(timeLeft)}
            </span>{" "}
            left to finish.
          </h1>

          <button
            onClick={handleResendInvite}
            className="px-6 py-3 min-w-80 bg-black text-white rounded-md shadow hover:bg-[#e94e4e] transition"
          >
            Resend Invite
          </button>

          <button
            onClick={handleCopyLink}
            className="px-6 py-3 min-w-80  bg-black text-white rounded-md shadow hover:bg-[#e94e4e] transition"
          >
            Copy Link
          </button>

          <button
            onClick={handleRefreshStatus}
            className="px-6 py-3 min-w-80 bg-black text-white rounded-md shadow hover:bg-[#e94e4e] transition"
          >
            Refresh Status
          </button>
        </div>
      </div>
    </section>
  );
}
