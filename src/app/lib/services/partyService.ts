// services/partyService.ts
import { db } from "@firebase/firebase";
import {
  collection,
  getDocs,
  query,
  limit,
  startAfter,
  addDoc,
  doc,
  getDoc,
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

// Get paginated parties
export async function getPartiesPaginated(
  pageSize: number,
  lastVisible: any = null
): Promise<{ parties: Party[]; lastVisible: any }> {
  let partyQuery = query(
    collection(db, PARTIES_COLLECTION),
    // orderBy("date"),  // Order parties by date or any other field
    limit(pageSize)
  );

  if (lastVisible) {
    partyQuery = query(partyQuery, startAfter(lastVisible));
  }

  const querySnapshot = await getDocs(partyQuery);
  const parties = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Party[];

  const lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

  return {
    parties,
    lastVisible: lastVisibleDoc,
  };
}

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