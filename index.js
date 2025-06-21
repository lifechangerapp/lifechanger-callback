const express = require('express');
const app = express();
app.use(express.json());

// Health check or default GET route
app.get('/reward-callback', (req, res) => {
  res.status(200).send('Life Changer Callback Server is running');
});

// Callback endpoint for Ayet Studios
app.post('/reward-callback', (req, res) => {
  try {
    const apiKey = req.headers['x-api-key'] || process.env.AYET_API_KEY; // Ayet API Key चेक
    if (!apiKey || apiKey !== process.env.AYET_API_KEY) {
      console.log('Unauthorized access attempt:', req.ip);
      return res.status(403).send('Unauthorized');
    }
    console.log('Ayet Studios Callback:', req.body);
    // रिवॉर्ड लॉजिक: My Wallet अपडेट
    const rewardData = req.body.reward || 0; // उदाहरण: रिवॉर्ड डेटा निकालें
    updateWallet(rewardData); // प्लेसहोल्डर फंक्शन, इसे कस्टमाइज़ करें
    res.status(200).send('OK');
  } catch (error) {
    console.error('Error processing callback:', error.message, 'from IP:', req.ip);
    res.status(500).send('Internal Server Error');
  }
});

// प्लेसहोल्डर फंक्शन: रिवॉर्ड को वॉलेट में अपडेट करने के लिए
function updateWallet(reward) {
  // TODO: यहाँ डेटाबेस या API कॉल जोड़ें, उदाहरण:
  // const wallet = /* डेटाबेस से वॉलेट डेटा */;
  // wallet.balance += reward;
  // /* डेटाबेस में सेव करें */;
  console.log(`Wallet updated with reward: ${reward}`);
}

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));