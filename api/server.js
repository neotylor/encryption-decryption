const express = require('express');
// const bodyParser = require('body-parser');
const cors = require("cors");
const CryptoJS = require('crypto-js');

const app = express();
const PORT = 3001;

// app.use(bodyParser.json());
app.use(cors());

app.use(express.urlencoded({ extended: true, limit: "1gb" }));
app.use(express.json({ limit: "1gb" }));


const ENCRYPTION_KEY = 'e43b97599d4cf52f55293efc75563d9552f073f7022fad43f35e3c6a22f0e680';
const IV_LENGTH = 16;

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


app.post('/api', (req, res) => {
  try {
    const encryptedRequestData = req.body.encryptedData;

    // Log received encrypted data
    console.log('Received Encrypted Data:', encryptedRequestData);
    // Decrypt the received data
    const decryptedRequestData = decrypt(encryptedRequestData);

    // Log decrypted data
    console.log('Decrypted Request Data:', decryptedRequestData);

    // Process the decrypted data as needed

    // Simulate some processing and create a response
    const responseData = { 
      message: 'Data processed successfully',
      received: decryptedRequestData, 
    };

    // Encrypt the response before sending it back
    const encryptedResponseData = encrypt(JSON.stringify(responseData));

    res.json({ encryptedResponseData });
  } catch (error) {
    console.error('Error handling request:', error);
    res.status(500).json({ success: false, message: error?.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
