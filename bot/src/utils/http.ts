import axios, { type AxiosInstance } from 'axios';

let http: AxiosInstance | undefined;

export function getHttpInstance() {
  if (!http) {
    http = axios.create({
      baseURL: process.env.API_URL,
      headers: {
        'Authorization': `Bot ${process.env.API_KEY}`
      }
    });
  }

  return http;
}