const express = require('express');
const app = express();
app.use(express.json());

// Health check
app.get('/reward-callback', (req, res) => {
  res.status(200).send('Life Changer Callback Server is running');
});

// BitLabs Callback endpoint
app.post('/reward-callback', (req, res) => {
  try {
    console.log('BitLabs Callback Received:', req.body);
    const rewardData = req.body.amount || req.body.reward || 0; // BitLabs का डेटा फॉर्मेट चेक करें
    if (rewardData > 0) {
      updateWallet(rewardData); // वॉलेट अपडेट
    }
    res.status(200).send('OK'); // BitLabs को सफलता का जवाब
  } catch (error) {
    console.error('Error processing callback:', error.message, 'from IP:', req.ip);
    res.status(500).send('Internal Server Error');
  }
});

function updateWallet(reward) {
  // TODO: यहाँ डेटाबेस या वॉलेट अपडेट करें
  console.log(`Wallet updated with reward: ${reward}`);
}

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
