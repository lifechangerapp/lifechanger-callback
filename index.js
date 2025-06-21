const express = require('express');
const app = express();
app.use(express.json());

// Callback endpoint for Ayet Studios
app.post('/reward-callback', (req, res) => {
  try {
    console.log('Ayet Studios Callback:', req.body);
    // रिवॉर्ड लॉजिक जोड़ें: उदाहरण - My Wallet अपडेट करने के लिए डेटाबेस या API कॉल
    // Placeholder: const reward = req.body.reward; // रिवॉर्ड डेटा निकालें
    // Placeholder: updateWallet(reward); // कस्टम फंक्शन जोड़ें
    res.status(200).send('OK');
  } catch (error) {
    console.error('Error processing callback:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Start server with environment port or default
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));