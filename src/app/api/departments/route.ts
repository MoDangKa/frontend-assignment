import type {
  APIDepartments,
  APIUsers,
  CategoryDepartmentBasic,
  Gender,
  User,
} from "@/lib/apis/type";
import { fetcher } from "@/lib/fetcher";
import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.API_URL!;

export async function GET(request: NextRequest) {
  const { status, statusText, data } = await fetcher<APIUsers>({
    method: "GET",
    url: `${API_URL}/users`,
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (status === 200) {
    const genderCount = (
      total: number,
      gender: Gender,
      userGender: Gender,
    ): number => {
      return gender === userGender ? total + 1 : total;
    };

    const categoryDepartmentBasic = data.users.reduce(
      (acc: CategoryDepartmentBasic, user: User) => {
        const key = user.company.department;
        const { gender, age, hair, firstName, lastName, address } = user;

        acc[key] = {
          male: genderCount(acc[key]?.male || 0, "male", gender),
          female: genderCount(acc[key]?.female || 0, "female", gender),
          age: [...(acc[key]?.age || []), age],
          hairColor: [...(acc[key]?.hairColor || []), hair.color],
          addressUser: {
            ...acc[key]?.addressUser,
            [`${firstName}${lastName}`]: address.postalCode,
          },
        };

        return acc;
      },
      {} as CategoryDepartmentBasic,
    );

    const departments = Object.entries(categoryDepartmentBasic).reduce(
      (acc: APIDepartments, [key, value]) => {
        const ages = value.age;
        const minAge = Math.min(...ages);
        const maxAge = Math.max(...ages);

        const hair = value.hairColor.reduce(
          (hairAcc, color) => {
            hairAcc[color] = (hairAcc[color] || 0) + 1;
            return hairAcc;
          },
          {} as { [key: string]: number },
        );

        acc[key] = {
          male: value.male,
          female: value.female,
          ageRange: `${minAge}-${maxAge}`,
          hair,
          addressUser: value.addressUser,
        };

        return acc;
      },
      {} as APIDepartments,
    );

    return NextResponse.json(
      { departments },
      {
        status,
        statusText,
      },
    );
  }

  return NextResponse.json(data, {
    status,
    statusText,
  });
}
