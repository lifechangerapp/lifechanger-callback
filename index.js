const express = require('express');
const app = express();
app.use(express.json());

app.post('/reward-callback', (req, res) => {
  console.log('Ayet Studios Callback:', req.body);
  // यहाँ रिवॉर्ड लॉजिक जोड़ें (जैसे My Wallet अपडेट)
  res.status(200).send('OK');
});

app.listen(process.env.PORT || 10000, () => console.log('Server running'));