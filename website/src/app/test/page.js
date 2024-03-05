"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = 'e43b97599d4cf52f55293efc75563d9552f073f7022fad43f35e3c6a22f0e680';
const IV_LENGTH = 16;

const TestPage = () => {
  const [dataToSend, setDataToSend] = useState('');
  const [responseMessage, setResponseMessage] = useState('');

  const handleSendData = async () => {
    try {
      // Encrypt the data before sending it to the server
      const encryptedData = encrypt(dataToSend);
      const decryptData = decrypt(encryptedData);
      console.log("Encrypted data: ", encryptedData)
      console.log("Decrypted data: ", decryptData)

      // Send the encrypted data to the server
      const response = await axios.post('http://localhost:3001/api', {
        encryptedData,
      });

      // Decrypt the response from the server
      const decryptedResponse = decrypt(response.data.encryptedResponseData);

      // Process the decrypted response as needed
      console.log('Decrypted Response Data:', decryptedResponse);

      // Set the response message
      setResponseMessage(decryptedResponse.message);
    } catch (error) {
      console.error('Error sending data:', error);
    }
  };

  // Utility function to encrypt data
  const encrypt = (text) => {
    const iv = CryptoJS.lib.WordArray.random(IV_LENGTH);
    const cipherText = CryptoJS.AES.encrypt(text, CryptoJS.enc.Hex.parse(ENCRYPTION_KEY), {
      iv,
    }).toString();

    return `${iv.toString()}:${cipherText}`;
  };

  // Utility function to decrypt data
  const decrypt = (text) => {
    const [ivHex, cipherText] = text.split(':');
    const iv = CryptoJS.enc.Hex.parse(ivHex);
    const decryptedBytes = CryptoJS.AES.decrypt(cipherText, CryptoJS.enc.Hex.parse(ENCRYPTION_KEY), {
      iv,
    });
    // const decryptedBytes = CryptoJS.AES.decrypt(ciphertext, ENCRYPTION_KEY, { iv });
    return decryptedBytes.toString(CryptoJS.enc.Utf8);
  };

  return (
    <div>
      <label>Data to Send:</label>
      <input
        type="text"
        value={dataToSend}
        onChange={(e) => setDataToSend(e.target.value)}
      />
      <button onClick={handleSendData}>Send Encrypted Data</button>

      <div>
        <label>Server Response:</label>
        <div>{responseMessage}</div>
      </div>
    </div>
  );
};

export default TestPage;
