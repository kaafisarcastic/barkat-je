"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

function AnalysisPage() {
  const [inviteId, setInviteId] = useState("");
  const [loading, setLoading] = useState(false);
  const [geminiOutput, setGeminiOutput] = useState("");

  const searchParams = useSearchParams();

  useEffect(() => {
    const paramInviteId = searchParams.get("inviteid"); // note: lowercase 'inviteid'
    if (paramInviteId) {
      setInviteId(paramInviteId);
    }
  }, [searchParams]);

  const handleAnalyze = async () => {
    if (!inviteId) return;

    setLoading(true);
    setGeminiOutput("");

    try {
      const userRes = await fetch(`/api/responseuser?inviteId=${inviteId}`);
      const { users } = await userRes.json();

      let allText = "";

      for (const userId of users) {
        const responseRes = await fetch(`/api/response?userId=${userId}`);
        const data = await responseRes.json();

        if (data.responses) {
          data.responses.forEach((resp) => {
            allText += `Q${resp.question_number}: ${resp.answer}\n`;
          });
        }
      }

      const prompt = `Ananalyse questions  and their answers and give me summary on these:

      1. Overall summary of compatibility with my partners response
      2.Strengths 
      3.Top 5 Risks to Discuss based on our answers 
      4. Suggest some conversation starter
      5. Discuss some points over coffee


${allText}`;

      const geminiRes = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: prompt }),
      });

      const geminiData = await geminiRes.json();
      const finalText =
        geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

      setGeminiOutput(finalText);
    } catch (err) {
      console.error(err);
      setGeminiOutput("Error fetching or processing data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-[#ffffff] rounded-2xl w-full py-16">
      <div className="max-w-2xl text-center mx-auto px-6 py-8 bg-white rounded-2xl shadow">
        <h1 className="text-[#555555] font-inter text-2xl font-bold mb-6">
          Analyze Compatibility Report
        </h1>
        <div className="space-y-4">
          <div>
            <label className="block text-label text-[#999999] text-sm mb-1 text-left font-inter">
              Invite ID
            </label>
            <input
              type="text"
              placeholder="Enter Invite ID"
              value={inviteId}
              onChange={(e) => setInviteId(e.target.value)}
              className="w-full px-4 text-black py-2 border border-[#ededed] rounded-[6px] font-inter text-base bg-[#f9f9f9] focus:outline-none"
            />
          </div>
          <button
            onClick={handleAnalyze}
            className="w-full h-12 bg-black text-white rounded-[6px] font-inter  text-base transition-colors duration-200 hover:bg-[#E94E4E]"
          >
            {loading ? "Analyzing..." : "Generate Report"}
          </button>
          {geminiOutput && (
            <div className="whitespace-pre-wrap text-left bg-[#f9f9f9] p-4 border border-[#ededed] rounded-[6px] font-inter text-base text-black">
              {geminiOutput}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default AnalysisPage;
