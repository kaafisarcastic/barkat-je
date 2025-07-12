"use client";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function QuestionnairePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { inviteId, token } = useParams();
  const [invite, setinvite] = useState("");

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const inviteId = searchParams.get("inviteId");
    const userId = searchParams.get("userId");
    console.log("Invite ID:", inviteId);
    console.log("User ID:", userId);
    setinvite(inviteId);
  }, [searchParams]);

  useEffect(() => {
    const inviteId = searchParams.get("inviteId");

    const userId = searchParams.get("userId");

    console.log("Invite ID:", inviteId);
    console.log("User ID:", userId);

    if (inviteId && userId) {
      const saveUserInfo = async () => {
        try {
          const res = await fetch("/api/userid", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId, // assuming this is a number
            }),
          });

          const data = await res.json();

          if (!res.ok) {
            console.error("Failed to save user info:", data);
          } else {
            console.log("User info saved successfully");
          }
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

    if (questions[currentIndex].options?.length > 0) {
      if (!response.selected_option || !response.explanation) return false;
      const len = response.explanation.trim().length;
      if (len < 100 || len > 400) return false;
    } else {
      const len = response.explanation?.trim().length || 0;
      if (len < 100 || len > 400) return false;
    }

    return true;
  };

  const handleNext = () => {
    if (!validateResponse()) {
      alert("Please complete the response with 100-400 characters.");
      return;
    }
    if (currentIndex < questions.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const handleBack = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleSubmit = async () => {
    if (!validateResponse()) {
      alert("Please complete the response with 100-400 characters.");
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

  return (
    <section className="rounded-2xl bg-[#ffffff] w-full py-12">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-black font-sanserif text-5xl md:text-7xl leading-tight">
          Know Your Partner Before Marriage
        </h1>
        <p className="text-[#555555] font-sanserif text-base mt-4">
          Welcome to the compatibility test. Tool that helps couples explore
          core areas of their relationship before marriage.
        </p>

        <div className="mt-12 bg-white/20 backdrop-blur-md p-6 rounded-xl shadow border border-white/30">
          {/* Top Bar */}
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-600">
              Question {currentIndex + 1} of {questions.length}
            </span>
            <span className="text-sm bg-[#066006] text-white px-3 py-1 rounded-full">
              {progress}% Complete
            </span>
          </div>

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

          {/* Explanation */}
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
                Minimum 100 and maximum 400 characters
              </p>
            </div>
          )}

          {/* Text-only question */}
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

          {/* Navigation */}
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
