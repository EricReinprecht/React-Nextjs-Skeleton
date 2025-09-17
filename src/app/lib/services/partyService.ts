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
  where,
  orderBy,
  documentId ,
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
export const getPartiesPaginated = async (
  page: number, 
  limit: number, 
  filter?: Record<string, any>
): Promise<{ parties: any[]; lastVisible: any | null }> => {
  try {
    let q = query(collection(db, "parties"));

    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (!value) return;

        if (key === "id") {
          q = query(q, where(documentId(), "==", value));
        } else if(["created", "startDate", "endDate"].includes(key)){
          const date = new Date(value); 
          const startOfDay = new Date(date);
          startOfDay.setHours(0, 0, 0, 0);
          const endOfDay = new Date(date);
          endOfDay.setHours(23, 59, 59, 999);
            
          q = query(
            q,
            where(key, ">=", startOfDay),
            where(key, "<=", endOfDay)
          );
        }else{
          // Prefix search for other fields
          q = query(
            q,
            where(key, ">=", value),
            where(key, "<=", value + "\uf8ff")
          );
        }
      });
    }

    q = query(q, orderBy("name"), orderBy("startDate"));

    const querySnapshot = await getDocs(q);

    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // console.log(data);


    return {
      parties: data || [],
      lastVisible: null,
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