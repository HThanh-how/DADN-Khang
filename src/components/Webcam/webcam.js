import React, { useState } from 'react';
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
  const videoConstraints = {
    width: 650,
    height: 400,
    facingMode: 'user'
  };
  const [name, setName] = useState('');
  const [webcamActive, setWebcamActive] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);

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
    console.log(`imageSrc = ${imageSrc}`);
    // Send the captured image data to the backend
    axios.post('http://127.0.0.1:5000/save_image', { image: imageSrc })
      .then(res => {
        console.log('Image saved successfully:', res.data);
        // Handle any success logic here
      })
      .catch(error => {
        console.error('Error saving image:', error);
        // Handle error
      });
    closeModal();
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
        {webcamActive ? 'Deactivate Camera Alarm' : 'Activate Camera Alarm'}
      </button>
      <button className="capture-btn" onClick={openModal}>Add Authenticate User</button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles} // Apply custom styles to the modal
        contentLabel="Capture Image Modal"
      >
        <h2 style={{ textAlign: 'center' }}>Capture Your Face Image</h2>
        <Webcam
          audio={false}
          height={400}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width={650}
          videoConstraints={videoConstraints}
        />
        <div className="button-container">
          <button className="capture-btn" onClick={captureAndSaveImage}>Submit</button>
          <button className="close-btn" onClick={closeModal}>Close</button>
        </div>
      </Modal>
    </div>
  );
};

export default WebcamCapture;

