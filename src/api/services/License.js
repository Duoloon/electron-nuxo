import { request } from "../base";

const endpoints = {
    delete: "/api/licencia/",
    put: "/api/licencia/",
    get: "/api/licencia",
};

export const deleteLi = async (id) => {
    const res = await request.delete(endpoints.delete + id);
    return res.data;
};

export const put = async (payload) => {
    const res = await request.put(endpoints.put + payload?.id, payload);
    return res.data;
};
export const post = async (payload) => {
    const res = await request.post(endpoints.get, payload);
    return res.data;
};

export const get = async () => {
    const res = await request.get(endpoints.get);
    return res.data;
};

export const getStatus = async (license) => {
    const res = await request.get(`https://duoloon.com/wp-json/lmfwc/v2/licenses/${license}`);
    return res.data;
};