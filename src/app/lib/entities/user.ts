import { Timestamp } from "firebase/firestore";

// entities/user.ts
export interface User {
    id?: string;
    username: string;
    firstname: string;
    lastname: string;
    birthdate: Timestamp;
    country: string;
    zip: number;
    city: string;
    street: string
    housenumber: number;
    unit?: string;
    createdParties?: string[];
}
  
export class UserEntity {
    constructor(public data: User) {}

    updateUser(data: Partial<User>) {
        Object.assign(this.data, data);
    }

    addCreatedParty(partyId: string) {
        if (!this.data.createdParties) {
            this.data.createdParties = [];
        }
        this.data.createdParties.push(partyId);
    }

    toJSON(): User {
        return this.data;
    }
}