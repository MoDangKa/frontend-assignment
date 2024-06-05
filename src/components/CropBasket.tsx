import { Crop, CropType } from "@/type";
import CustomButton from "./common/buttons/CustomButton";

type Props = {
  label: CropType;
  data: Crop[];
  onClick: (crop: Crop) => void;
};

export default function CropBasket({ label, data, onClick }: Props) {
  return (
    <div className="col-span-4 border border-slate-200 dark:border-slate-800 overflow-hidden rounded-lg">
      <div className="bg-slate-50 dark:text-white dark:bg-slate-800 border-b border-b-slate-200 dark:border-b-slate-800 font-medium text-center py-2">
        {label}
      </div>
      <div className="flex flex-col gap-3 p-4">
        {data.map((crop, i) => (
          <CustomButton
            key={`CustomButton-${label}-${i}`}
            label={crop.name}
            onClick={() => onClick(crop)}
          />
        ))}
      </div>
    </div>
  );
}
