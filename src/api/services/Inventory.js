import { request } from "../base";

const endpoints = {
    delete: "/api/inventario/",
    put: "/api/inventario/",
    get: "/api/inventario",
};

export const deleteI = async (id) => {
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