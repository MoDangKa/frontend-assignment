import { fetcher, type Config } from "../fetcher";
import type { APIUsers, APIDepartments } from "./type";

async function loadUsers(id?: number) {
  try {
    const config: Config = {
      method: "GET",
      url: id ? `/api/users/${id}` : "/api/users",
    };
    const response = await fetcher<APIUsers>(config);
    return response;
  } catch (error) {
    console.error("Error loadUsers data:", error);
  }
}

async function loadDepartments() {
  try {
    const config: Config = {
      method: "GET",
      url: "/api/departments",
    };
    const response = await fetcher<APIDepartments>(config);
    return response;
  } catch (error) {
    console.error("Error loadDepartments data:", error);
  }
}

export { loadUsers, loadDepartments };
