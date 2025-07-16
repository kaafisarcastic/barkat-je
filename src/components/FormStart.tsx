"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import RevealTextwithWipe from "./ServiceforAnimation/RevealTextwithWipe";

function FormStart() {
  const router = useRouter();
  const [form, setForm] = useState({
    yourName: "",
    yourEmail: "",
    partnerName: "",
    partnerEmail: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [verifyStatus, setVerifyStatus] = useState("");
  const [timer, setTimer] = useState(180);
  const [resendTimer, setResendTimer] = useState(60);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [inviteId, setInviteId] = useState("");
  const [testToken, setTestToken] = useState(""); // second userId
  const [user1, setUser1] = useState(""); // first userId
  const [testLink, setTestLink] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setOtpSent(false);
    setVerifyStatus("");

    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        body: JSON.stringify(form),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        setOtpSent(true);
        setTimer(180);
        setResendTimer(60);
      } else {
        setVerifyStatus("Failed to send OTP. Try again.");
      }
    } catch {
      setVerifyStatus("Server error. Try again.");
    }
  };

  const handleVerify = async () => {
    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        body: JSON.stringify({ email: form.yourEmail, otp }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (data.success) {
        setVerifyStatus("Verified!");

        // Generate IDs
        const sharedInviteId = Math.floor(Math.random() * 1000000);
        const userId1 = Math.floor(Math.random() * 1000000);
        const userId2 = Math.floor(Math.random() * 1000000);

        // Save inviteId
        await fetch("/api/inviteid", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ inviteId: sharedInviteId }),
        });

        // Save userId1
        await fetch("/api/userid", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: userId1 }),
        });

        // Save userId2
        await fetch("/api/userid", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: userId2 }),
        });

        setInviteId(String(sharedInviteId));
        setUser1(String(userId1));
        setTestToken(String(userId2));
      } else {
        setVerifyStatus("Invalid OTP or expired.");
      }
    } catch {
      setVerifyStatus("Server error. Try again.");
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        body: JSON.stringify(form),
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        setResendTimer(60);
        setOtpSent(true);
        setTimer(180);
        setOtp("");
        setVerifyStatus("OTP resent!");
      } else {
        setVerifyStatus("Failed to resend OTP.");
      }
    } catch {
      setVerifyStatus("Server error. Try again.");
    }
  };

  // Set up countdown timer
  useEffect(() => {
    if (otpSent) {
      if (intervalRef.current) clearInterval(intervalRef.current);

      intervalRef.current = setInterval(() => {
        setTimer((t) => (t > 0 ? t - 1 : 0));
        setResendTimer((r) => (r > 0 ? r - 1 : 0));
      }, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [otpSent]);

  // Invalidate OTP on expiry
  useEffect(() => {
    if (timer === 0) {
      setOtp("");
      setOtpSent(false);
      setVerifyStatus("OTP expired. Please resend.");
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [timer]);

  // Build test link when ready
  useEffect(() => {
    if (inviteId && testToken && typeof window !== "undefined") {
      setTestLink(
        `${window.location.origin}/partner?inviteId=${inviteId}&userId=${testToken}`
      );
    }
  }, [inviteId, testToken]);

  return (
    <section className="bg-[#ffffff] rounded-2xl w-full py-16">
      <div className="max-w-2xl text-center mx-auto px-6 py-8 bg-white rounded-2xl shadow">
        <RevealTextwithWipe delay={0.2}>
          <h1 className="text-[#000000] font-inter text-2xl mb-6">
            Who's taking the test?
          </h1>
        </RevealTextwithWipe>

        {!submitted ? (
          <form className="space-y-4" onSubmit={handleSubmit}>
            {["yourName", "yourEmail", "partnerName", "partnerEmail"].map(
              (field, idx) => (
                <div key={field}>
                  <label className="block text-sm text-[#999999] font-inter mb-1 text-left">
                    {
                      [
                        "Your Name",
                        "Your Email",
                        "Partner's Name",
                        "Partner's Email",
                      ][idx]
                    }
                  </label>
                  <input
                    type={field.includes("Email") ? "email" : "text"}
                    name={field}
                    value={form[field as keyof typeof form]}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-[#ededed] rounded-[6px] text-black font-inter text-base bg-[#f9f9f9] focus:outline-[#E94E4E]"
                  />
                </div>
              )
            )}
            <button
              type="submit"
              className="w-full h-12 bg-black text-white rounded-[6px] font-inter text-base hover:bg-[#E94E4E] transition-colors mt-4"
            >
              Generate Invite
            </button>
          </form>
        ) : otpSent ? (
          <div className="space-y-4">
            <div className="font-inter text-base text-[#555555]">
              Enter the OTP sent to both emails:
            </div>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              className="w-full text-black px-4 py-2 border border-[#ededed] rounded-[6px] font-inter text-base bg-[#f9f9f9] focus:outline-none"
              placeholder="Enter OTP"
            />
            <button
              className="w-full h-12 bg-black text-white rounded-[6px] font-inter text-base hover:bg-[#E94E4E] transition-colors"
              onClick={handleVerify}
              disabled={timer === 0}
            >
              Verify OTP ({timer}s left)
            </button>
            <button
              className="w-full border border-black text-black rounded-[6px] px-4 py-2 font-inter text-base hover:text-[#E94E4E] hover:border-[#E94E4E] transition-colors bg-white"
              onClick={handleResend}
              disabled={resendTimer > 0}
            >
              Resend OTP {resendTimer > 0 ? `(${resendTimer}s)` : ""}
            </button>
            <div className="text-red-500">{verifyStatus}</div>
          </div>
        ) : (
          <div className="text-gray-500">Sending OTP...</div>
        )}

        {verifyStatus === "Verified!" && (
          <div className="text-black space-y-4 mt-6">
            <div className="font-inter text-base text-[#555555]">
              Your test link:
            </div>
            <div className="bg-[#f9f9f9] border px-4 py-2 rounded font-mono break-all overflow-x-auto">
              {testLink}
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                className="border border-black text-black rounded-[6px] px-4 py-2 font-inter text-base hover:text-[#E94E4E] hover:border-[#E94E4E] transition-colors bg-white"
                onClick={() => navigator.clipboard.writeText(testLink)}
              >
                Copy Link
              </button>
              <button
                className="border border-black text-black rounded-[6px] px-4 py-2 font-inter text-base hover:text-[#E94E4E] hover:border-[#E94E4E] transition-colors bg-white"
                onClick={handleResend}
                disabled={resendTimer > 0}
              >
                Resend Invite {resendTimer > 0 ? `(${resendTimer}s)` : ""}
              </button>
              <button
                className="w-full h-12 bg-black text-white rounded-[6px] font-inter text-base hover:bg-[#E94E4E] transition-colors"
                onClick={() =>
                  router.push(`/test?inviteId=${inviteId}&userId=${user1}`)
                }
              >
                Start Questionnaire
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default FormStart;
