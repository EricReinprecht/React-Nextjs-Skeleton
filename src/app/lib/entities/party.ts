import { Category } from "./category";

export interface Party {
  id?: string;
  name: string;
  date: string;
  location?: string;
  imageUrl?: string;
  startDate: Date;
  categories?: Category[];
}

export class PartyEntity {
  private data: Party;

  constructor(data: Party) {
    this.data = data;
  }

  // Getter for ID
  getId(): string | undefined {
    return this.data.id;
  }

  // Setter for ID
  setId(id: string): void {
    this.data.id = id;
  }

  // Getter for Name
  getName(): string {
    return this.data.name;
  }

  // Setter for Name
  setName(name: string): void {
    this.data.name = name;
  }

  // Getter for Date
  getDate(): string {
    return this.data.date;
  }

  // Setter for Date
  setDate(date: string): void {
    this.data.date = date;
  }

  // Getter for Location
  getLocation(): string | undefined {
    return this.data.location;
  }

  // Setter for Location
  setLocation(location: string): void {
    this.data.location = location;
  }

  // New: Getter for Categories
  getCategories(): Category[] | undefined {
    return this.data.categories;
  }

  // New: Setter for Categories
  setCategories(categories: Category[]): void {
    this.data.categories = categories;
  }

  // Optional: Add Category
  addCategory(category: Category): void {
    if (!this.data.categories) this.data.categories = [];
    this.data.categories.push(category);
  }

  // Optional: Remove Category by ID
  removeCategory(categoryId: string): void {
    if (!this.data.categories) return;
    this.data.categories = this.data.categories.filter(cat => cat.id !== categoryId);
  }

  toObject(): Party {
    return this.data;
  }
}
