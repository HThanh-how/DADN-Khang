import React, { useEffect } from 'react';
import useSpeechToText from 'react-hook-speech-to-text';
import { BsFillMicFill } from "react-icons/bs";

export default function VoiceRecognition( {setQuery} ) {
  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
    speechRecognitionProperties: {
        lang: 'vi-VN',
        interimResults: true,
    }
  });
  useEffect(() => {
    fetch(`/send_voice?value=${results}`)
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.log(err))
  },[results])
  if (error) return <p>Web Speech API is not available in this browser 🤷‍</p>;

  return (
    <div>
      <button
      className="rounded-full bg-white border border-red-500 p-1 hover:scale-90 transition"
      onClick={isRecording ? stopSpeechToText : startSpeechToText}
    >
      <BsFillMicFill
        className={`${isRecording ? " text-red-500" : "text-slate-900"} 
        rounded-full w-6 h-6
        `}
      />
      {/* {isRecording ? "Stop Recording" : "Start Recording"} */}
    </button>
      <ul>
        {results.map((result) => (
          <li key={result.timestamp}>{result.transcript}</li>
        ))}
        {interimResult && <li>{interimResult}</li>}
      </ul>
    </div>
  );
}