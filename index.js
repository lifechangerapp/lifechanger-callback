const express = require('express');
const app = express();
app.use(express.json());

app.post('/reward-callback', (req, res) => {
  try {
    const apiKey = req.headers['x-api-key'] || process.env.AYET_API_KEY; // Ayet API Key चेक
    if (!apiKey || apiKey !== process.env.AYET_API_KEY) {
      return res.status(403).send('Unauthorized');
    }
    console.log('Ayet Studios Callback:', req.body);
    // रिवॉर्ड लॉजिक: My Wallet अपडेट
    res.status(200).send('OK');
  } catch (error) {
    console.error('Error processing callback:', error);
    res.status(500).send('Internal Server Error');
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));