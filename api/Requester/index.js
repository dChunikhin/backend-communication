import axios from 'axios';
import getConfig from 'next-server/config';

let url = `${getConfig().publicRuntimeConfig.baseUrl}/graphql/`;

export default class Requester {
    private ENDPOINT_URL = url;
    public addPreprocessor(preprocessor: any) {
        this.preprocessor = preprocessor;
        return this;
    }
    public addPostprocessor(postprocessor: any) {
        this.postprocessor = postprocessor;
        return this;
    }
    public send(query, headers) {
        return axios({
            headers,
            url: this.ENDPOINT_URL,
            method: 'post',
            data: query,
            withCredentials: true,
        });
    }
    public makeRequest(query: string, customHeaders?: any) {
        const headers = customHeaders || { 'Content-Type': 'application/json' };
        return this.send(query, headers)
            .then((response: any) => this.postprocessor(response));
    }
    private preprocessor: any = response => response;
    private postprocessor: any = response => response;
}
