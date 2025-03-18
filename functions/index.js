const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.updatePrices = functions.pubsub.schedule('every 10 minutes').onRun(async (context) => {
  const packagesSnapshot = await admin.firestore().collection('packages').get();
  packagesSnapshot.forEach(doc => {
    const data = doc.data();
    const min = data.minPrice || 0;
    const max = data.maxPrice || 0;
    if (min && max && max > min) {
      const newPrice = Math.floor(Math.random() * (max - min + 1)) + min;
      doc.ref.update({ price: newPrice });
    }
  });
  console.log('Prices updated');
  return null;
});