// import * as functions from 'firebase-functions';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp(functions.config().firebase);

export const subscribeToTopic = functions.https.onCall(
    async (data, context) => {
        await admin.messaging().subscribeToTopic(data.token, data.topic);

        return `subscribed to ${data.topic}`;
    }
);

export const unsubscribeFromTopic = functions.https.onCall(
    async (data, context) => {
        await admin.messaging().unsubscribeFromTopic(data.token, data.topic);

        return `unsubscribed from ${data.topic}`;
    }
);

export const sendOnFirestoreCreate = functions.firestore
    .document('prediction/{predictionId}')
    .onCreate(async snapshot => {
        const prediction = snapshot.data();
        if (prediction != null) {
            const notification: admin.messaging.Notification = {
                title: 'New Prediction Available!',
                body: prediction.headline
            };
            const payload: admin.messaging.Message = {
                notification,
                topic: 'prediction'
            };
            return admin.messaging().send(payload);
        }
        return
    });