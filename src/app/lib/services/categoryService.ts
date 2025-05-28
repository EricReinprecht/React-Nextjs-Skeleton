// services/categoryService.ts

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
  runTransaction,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { Category } from "../entities/category";

const CATEGORIES_COLLECTION = "categories";

// Get all parties
export async function getCategories(): Promise<Category[]> {
  const querySnapshot = await getDocs(collection(db, CATEGORIES_COLLECTION));
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Category[];
}

// Get paginated parties
export const getCategoriesPaginated = async (page: number, limit: number): Promise<{ categories: any[]; lastVisible: any | null }> => {
  try {
    let querySnapshot;

    querySnapshot = await getDocs(query(
      collection(db, CATEGORIES_COLLECTION),
      orderBy("nameAlpha"),
      orderBy("startDate"),
    ));

    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log(data);


    return {
      categories: data || [],
      lastVisible: null
    };
  } catch (error) {
    console.error("Error fetching paginated parties:", error);
    return { categories: [], lastVisible: null };
  }
};

// Get a single category by ID
export async function getCategoryById(id: string): Promise<Category | null> {
  const docRef = doc(db, CATEGORIES_COLLECTION, id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Category : null;
}

// Create new Category (name has to be uniqe)
export async function createCategory(category: Category): Promise<string | null> {
  const categoriesCol = collection(db, CATEGORIES_COLLECTION);

  try {
    const categoryId = await runTransaction(db, async (transaction) => {
      // Query for existing category with the same name
      const q = query(categoriesCol, where("name", "==", category.name));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        throw new Error("Category with this name already exists.");
      }

      // If not exists, add new doc
      const docRef = await addDoc(categoriesCol, category);
      return docRef.id;
    });

    return categoryId;
  } catch (error) {
    console.error("Transaction failed:", error);
    return null;
  }
}

// Delete a category by ID
export async function deleteCategoryById(id: string): Promise<boolean> {
  try {
    const categoryRef = doc(db, CATEGORIES_COLLECTION, id);
    await deleteDoc(categoryRef);
    return true;
  } catch (error) {
    console.error("Error deleting category:", error);
    return false;
  }
}

// Update a category by ID
export async function updateCategoryById(id: string, updatedFields: Partial<Category>): Promise<boolean> {
  try {
    const categoryRef = doc(db, CATEGORIES_COLLECTION, id);
    await updateDoc(categoryRef, updatedFields);
    return true;
  } catch (error) {
    console.error("Error updating category:", error);
    return false;
  }
}
