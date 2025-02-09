// services/partyService.ts
import { db } from "@firebase/firebase";
import {
  collection,
  getDocs,
  query,
  // limit,
  // startAfter,
  addDoc,
  doc,
  getDoc,
  // where,
  orderBy,
} from "firebase/firestore";
import { Party } from "@entities/party";

const PARTIES_COLLECTION = "parties";

// Get all parties
export async function getParties(): Promise<Party[]> {
  const querySnapshot = await getDocs(collection(db, PARTIES_COLLECTION));
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Party[];
}

// interface PaginatedResponse {
//   parties: Party[];
//   lastVisible: any;  // This can be any cursor or pagination key returned by your backend
// }

// Get paginated parties
export const getPartiesPaginated = async (page: number, limit: number): Promise<{ parties: any[]; lastVisible: any | null }> => {
  try {
    // Replace with your actual API endpoint and request parameters
    console.log(page);
    console.log(limit);
    let querySnapshot;

    querySnapshot = await getDocs(query(
      collection(db, 'parties'),
      orderBy("nameAlpha"),
      orderBy("startDate"),
    ));

    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log(data);


    return {
      parties: data || [],
      lastVisible: null
    };
  } catch (error) {
    console.error("Error fetching paginated parties:", error);
    return { parties: [], lastVisible: null };
  }
};

// Get a single party by ID
export async function getPartyById(id: string): Promise<Party | null> {
  const docRef = doc(db, PARTIES_COLLECTION, id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Party : null;
}

// Create a new party
export async function createParty(party: Party): Promise<string | null> {
  const docRef = await addDoc(collection(db, PARTIES_COLLECTION), party);
  return docRef.id;
}