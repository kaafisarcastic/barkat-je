"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Question {
  id: number;
  text: string;
  options: string[];
  type: "multiple_choice" | "text" | "rating";
}

interface QuestionnaireProps {
  inviteId: string;
  testToken: string;
}

function Questionnaire({ inviteId, testToken }: QuestionnaireProps) {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<{ [key: number]: string }>({});
  const [userInfo, setUserInfo] = useState<{
    name: string;
    email: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [completed, setCompleted] = useState(false);

  // Initialize questionnaire and get user info
  useEffect(() => {
    if (!inviteId || !testToken) {
      console.log("Waiting for inviteId or testToken");
      return;
    }

    initializeQuestionnaire();
    fetchQuestions();
  }, [inviteId, testToken]);
  const fetchQuestions = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/questions");
      const data = await res.json();

      if (data.success) {
        setQuestions(data.questions);
      } else {
        setError("Failed to load questions");
      }
    } catch (err) {
      setError("Failed to load questions");
    }
  };

  const initializeQuestionnaire = async () => {
    try {
      const res = await fetch(`/api/questionnaire/initialize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviteId, testToken }),
      });

      const data = await res.json();

      if (data.success) {
        setUserInfo(data.userInfo);
        // Check if user has already completed the questionnaire
        if (data.alreadyCompleted) {
          setCompleted(true);
        }
      } else {
        setError(data.message || "Invalid link or expired");
      }
    } catch (err) {
      setError("Failed to load questionnaire");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (value: string) => {
    setResponses({
      ...responses,
      [questions[currentQuestion].id]: value,
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/questionnaire/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inviteId,
          testToken,
          responses: Object.entries(responses).map(([questionId, answer]) => ({
            questionNumber: parseInt(questionId),
            answer,
            selectedOption:
              questions.find((q) => q.id === parseInt(questionId))?.type ===
              "multiple_choice"
                ? answer
                : null,
          })),
        }),
      });

      const data = await res.json();

      if (data.success) {
        setCompleted(true);
      } else {
        setError(data.message || "Failed to submit responses");
      }
    } catch (err) {
      setError("Failed to submit responses");
    } finally {
      setSubmitting(false);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentQuestionData = questions[currentQuestion];
  const currentAnswer = responses[currentQuestionData?.id] || "";

  if (loading || questions.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading questionnaire...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-2 bg-white text-black rounded-lg hover:bg-gray-200"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-green-400 text-6xl mb-6">✓</div>
          <h2 className="text-3xl font-bold mb-4">Thank You!</h2>
          <p className="text-gray-300 mb-6">
            Your responses have been submitted successfully.
            {userInfo && ` Thank you, ${userInfo.name}!`}
          </p>
          <p className="text-sm text-gray-400">
            You can now close this window. Your partner will receive their own
            link to complete the questionnaire.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Relationship Questionnaire</h1>
            {userInfo && (
              <span className="text-sm text-gray-400">
                Welcome, {userInfo.name}
              </span>
            )}
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-400 mt-2">
            Question {currentQuestion + 1} of {questions.length}
          </p>
        </div>

        {/* Question */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-6">
            {currentQuestionData.text}
          </h2>

          {/* Multiple Choice Questions */}
          {currentQuestionData.type === "multiple_choice" && (
            <div className="space-y-3">
              {currentQuestionData.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerChange(option)}
                  className={`w-full text-left p-4 rounded-lg border transition-all ${
                    currentAnswer === option
                      ? "border-white bg-white text-black"
                      : "border-gray-600 bg-gray-900 hover:border-gray-400"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {/* Rating Questions */}
          {currentQuestionData.type === "rating" && (
            <div className="flex flex-wrap gap-3 justify-center">
              {currentQuestionData.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerChange(option)}
                  className={`w-12 h-12 rounded-full border-2 transition-all ${
                    currentAnswer === option
                      ? "border-white bg-white text-black"
                      : "border-gray-600 bg-gray-900 hover:border-gray-400"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {/* Text Questions */}
          {currentQuestionData.type === "text" && (
            <textarea
              value={currentAnswer}
              onChange={(e) => handleAnswerChange(e.target.value)}
              placeholder="Type your answer here..."
              className="w-full p-4 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white resize-none"
              rows={4}
            />
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className={`px-6 py-2 rounded-lg ${
              currentQuestion === 0
                ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                : "bg-gray-700 text-white hover:bg-gray-600"
            }`}
          >
            Previous
          </button>

          {currentQuestion === questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={!currentAnswer || submitting}
              className={`px-6 py-2 rounded-lg ${
                !currentAnswer || submitting
                  ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                  : "bg-white text-black hover:bg-gray-200"
              }`}
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!currentAnswer}
              className={`px-6 py-2 rounded-lg ${
                !currentAnswer
                  ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                  : "bg-white text-black hover:bg-gray-200"
              }`}
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Questionnaire;
