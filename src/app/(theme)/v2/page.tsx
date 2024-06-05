"use client";
import CropBasket from "@/components/CropBasket";
import CustomButton from "@/components/common/buttons/CustomButton";
import { mockCrops } from "@/lib/mock";
import { Crop } from "@/type";
import { nanoid } from "nanoid";
import { useCallback, useEffect, useMemo, useReducer } from "react";

type BasketData = {
  fruit: Crop[];
  vegetable: Crop[];
};

type State = {
  crops: Crop[];
  basket: Crop[];
  timers: { [key: string]: NodeJS.Timeout };
};

type Action =
  | { type: "SET_CROPS"; payload: Crop[] }
  | { type: "ADD_TO_BASKET"; payload: Crop }
  | { type: "REMOVE_FROM_BASKET"; payload: Crop }
  | { type: "REMOVE_FROM_BASKET_BY_TIME"; payload: Crop }
  | { type: "SET_TIMER"; payload: { id: string; timer: NodeJS.Timeout } }
  | { type: "CLEAR_TIMER"; payload: string };

const initialState: State = {
  crops: [],
  basket: [],
  timers: {},
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_CROPS":
      return { ...state, crops: action.payload };
    case "ADD_TO_BASKET":
      return {
        ...state,
        crops: state.crops.filter((crop) => crop.name !== action.payload.name),
        basket: [...state.basket, action.payload],
      };
    case "REMOVE_FROM_BASKET":
      return {
        ...state,
        crops: [...state.crops, { ...action.payload, id: "" }],
        basket: state.basket.filter((b) => b.id !== action.payload.id),
      };
    case "REMOVE_FROM_BASKET_BY_TIME":
      const xCrop = action.payload;
      const findXCrop = state.basket.findIndex((b) => b.id === xCrop.id);
      if (findXCrop > -1) {
        const basket = state.basket.filter(
          (crop) => crop.id !== action.payload.id,
        );
        const findCrop = state.crops.findIndex((b) => b.name === xCrop.name);
        const crops =
          findCrop > -1 ? state.crops : [...state.crops, { ...xCrop, id: "" }];
        return { ...state, crops, basket };
      }
      return state;
    case "SET_TIMER":
      return {
        ...state,
        timers: { ...state.timers, [action.payload.id]: action.payload.timer },
      };
    case "CLEAR_TIMER":
      const newTimers = { ...state.timers };
      clearTimeout(newTimers[action.payload]);
      delete newTimers[action.payload];
      return { ...state, timers: newTimers };
    default:
      return state;
  }
};

export default function V2Page() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch({ type: "SET_CROPS", payload: mockCrops });

    return () => {
      Object.values(state.timers).forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const basketData: BasketData = useMemo(() => {
    return state.basket.reduce<BasketData>(
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
  }, [state.basket]);

  const handleChooseCrop = useCallback(
    (selectedCrop: Crop) => {
      if (!state.crops.some((crop) => crop.name === selectedCrop.name)) {
        console.error("Something is wrong.");
        return;
      }

      const id = nanoid();
      const xCrop: Crop = { ...selectedCrop, id };

      dispatch({ type: "ADD_TO_BASKET", payload: xCrop });

      const timer = setTimeout(() => {
        dispatch({ type: "REMOVE_FROM_BASKET_BY_TIME", payload: xCrop });
        dispatch({ type: "CLEAR_TIMER", payload: id });
      }, 5000);

      dispatch({ type: "SET_TIMER", payload: { id, timer } });
    },
    [state.crops, dispatch],
  );

  const handleChooseCropInBasket = useCallback(
    (selectedCrop: Crop) => {
      const findInBasket = state.basket.find(
        (b) => b.name === selectedCrop.name,
      );
      if (findInBasket) {
        dispatch({ type: "REMOVE_FROM_BASKET", payload: findInBasket });
      }
    },
    [state.basket, dispatch],
  );

  return (
    <>
      <div className="col-span-3 flex flex-col gap-3">
        {state.crops.map((crop, index) => (
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
