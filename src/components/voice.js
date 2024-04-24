import React, { useEffect } from 'react';
import useSpeechToText from 'react-hook-speech-to-text';
import { BsFillMicFill } from "react-icons/bs";
import { BsFillMicMuteFill } from "react-icons/bs";

export let isTurnOnLight = false;


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
  const lastResult = results[results.length - 1];
  console.log(lastResult);
  if (lastResult && (lastResult.transcript.includes('Bật đèn') || lastResult.transcript.includes('bật đèn'))) {
    isTurnOnLight= true;
    console.log("đã nhận được bật đèn");
    setQuery('bật đèn');
  }
  if (lastResult && (lastResult.transcript.includes('Tắt đèn') || lastResult.transcript.includes('tắt đèn') || lastResult.transcript.includes('Tắt Đèn'))) {
    isTurnOnLight = false;
    setQuery('tắt đèn');
  }
}, [results]);
// useEffect(() => {
//   fetch(`/send_voice?value=${results}`)
//     .then(res => res.json())
//     .then(data => {
//       // if (data.includes('bật đèn')) {
//       //   isTurnOnLight = true;
//       // }
//       console.table(data);
//     })
//     .catch(err => console.log(err))
// }, [results]);
  if (error) return <p>Web Speech API is not available in this browser 🤷‍</p>;
  


  return (
    <div>
      <button
      className="rounded-full bg-white border border-red-500 p-1 hover:scale-90 transition"
      onClick={isRecording ? stopSpeechToText : startSpeechToText}
    >
      {isRecording?<BsFillMicFill/>: <BsFillMicMuteFill />}
      
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