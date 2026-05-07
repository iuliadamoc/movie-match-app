import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

// check if movie is in favorites, return doc id if yes (for delete), null if no
export const checkFavorite = async (userId: string, movieId: number) => {
  const q = query(
    collection(db, "favorites"),
    where("userId", "==", userId),
    where("movieId", "==", movieId)
  );

  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    return snapshot.docs[0].id; // document ID 
  }

  return null;
};

// add
export const addFavorite = async (user: any, movie: any) => {
  return await addDoc(collection(db, "favorites"), {
    userId: user.uid,
    movieId: movie.id,
    title: movie.title,
    poster: movie.poster_path,
    createdAt: new Date(),
    genres: movie.genre_ids || movie.genres?.map((g: any) => g.id) || []
  });
};

// remove
export const removeFavorite = async (docId: string) => {
  await deleteDoc(doc(db, "favorites", docId));
};