"use client";
import CropBasket from "@/components/CropBasket";
import CustomButton from "@/components/common/buttons/CustomButton";
import { mockCrops } from "@/lib/mock";
import { Crop } from "@/type";
import { nanoid } from "nanoid";
import { useEffect, useMemo, useRef, useState } from "react";

type BasketData = {
  fruit: Crop[];
  vegetable: Crop[];
};

export default function V1Page() {
  const [crops, setCrops] = useState<Crop[]>([]);
  const cropsRef = useRef<Crop[]>([]);
  const basketRef = useRef<Crop[]>([]);
  const timersRef = useRef<{ [key: string]: NodeJS.Timeout }>({});

  useEffect(() => {
    setCrops(mockCrops);
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      Object.values(timersRef.current).forEach(clearTimeout);
    };
  }, []);

  const basketData: BasketData = useMemo(() => {
    return basketRef.current.reduce<BasketData>(
      (acc, crop) => {
        if (crop.type === "Fruit") {
          acc.fruit.push(crop);
        } else if (crop.type === "Vegetable") {
          acc.vegetable.push(crop);
        }
        return acc;
      },
      { fruit: [], vegetable: [] },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [crops]);

  const handleChooseCrop = (selectedCrop: Crop) => {
    if (!crops.some((crop) => crop.name === selectedCrop.name)) {
      console.log("Something is wrong.");
      return;
    }

    const id = nanoid();
    const xCrop: Crop = { ...selectedCrop, id };

    basketRef.current = [...basketRef.current, xCrop];

    cropsRef.current = crops.filter((crop) => crop.name !== selectedCrop.name);
    setCrops(cropsRef.current);

    timersRef.current[id] = setTimeout(() => {
      const findXCrop = basketRef.current.find((b) => b.id === id);

      if (findXCrop) {
        const currentBasket = basketRef.current.filter((b) => b.id !== id);
        basketRef.current = currentBasket;
        const currentCrops = [...cropsRef.current, selectedCrop];
        cropsRef.current = currentCrops;
        setCrops(currentCrops);
      }

      delete timersRef.current[id];
    }, 5000);
  };

  const handleChooseCropInBasket = (selectedCrop: Crop) => {
    const currentBasket = basketRef.current.filter(
      (b) => b.name !== selectedCrop.name,
    );
    basketRef.current = currentBasket;

    const findInCrops = crops.find((c) => c.name === selectedCrop.name);
    if (!findInCrops) {
      const currentCrops = [...crops, { ...selectedCrop, id: "" }];
      cropsRef.current = currentCrops;
      setCrops(currentCrops);
    }
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
        data={basketData.fruit}
        onClick={handleChooseCropInBasket}
      />
      <CropBasket
        label="Vegetable"
        data={basketData.vegetable}
        onClick={handleChooseCropInBasket}
      />
    </>
  );
}
