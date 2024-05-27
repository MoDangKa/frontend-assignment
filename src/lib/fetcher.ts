import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import _ from "lodash";

export type FetcherResponse<T = any> = Pick<
  AxiosResponse<T>,
  "status" | "statusText" | "data"
>;
export type EmptyObj = Record<string, never>;

export type Config = AxiosRequestConfig;

export interface ConfigWithExpiry extends AxiosRequestConfig {
  cwe: {
    key: string;
    status: Array<number>;
    time: number;
  };
}

function setWithExpiry(key: string, value: any, ttl: number): void {
  const now = Date.now();
  const item = {
    value: value,
    expiry: now + ttl,
  };

  try {
    localStorage.setItem(key, JSON.stringify(item));
  } catch (e) {
    console.error(`Error setting item to localStorage with key "${key}":`, e);
  }
}

function getWithExpiry(key: string): FetcherResponse | null {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) return null;

  try {
    const item = JSON.parse(itemStr);
    const now = Date.now();

    if (now > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }

    return item.value;
  } catch (e) {
    console.error(`Error parsing item from localStorage with key "${key}":`, e);
    return null;
  }
}

async function fetcher<T = any>(
  config: AxiosRequestConfig,
): Promise<FetcherResponse<T | EmptyObj>> {
  try {
    const { status, statusText, data } = await axios(config);
    return { status, statusText, data };
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      const { status, statusText, data } = error.response;
      return {
        status,
        statusText: data?.message || statusText,
        data: data || {},
      };
    }

    const errorMessage =
      typeof error === "string" ? error : "An unknown error occurred";
    return { status: 400, statusText: errorMessage, data: {} };
  }
}

async function fetcherWithExpiry<T = any>(
  config: ConfigWithExpiry,
): Promise<FetcherResponse<T | EmptyObj>> {
  const { cwe } = config;

  const value = getWithExpiry(cwe.key);
  if (!_.isEmpty(value) && cwe.status.includes(value.status)) {
    return value;
  } else {
    const response = await fetcher(config);
    if (!_.isEmpty(response.data) && cwe.status.includes(response.status)) {
      setWithExpiry(cwe.key, response, 60 * 1000 * cwe.time);
    }

    return response;
  }
}

export { fetcher, fetcherWithExpiry, setWithExpiry, getWithExpiry };
