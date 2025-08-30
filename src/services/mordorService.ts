import axios from 'axios';

const mordorAxios = axios.create({
  baseURL: 'http://172.16.0.237:8004',
  timeout: 10000,
//   headers: {'X-Custom-Header': 'foobar'}
});

export type ChatClassifierResponse = {
    action: String,
    target: String,
    url: string,
    confidence: String,
    explanation: String,
    query: String
}

export async function classifyChat(
  {
    query, page
  }: { query: String, page: String }
): Promise<ChatClassifierResponse> {
  try {
    const response = await mordorAxios.post<ChatClassifierResponse>('/classify', {
        query: query,
        page: page
    });
    console.log("Mordor response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in classifyChat:", error);
    throw error;
  }
}
