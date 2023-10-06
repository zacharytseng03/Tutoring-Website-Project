import axios, { AxiosError, AxiosResponse, AxiosRequestConfig } from 'axios';
import { Response } from '../Models/Miscallaneous/Response.Model';

const baseURL = 'http://localhost:3000/api';

const apiCall = async (method: string, url: string, request?: any, params?: any): Promise<Response> => {
	const config: AxiosRequestConfig = {
		method: method,
		baseURL: baseURL,
		url: url,
		data: request,
		params: params,
	}
	return await axios(
		config
    ).then ((response: AxiosResponse<any, any>) => {
        console.log(response)
		
		const resp: Response = response.data.error ? {
			status: response.status,
			response: response.data,
			error: response.data.error
		} :
		{
			status: response.status,
			response: response.data,
		}
        return resp;
    }).catch((error: AxiosError) => {
        console.log(error)

		const resp: Response = {
			status: error.status || 500,
			response: error.response?.data,
			error: typeof (error.response?.data as any)?.error === 'string' && (error.response?.data as any).error|| error.message || "An Unidentified Error Occurred."
		}
		return resp;
    })
}

export default apiCall;