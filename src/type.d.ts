interface Crop {
  id?: string;
  type: CropType;
  name: string;
}

export type CropType = "Fruit" | "Vegetable";
