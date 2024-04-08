import React, { useState } from 'react';
import axios from 'axios';
import Webcam from 'react-webcam';
import './WebcamCapture.css'; 

const WebcamCapture = () => {
  const webcamRef = React.useRef(null);
  const videoConstraints = {
    width: 650,
    height: 400,
    facingMode: 'user'
  };
  const [name, setName] = useState('');
  const [webcamActive, setWebcamActive] = useState(false);

//   const capture = React.useCallback(() => {
//     const imageSrc = webcamRef.current.getScreenshot();
//     console.log(`imageSrc = ${imageSrc}`);
//     axios.post('http://127.0.0.1:5000/api', { data: imageSrc })
//       .then(res => {
//         console.log(`response = ${res.data}`);
//         setName(res.data);
//       })
//       .catch(error => {
//         console.log(`error = ${error}`);
//       });
//   }, [webcamRef]);

  const activateWebcam = () => {
    setWebcamActive(true);
  };

  const deactivateWebcam = () => {
    setWebcamActive(false);
  };

  return (
    <div>
      <h4>Camera</h4>
      {webcamActive && (
        <Webcam
          audio={false}
          height={400}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width={650}
          videoConstraints={videoConstraints}
        />
      )}
      <button className={webcamActive ? 'deactivate-btn' : 'activate-btn'} onClick={webcamActive ? deactivateWebcam : activateWebcam}>
        {webcamActive ? 'Deactivate Webcam Alarm' : 'Activate Webcam Alarm'}
      </button>
    </div>
  );
};

export default WebcamCapture;
