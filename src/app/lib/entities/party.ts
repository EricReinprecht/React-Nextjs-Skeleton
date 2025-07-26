import { Category } from "./category";
import { DocumentReference } from "firebase/firestore";

export interface Party {
  id: string;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  imageUrls?: Array<string>;
  startDate: Date;
  endDate: Date;
  description: string;
  categories?: DocumentReference[];
}

export class PartyEntity {
  private data: Party;

  constructor(data: Party) {
    this.data = data;
  }

  toObject(): Party {
    return this.data;
  }
}
