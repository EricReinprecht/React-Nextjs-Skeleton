import { Category } from "./category";
import { DocumentReference } from "firebase/firestore";

export interface Card {
  id?: string;
  party: DocumentReference[];
}

export class PartyEntity {
  private data: Card;

  constructor(data: Card) {
    this.data = data;
  }

  toObject(): Card {
    return this.data;
  }
}
