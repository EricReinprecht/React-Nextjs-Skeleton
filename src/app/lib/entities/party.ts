// entities/party.ts
export interface Party {
  id?: string;
  name: string;
  date: string; // Example field: party date
  location?: string;
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
}
