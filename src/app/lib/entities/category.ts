// entities/Category.ts
export interface Category {
  id?: string;
  name: string;
  active: boolean;
}

export class CategoryEntity {
  private data: Category;

  constructor(data: Category) {
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

  // Getter for Active
  getActive(): boolean {
    return this.data.active;
  }

  // Setter for Active
  setActive(active: boolean): void {
    this.data.active = active;
  }
}
