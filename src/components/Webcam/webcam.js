import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Webcam from 'react-webcam';
import Modal from 'react-modal';
import './WebcamCapture.css';

// Style for the modal popup
const customStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black overlay
  },
  content: {
    top: '50%', // Center vertically
    left: '50%', // Center horizontally
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    padding: '20px', // Add padding for better appearance
  },
};

const WebcamCapture = () => {
  const webcamRef = React.useRef(null);
  const canvasRef = React.useRef(null); // Reference to the canvas
  const videoConstraints = {
    width: 650,
    height: 400,
  };
  const [name, setName] = useState('');
  const [webcamActive, setWebcamActive] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const sendFrameAndReceiveBbox = async () => {
      if (!webcamActive || !webcamRef.current) return;

      const imageSrc = webcamRef.current.getScreenshot();

      try {
        const response = await axios.post('http://127.0.0.1:5000/process_frame', {
          frame: imageSrc
        });

        const bboxData = response.data.bbox;
        drawBoundingBox(bboxData); // Draw bounding box
        
      } catch (error) {
        console.error('Error processing frame:', error);
      }
    };

    const streamInterval = setInterval(sendFrameAndReceiveBbox, 1000);

    return () => {
      clearInterval(streamInterval);
      isMounted = false;
    };
  }, [webcamActive]);

  const drawBoundingBox = (bboxData) => {
    if (!bboxData || !canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');

    if (!ctx) return;

    // Clear previous drawings
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Draw bounding box if bboxData is valid
    if (Array.isArray(bboxData) && bboxData.length === 4) {
      console.log(bboxData)
      ctx.strokeStyle = 'green';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.rect(bboxData[0]*ctx.canvas.width, bboxData[1]*ctx.canvas.height, bboxData[2]*ctx.canvas.width, bboxData[3]*ctx.canvas.height);
      // ctx.rect(300, 100, 10, 10);
      ctx.stroke();
    }
  };

  const activateWebcam = () => {
    setWebcamActive(true);
  };

  const deactivateWebcam = () => {
    setWebcamActive(false);
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const captureAndSaveImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();

    axios.post('http://127.0.0.1:5000/save_image', { 
      image: imageSrc,
      name: name
    })
    .then(res => {
      console.log('Image saved successfully:', res.data);
    })
    .catch(error => {
      console.error('Error saving image:', error);
    });

    closeModal();
  };

  return (
    <div>
      <h4>Camera</h4>
      {webcamActive && (
        <div style={{ position: 'relative', width: videoConstraints.width + 'px', height: videoConstraints.height + 'px', marginBottom: '20px' }}>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%'
            }}
          />
          <canvas
            ref={canvasRef}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none' // Make the canvas non-interactive
            }}
          />
        </div>
      )}
      <button className={webcamActive ? 'deactivate-btn' : 'activate-btn'} onClick={webcamActive ? deactivateWebcam : activateWebcam}>
        {webcamActive ? 'Deactivate Camera Alarm' : 'Activate Camera Alarm'}
      </button>
      <button className="capture-btn" onClick={openModal}>Add Authenticate User</button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Capture Image Modal"
      >
        <h2 style={{ textAlign: 'center' }}>Capture Your Face Image</h2>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ marginBottom: '10px' }}
        />
        <Webcam
          audio={false}
          height={400}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width={650}
          videoConstraints={videoConstraints}
        />
        <canvas ref={canvasRef} style={{ display: 'none' }} /> {/* Hidden canvas */}
        <div className="button-container">
          <button className="capture-btn" onClick={captureAndSaveImage}>Submit</button>
          <button className="close-btn" onClick={closeModal}>Close</button>
        </div>
      </Modal>
    </div>
  );
};

export default WebcamCapture;
