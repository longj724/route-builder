// External Dependencies
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore/lite';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';

// Relative Dependencies
import { auth, db, storage } from '../Firebase';
import { RouteType } from '../Context/RouteProvider';

export const createOrUpdateRoute = async (
  name: string,
  route: RouteType,
  routeImageURL: string,
  routeId?: string
): Promise<string> => {
  if (!auth.currentUser) {
    return '';
  }

  const {
    distance,
    elevationGainAndLoss,
    elevationPoints,
    coordinates,
    selectedPoints,
  } = route;

  const formattedCoordinates = coordinates.map((coordinate) => {
    return {
      lng: coordinate[0],
      lat: coordinate[1],
    };
  });

  try {
    if (routeId) {
      const routeDoc = doc(db, `routes/${routeId}`);
      await updateDoc(routeDoc, {
        coordinates: formattedCoordinates,
        distance: distance,
        elevationData: elevationGainAndLoss,
        elevationPoints: elevationPoints,
        name: name,
        selectedPoints: selectedPoints,
        routeImage: routeImageURL,
      });

      return routeId;
    }

    const routeDoc = await addDoc(collection(db, 'routes'), {
      coordinates: formattedCoordinates,
      distance: distance,
      elevationData: elevationGainAndLoss,
      elevationPoints: elevationPoints,
      name: name,
      selectedPoints: selectedPoints,
      userID: auth.currentUser.uid,
      imageURL: routeImageURL,
    });

    return routeDoc.id;
  } catch (err) {
    throw err;
  }
};

export const getAllRoutes = async (): Promise<DocumentData[]> => {
  if (!auth.currentUser) {
    return [];
  }

  console.log('reading routes from database');

  const q = query(
    collection(db, 'routes'),
    where('userID', '==', auth.currentUser.uid)
  );
  const querySnapshot = await getDocs(q);
  let queriedRoutes: DocumentData[] = [];
  querySnapshot.forEach((doc) => {
    const docData = {
      id: doc.id,
      ...doc.data(),
    };
    queriedRoutes.push(docData);
  });

  return queriedRoutes;
};

export const deleteRoute = async (routeId: string) => {
  await deleteDoc(doc(db, 'routes', routeId));
};

export const uploadRouteImage = async (imageURL: string) => {
  const imageUID = new Date().valueOf();

  const routesRef = ref(storage, `routes/${imageUID}`);

  await uploadString(routesRef, imageURL, 'data_url');

  return getDownloadURL(routesRef);
};
