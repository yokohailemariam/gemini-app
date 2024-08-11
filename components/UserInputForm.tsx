"use client";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { FormEvent, useState } from "react";
import ReactMarkdown from "react-markdown";

interface IResponse {
  response: string;
  userInput: string;
}

interface UserInputProps {
  apiKey: string;
}
export const UserInput = ({ apiKey }: UserInputProps) => {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const [userInput, setUserInput] = useState("");
  const [response, setResponse] = useState<IResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setUserInput("");
    setLoading(true);

    try {
      const res = await model.generateContent(userInput);

      setResponse((pre) => [
        ...pre,
        {
          response:
            res.response.candidates?.[0]?.content.parts?.[0]?.text || "",
          userInput,
        },
      ]);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setResponse((pre) => [...pre, { response: "Error", userInput }]);
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto relative h-screen">
      <div className="overflow-y-scroll h-[90%] ">
        {response.length === 0 ? (
          <p className="flex h-screen items-center justify-center">
            Your response will be shown here
          </p>
        ) : (
          <div className="py-2">
            {response.map((res, index) => {
              return (
                <div key={index} className="space-y-2">
                  <div className="p-2 rounded-sm bg-slate-900">
                    <p>{res.userInput}</p>
                  </div>
                  <div className="text-justify p-2 px-4 ">
                    <ReactMarkdown className="space-y-3">
                      {res.response}
                    </ReactMarkdown>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <form
        onSubmit={handleSubmit}
        className="absolute bottom-0  flex gap-4 w-full my-3"
      >
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className="bg-slate-950 border w-full rounded-full  px-2 py-3 placeholder:text-white"
          placeholder="Enter prompt here"
        />
        <button
          type="submit"
          className="rounded-full border px-4 hover:bg-slate-900"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </form>{" "}
    </div>
  );
};
