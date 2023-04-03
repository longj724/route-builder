import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
const firebase = admin.initializeApp();

export const deletePhotos = functions.firestore
  .document('routes/{routeId}')
  .onDelete(async (snap, _) => {
    const { imagePath } = snap.data();
    const bucket = firebase.storage().bucket();

    await bucket.file(imagePath).delete();

    return { message: 'File deleted successfully' };
  });
