"use client";
import CropBasket from "@/components/CropBasket";
import CustomButton from "@/components/common/buttons/CustomButton";
import { mockCrops } from "@/lib/mock";
import { Crop } from "@/type";
import { useEffect, useMemo, useRef, useState } from "react";

type BasketData = {
  fruit: Crop[];
  vegetable: Crop[];
};

export default function V2Page() {
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
      { fruit: [], vegetable: [] }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [basketRef.current]);

  const handleChooseCrop = (selectedCrop: Crop) => {
    if (!crops.some((crop) => crop.name === selectedCrop.name)) {
      console.log("Something is wrong.");
      return;
    }

    // Move the selected crop to the basket
    basketRef.current = [...basketRef.current, selectedCrop];
    setCrops((prev) => {
      cropsRef.current = prev.filter((crop) => crop.name !== selectedCrop.name);
      return cropsRef.current;
    });

    // Set a timer to move crop back to the main list after 5 seconds
    timersRef.current[selectedCrop.name] = setTimeout(() => {
      basketRef.current = basketRef.current.filter(
        (b) => b.name !== selectedCrop.name
      );
      if (!cropsRef.current.some((crop) => crop.name === selectedCrop.name)) {
        setCrops((prev) => {
          cropsRef.current = [...prev, selectedCrop];
          return cropsRef.current;
        });
      }
      delete timersRef.current[selectedCrop.name];
    }, 5000);
  };

  const handleChooseCropInBasket = (selectedCrop: Crop) => {
    basketRef.current = basketRef.current.filter(
      (b) => b.name !== selectedCrop.name
    );
    setCrops((prev) => {
      cropsRef.current = [...prev, selectedCrop];
      return cropsRef.current;
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
