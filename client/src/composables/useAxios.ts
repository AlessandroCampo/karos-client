import axios from 'axios';
import { BACKEND_URL } from './useSocket';
import { ref } from 'vue';

const noop = () => { };
const noopWithArg = (_: any) => { };
const token = localStorage.getItem('jwt');

const instance = axios.create({
    baseURL: BACKEND_URL.value,
    timeout: 2000,
    headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
    }
});

export const useAxios = (

) => {
    const errors = ref<any[]>([]);
    const loading = ref(false);

    const request = async ({
        route,
        method = 'get',
        params = {},
        data = {},
        config = {},
        onSuccess = noopWithArg,
        onFail = noopWithArg,
        onResolve = noop,
    }: {
        route: string;
        method?: 'get' | 'post' | 'put' | 'delete' | 'patch';
        params?: any;
        data?: any;
        config?: any;
        onSuccess?: (data: any) => void;
        onFail?: (err: Error) => void;
        onResolve?: () => void;
    }) => {
        if (loading.value) return;

        loading.value = true;
        errors.value = [];

        try {
            const response = await instance.request({
                url: route,
                method,
                params,
                data,
                ...config,
            });

            onSuccess(response.data);
            return response.data;

        } catch (err: any) {
            const errorMessage = err?.response?.data?.message || err?.response?.data?.error || err.message || 'Unknown error';
            errors.value.push(errorMessage);
            onFail(err);
        } finally {
            loading.value = false;
            onResolve();
        }
    };


    return {
        request,
        loading,
        errors,
    };
};