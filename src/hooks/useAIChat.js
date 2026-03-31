import { useEffect, useRef, useState } from "react";

export function useAIChat(profile, user, logs, program) {

//sets username fallback if profile name is missing
const userName = profile?.name || user?.email?.split("@")[0] || "Athlete";

//stores chat messages between user and ai coach
const [aiChat, setAiChat] = useState([
    {
      role: "bot",
      text: `Hey ${userName} 👋 I'm your Apastron Coach. Here to help you level up your training. What would you like to do today?`
    }
  ]);

//stores current input field value
const [chatInput, setChatInput] = useState("");

//tracks loading state during ai response
const [isAiLoading, setIsAiLoading] = useState(false);

//reference for auto-scrolling chat
const chatEndRef = useRef(null);

//resets chat when profile changes
useEffect(() => {
  if (profile) {
    const userName = profile?.name || "Athlete";
    setAiChat([
      {
        role: "bot",
        text: `Hey ${userName} 👋 I'm your Apastron Coach. Here to help you level up your training. What would you like to do today?`
      }
    ]);
  }
}, [profile?.name]);

//auto scrolls to latest message
useEffect(() => {
  chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
}, [aiChat]);

//normalizes logs into an array format
const normalizeLogs = () => {
  if (!logs) return [];
  if (Array.isArray(logs)) return logs;
  if (typeof logs === "object") return Object.values(logs);
  return [];
};

//summarizes recent workouts for ai context
const summarizeWorkouts = () => {
  const logArray = normalizeLogs();
  const recentLogs = logArray.slice(-5);

  if (!recentLogs.length) return "No workouts logged yet.";

  return recentLogs
    .map((l) => {
      const exercise = l?.exercise || "Unknown exercise";
      const weight = l?.weight ?? "?";
      const sets = l?.sets ?? "?";
      const reps = l?.reps ?? "?";

      return `${exercise}: ${weight}kg ${sets} sets x ${reps} reps`;
    })
    .join("\n");
};

//summarizes current program structure
const summarizeProgram = () => {
  if (!program) return "No active program.";

  const schedule = program?.weeklySchedule || [];
  if (!schedule.length) return "Program exists but schedule is empty.";

  return schedule
    .map((day) => {
      const exercises =
        day?.exercises?.map((e) => e.name).join(", ") || "No exercises";

      return `${day.day}: ${exercises}`;
    })
    .join("\n");
};

//builds full coaching context sent to ai
const buildContext = () => {
  const workoutSummary = summarizeWorkouts();
  const programSummary = summarizeProgram();

  return `
You are the Apastron AI Strength Coach.

Your job is to guide athletes in:
- strength training
- hypertrophy
- progressive overload
- workout recovery
- injury prevention
- fitness programming

Athlete profile:
Name: ${profile?.name || "Athlete"}
Age: ${profile?.age || "Unknown"}
Weight: ${profile?.weight || "Unknown"} kg
Height: ${profile?.height || "Unknown"} cm
Gender: ${profile?.gender || "Unknown"}

Current Training Program:
${programSummary}

Recent Workouts:
${workoutSummary}

Coaching Rules:
- Give short, actionable advice
- Encourage progressive overload
- Adjust advice based on recent workouts
- If athlete seems stuck, suggest program adjustments
- If athlete asks about exercises, explain correct technique
- Never give dangerous or reckless advice, do not leave room for ambiguity 
- In case of form, diet and other sensitive matters, be as descriptive as possible
- Use bullet points for steps
- Speak like a professional strength coach
`;
};

//handles sending message to ai coach
const talkToCoach = async (text) => {
  if (!text.trim()) return;

  const userMessage = { role: "user", text };

  //adds user message to chat
  setAiChat((prev) => [...prev, userMessage]);

  setIsAiLoading(true);
  setChatInput("");


  try {
    const context = buildContext();

    //formats recent chat history for backend
    const history = aiChat
      .slice(-4)
      .filter((m) => m.text && typeof m.text === "string")
      .map((m) => ({
        role: m.role, 
        text: m.text.slice(0, 500), // limit size
      }));

    //sends request to backend ai api
    const response = await fetch("/api/ai", {
      method: "POST",
      headers: {
    "Content-Type": "application/json",
  },
      body: JSON.stringify({
        message: text,
        context,
        history,
      }),
    });

    const data = await response.json();

    //handles api-level errors
    if (!response.ok) {
      throw new Error(data?.error || "AI failed");
    }

    //fallback response if ai output is empty
    const reply =
      data?.text && data.text.trim().length > 0
        ? data.text
        : `I might not have that exactly right, but here’s what I recommend:

• Keep your wrists neutral during pushups  
• Try pushups on dumbbells or fists to reduce strain  
• Warm up your wrists before training  
• If discomfort continues, reduce load temporarily`;

    //adds ai response to chat
    setAiChat((prev) => [...prev, { role: "bot", text: reply }]);

  } catch (err) {
    console.error("AI Coach error:", err);

    //default error message
    let message = "Connection issue. Try again.";
    //specific failure case for ai service
    if (err.message.includes("failed")) {
      message = "AI service is currently unavailable.";
    }

    //adds error message to chat
    setAiChat((prev) => [
      ...prev,
      {
        role: "bot",
        text: message,
      },
    ]);

  } finally {
    //resets loading state after request completes
    setIsAiLoading(false);
  }
};

//exposes chat state and functions to components
return {
  aiChat,
  chatInput,
  setChatInput,
  isAiLoading,
  talkToCoach,
  chatEndRef
};
}