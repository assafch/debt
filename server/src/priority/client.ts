import axios, { AxiosResponse } from 'axios';
import { config } from '../config';

interface ODataResponse {
  value: unknown[];
  '@odata.nextLink'?: string;
}

function makePriorityHeaders() {
  const encoded = Buffer.from(config.PRIORITY_API_KEY_PAT).toString('base64');
  return {
    Authorization: `Basic ${encoded}`,
    Accept: 'application/json',
    // Priority Connect validates this header
    'User-Agent': 'PostmanRuntime/7.36.3',
  };
}

export async function fetchODataAll<T>(url: string): Promise<T[]> {
  const results: T[] = [];
  let nextUrl: string | null = url;

  while (nextUrl) {
    const resp: AxiosResponse<ODataResponse> = await axios.get<ODataResponse>(nextUrl, {
      headers: makePriorityHeaders(),
      timeout: 60000,
    });

    const data: ODataResponse = resp.data;
    if (!data?.value || !Array.isArray(data.value)) {
      throw new Error(`Unexpected OData response format from: ${nextUrl}`);
    }

    results.push(...(data.value as T[]));
    nextUrl = data['@odata.nextLink'] ?? null;
  }

  return results;
}
