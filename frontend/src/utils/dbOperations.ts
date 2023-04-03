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
  imagePath: string,
  routeImageURL: string,
  routeId?: string
): Promise<string> => {
  if (!auth.currentUser) {
    return '';
  }

  const {
    coordinates,
    distance,
    elevationGainAndLoss,
    elevationPoints,
    mapViewInfo,
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
        mapViewInfo,
        name: name,
        imagePath: imagePath,
        imageURL: routeImageURL,
        selectedPoints: selectedPoints,
      });

      return routeId;
    }

    const routeDoc = await addDoc(collection(db, 'routes'), {
      coordinates: formattedCoordinates,
      distance: distance,
      elevationData: elevationGainAndLoss,
      elevationPoints: elevationPoints,
      imagePath: imagePath,
      imageURL: routeImageURL,
      mapViewInfo,
      name: name,
      selectedPoints: selectedPoints,
      userID: auth.currentUser.uid,
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

export const uploadRouteImage = async (localImageURL: string) => {
  const imageUID = new Date().valueOf();

  const routesRef = ref(storage, `routes/${imageUID}`);

  const uploadResult = await uploadString(routesRef, localImageURL, 'data_url');
  const { fullPath } = uploadResult.metadata;
  const imageURL = await getDownloadURL(routesRef);

  return {
    imagePath: fullPath,
    imageURL,
  };
};
