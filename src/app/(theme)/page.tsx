"use client";
import CropBasket from "@/components/CropBasket";
import CustomButton from "@/components/common/buttons/CustomButton";
import { mockCrops, type Crop } from "@/lib/mock";
import { useEffect, useRef, useState } from "react";

export default function HomePage() {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [fruitBasket, setFruitBasket] = useState<Crop[]>([]);
  const [vegetableBasket, setVegetableBasket] = useState<Crop[]>([]);

  const cropsRef = useRef<Crop[]>([]);
  const timersRef = useRef<{ [key: string]: NodeJS.Timeout }>({});

  useEffect(() => {
    setCrops(mockCrops);
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      Object.values(timersRef.current).forEach(clearTimeout);
    };
  }, []);

  const handleChooseCrop = (selectedCrop: Crop) => {
    if (!crops.some((crop) => crop.name === selectedCrop.name)) {
      console.log("Something is wrong.");
      return;
    }

    const setBasket =
      selectedCrop.type === "Fruit" ? setFruitBasket : setVegetableBasket;

    setBasket((prev) => [...prev, selectedCrop]);
    setCrops((prev) => {
      const updatedCrops = prev.filter(
        (crop) => crop.name !== selectedCrop.name,
      );
      cropsRef.current = updatedCrops;
      return updatedCrops;
    });

    timersRef.current[selectedCrop.name] = setTimeout(() => {
      const currentCrops = cropsRef.current;
      if (!currentCrops.some((crop) => crop.name === selectedCrop.name)) {
        setBasket((prev) =>
          prev.filter((crop) => crop.name !== selectedCrop.name),
        );
        setCrops(() => {
          const updatedCrops = [...currentCrops, selectedCrop];
          cropsRef.current = updatedCrops;
          return updatedCrops;
        });
      }
      delete timersRef.current[selectedCrop.name];
    }, 5000);
  };

  const handleChooseCropInBasket = (selectedCrop: Crop) => {
    const setBasket =
      selectedCrop.type === "Fruit" ? setFruitBasket : setVegetableBasket;
    setBasket((prev) => prev.filter((crop) => crop.name !== selectedCrop.name));
    setCrops((prev) => {
      const updatedCrops = [...prev, selectedCrop];
      cropsRef.current = updatedCrops;
      return updatedCrops;
    });
  };

  return (
    <>
      <div className="col-span-3 flex flex-col gap-3">
        {crops.map((crop, index) => (
          <CustomButton
            key={`CustomButton-${index}`}
            label={crop.name}
            onClick={() => handleChooseCrop(crop)}
          />
        ))}
      </div>
      <CropBasket
        label="Fruit"
        data={fruitBasket}
        onClick={handleChooseCropInBasket}
      />
      <CropBasket
        label="Vegetable"
        data={vegetableBasket}
        onClick={handleChooseCropInBasket}
      />
    </>
  );
}
