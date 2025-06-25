const express = require('express');
const app = express();
const admin = require('firebase-admin');
const fs = require('fs');

app.use(express.json());

// Firebase इनीशियलाइज़ेशन (Secret File से)
const serviceAccountPath = '/etc/secrets/firebase-service-account.json'; // Secret File का पाथ
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();
const auth = admin.auth();

app.get('/reward-callback', (req, res) => {
  res.status(200).send('Life Changer Callback Server is running');
});

// Callback endpoint for BitLabs
app.post('/reward-callback', async (req, res) => {
  try {
    console.log('BitLabs Callback Received:', req.body);
    const userId = req.body.user_id || req.query.user_id || 'default_user'; // BitLabs से userId
    const rewardData = req.body.amount || req.body.reward || 0; // BitLabs का रिवॉर्ड डेटा
    let email = req.body.email || 'user@example.com'; // BitLabs से ईमेल, डिफ़ॉल्ट अगर नहीं मिले

    // Firebase Auth से यूजर डेटा चेक (अगर userId वैध है)
    try {
      const userRecord = await auth.getUser(userId);
      email = userRecord.email || email; // अगर Firebase में ईमेल मिले तो उसे प्राथमिकता
    } catch (authError) {
      console.log('No user found in Firebase Auth for UID:', userId);
    }

    if (rewardData > 0) {
      await updateWallet(userId, rewardData, email);
    }
    res.status(200).send('OK');
  } catch (error) {
    console.error('Error processing callback:', error.message, 'from IP:', req.ip);
    res.status(500).send('Internal Server Error');
  }
});

// रिवॉर्ड को Firestore में अपडेट करने के लिए
async function updateWallet(userId, reward, email) {
  try {
    const calendar = new Date();
    const day = calendar.getDate();
    const month = calendar.getMonth() + 1; // 0-based
    const year = calendar.getFullYear();

    // यूजर डेटा अपडेट
    await db.collection('Points_Information').doc(userId).set({
      email: email,
      uid: userId
    }, { merge: true });

    // डेटवाइज, मंथवाइज, ईयरवाइज सबकलेक्शंस में पॉइंट्स जोड़ें
    await db.collection('Points_Information').doc(userId)
      .collection('DailyPoints').doc(String(day)).set({
        points: reward,
        transactionId: 'N/A'
      }, { merge: true });

    await db.collection('Points_Information').doc(userId)
      .collection('MonthlyPoints').doc(String(month)).set({
        points: reward,
        transactionId: 'N/A'
      }, { merge: true });

    await db.collection('Points_Information').doc(userId)
      .collection('YearlyPoints').doc(String(year)).set({
        points: reward,
        transactionId: 'N/A'
      }, { merge: true });

    console.log(`Wallet updated with reward: ${reward} for user: ${userId} with email: ${email}`);
  } catch (error) {
    console.error('Error updating wallet:', error.message);
  }
}

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
