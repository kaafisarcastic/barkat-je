"use client";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function QuestionnairePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { inviteId, token } = useParams();
  const [invite, setInvite] = useState("");

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(true);

  const segments = [
    { title: "Family Expectations", range: [1, 5] },
    { title: "Finances", range: [6, 10] },
    { title: "Lifestyle", range: [11, 15] },
    { title: "Children & Parenting", range: [16, 20] },
    { title: "Religion & Culture", range: [21, 25] },
    { title: "Career", range: [26, 30] },
    { title: "Communication", range: [31, 35] },
    { title: "Health & Well-being", range: [36, 40] },
    { title: "Emergency Planning", range: [51, 55] },
    { title: "Future Planning", range: [56, 60] },
  ];

  useEffect(() => {
    const inviteId = searchParams.get("inviteId");
    const userId = searchParams.get("userId");
    setInvite(inviteId);
  }, [searchParams]);

  useEffect(() => {
    const inviteId = searchParams.get("inviteId");
    const userId = searchParams.get("userId");

    if (inviteId && userId) {
      const saveUserInfo = async () => {
        try {
          const res = await fetch("/api/userid", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId }),
          });

          const data = await res.json();
          if (!res.ok) console.error("Failed to save user info:", data);
          else console.log("User info saved successfully");
        } catch (error) {
          console.error("Error saving user info:", error);
        }
      };

      saveUserInfo();
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch("/api/questions");
        const data = await res.json();
        if (data.success) setQuestions(data.questions);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [inviteId, token]);

  const handleOptionChange = (questionId, value) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        selected_option: value,
      },
    }));
  };

  const handleExplanationChange = (questionId, value) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        explanation: value,
      },
    }));
  };

  const validateResponse = () => {
    const response = responses[questions[currentIndex].id];
    if (!response) return false;

    const hasOptions = questions[currentIndex].options?.length > 0;
    const explanationLength = response.explanation?.trim().length || 0;

    if (hasOptions) {
      return (
        response.selected_option &&
        explanationLength >= 20 &&
        explanationLength <= 100
      );
    } else {
      return explanationLength >= 100 && explanationLength <= 400;
    }
  };

  const handleNext = () => {
    if (!validateResponse()) {
      alert("Please complete the response with the required characters.");
      return;
    }
    if (currentIndex < questions.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const handleBack = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleSubmit = async () => {
    if (!validateResponse()) {
      alert("Please complete the response with the required characters.");
      return;
    }

    const formattedAnswers = Object.entries(responses).map(
      ([questionNumber, response]) => ({
        questionNumber: parseInt(questionNumber, 10),
        answer: response.explanation,
        selectedOption: response.selected_option || null,
      })
    );

    const inviteIdParam = searchParams.get("inviteId") || inviteId;
    const userId = searchParams.get("userId");

    const payload = {
      inviteId: inviteIdParam?.toString(),
      type: "invitee",
      userId: userId?.toString(),
      answers: formattedAnswers,
    };

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Responses submitted!");
        router.push(`/waiting-room?inviteid=${invite}`);
      } else {
        console.error("Submission failed:", data);
        alert("Failed to submit. Please try again.");
      }
    } catch (error) {
      console.error("Error during submission:", error);
      alert("An error occurred while submitting. Please try again.");
    }
  };

  if (loading) return <div className="text-center p-6">Loading...</div>;
  if (!questions[currentIndex]) return <div>No questions available.</div>;

  const currentQuestion = questions[currentIndex];
  const qResponse = responses[currentQuestion.id] || {};
  const hasOptions = currentQuestion.options?.length > 0;
  const progress = Math.round(((currentIndex + 1) / questions.length) * 100);

  const currentSegment =
    segments.find(
      (seg) =>
        currentQuestion.id >= seg.range[0] && currentQuestion.id <= seg.range[1]
    )?.title || "General";

  return (
    <section className="rounded-2xl bg-white w-full py-12">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-black font-sanserif text-5xl md:text-7xl leading-tight">
          Know Your Partner Before Marriage
        </h1>
        <p className="text-[#555555] font-sanserif text-base mt-4">
          A tool that helps couples explore core areas of their relationship
          before marriage.
        </p>

        {/* Stepper */}
        <div className="flex overflow-x-auto gap-4 mb-8 scrollbar-hide mt-8 pb-2">
          {segments.map((seg, index) => {
            const isActive =
              currentQuestion.id >= seg.range[0] &&
              currentQuestion.id <= seg.range[1];
            return (
              <div
                key={index}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium border transition 
                  ${
                    isActive
                      ? "bg-black text-white border-black"
                      : "bg-white text-gray-500 border-gray-300"
                  }`}
              >
                {seg.title}
              </div>
            );
          })}
        </div>

        {/* Question Card */}
        <div className="bg-white/20 backdrop-blur-md p-6 rounded-xl shadow border border-white/30">
          {/* Top Bar */}
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-600">
              Question {currentIndex + 1} of {questions.length}
            </span>
            <span className="text-sm bg-[#FDECEC] text-[#E94E4E] px-3 py-1 rounded-full">
              {progress}% Complete
            </span>
          </div>

          <p className="text-gray-500 text-sm mb-2 font-medium">
            Segment: {currentSegment}
          </p>

          {/* Question */}
          <h2 className="text-xl font-semibold mb-4 text-black">
            {currentQuestion.question_text}
          </h2>

          {/* MCQ */}
          {hasOptions && (
            <div className="space-y-2 mb-4">
              {currentQuestion.options.map((opt, idx) => (
                <label key={idx} className="flex items-center gap-2 text-black">
                  <input
                    type="radio"
                    name={`q-${currentQuestion.id}`}
                    value={opt}
                    checked={qResponse.selected_option === opt}
                    onChange={() => handleOptionChange(currentQuestion.id, opt)}
                  />
                  {opt}
                </label>
              ))}
            </div>
          )}

          {/* Explanation for MCQ */}
          {hasOptions && qResponse.selected_option && (
            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-1">
                Please elaborate on why you chose this:
              </label>
              <textarea
                className="w-full border rounded px-3 py-2 text-black bg-[#f9f9f9]"
                rows={4}
                value={qResponse.explanation || ""}
                onChange={(e) =>
                  handleExplanationChange(currentQuestion.id, e.target.value)
                }
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Minimum 20 and Maximum 100 characters
              </p>
            </div>
          )}

          {/* Open-ended */}
          {!hasOptions && (
            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-1">
                Your Answer:
              </label>
              <textarea
                className="w-full border rounded px-3 py-2 text-black bg-[#f9f9f9]"
                rows={5}
                value={qResponse.explanation || ""}
                onChange={(e) =>
                  handleExplanationChange(currentQuestion.id, e.target.value)
                }
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Minimum 100 and maximum 400 characters
              </p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4">
            <button
              onClick={handleBack}
              disabled={currentIndex === 0}
              className="px-6 py-3 bg-white/20 backdrop-blur-md text-black rounded-md shadow border border-white/30 hover:bg-[#e94e4e] transition"
            >
              Back
            </button>
            {currentIndex < questions.length - 1 ? (
              <button
                onClick={handleNext}
                className="px-6 py-3 bg-black text-white rounded-md shadow hover:bg-[#e94e4e] transition"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-6 py-3 bg-black text-white rounded-md shadow hover:bg-[#e94e4e] transition"
              >
                Submit
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
