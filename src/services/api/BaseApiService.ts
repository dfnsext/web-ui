import defer from "defer-promise";
import { dfnsAppId } from "../../common/constant";

export enum ContentType {
	JSON = "application/json",
	FORM_DATA = "multipart/form-data;",
}

export default abstract class BaseApiService {
	private static queueAllRequests: boolean = false;
	private static queuedRequests: DeferPromise.Deferred<void> | null = null;

	protected buildHeaders(contentType: ContentType) {
		const headers = new Headers();
		headers.set("appId", dfnsAppId);
		if (contentType === ContentType.JSON) {
			headers.set("Content-Type", contentType);
		}

		return headers;
	}

	protected buildBody(body: { [key: string]: unknown }): string {
		return JSON.stringify(body);
	}

	protected async getRequest<T>(url: URL | string, synchroneRequest = false) {
		const request = async () => {
			return fetch(url, {
				method: "GET",
				headers: this.buildHeaders(ContentType.JSON),
			});
		};

		return this.stackSendRequest<T>(request, synchroneRequest);
	}

	protected async postRequest<T>(
		url: URL | string,
		body: { [key: string]: unknown } = {},

		synchroneRequest = false,
	) {
		const request = async () => {
			return fetch(url, {
				method: "POST",
				headers: this.buildHeaders(ContentType.JSON),
				body: this.buildBody(body),
			});
		};
		return this.stackSendRequest<T>(request, synchroneRequest);
	}

	protected async putRequest<T>(url: URL | string, body: { [key: string]: unknown } = {}, synchroneRequest = false) {
		const request = async () => {
			return fetch(url, {
				method: "PUT",
				headers: this.buildHeaders(ContentType.JSON),
				body: this.buildBody(body),
			});
		};

		return this.stackSendRequest<T>(request, synchroneRequest);
	}

	protected async patchRequest<T>(
		url: URL | string,
		body: { [key: string]: unknown } = {},

		synchroneRequest = false,
	) {
		const request = async () => {
			return fetch(url, {
				method: "PATCH",
				headers: this.buildHeaders(ContentType.JSON),
				body: this.buildBody(body),
			});
		};

		return this.stackSendRequest<T>(request, synchroneRequest);
	}

	protected async deleteRequest<T>(
		url: URL | string,
		body: { [key: string]: unknown } = {},

		synchroneRequest = false,
	) {
		const request = async () => {
			return fetch(url, {
				method: "DELETE",
				headers: this.buildHeaders(ContentType.JSON),
				body: this.buildBody(body),
			});
		};

		return this.stackSendRequest<T>(request, synchroneRequest);
	}

	protected async patchFormDataRequest<T>(url: URL | string, body: FormData, synchroneRequest = false) {
		const request = async () => {
			return fetch(url, {
				method: "PATCH",
				headers: this.buildHeaders(ContentType.FORM_DATA),
				body,
			});
		};

		return this.stackSendRequest<T>(request, synchroneRequest);
	}

	//
	protected async stackSendRequest<T>(request: () => Promise<Response>, synchroneRequest = false): Promise<T> {
		if (BaseApiService.queueAllRequests) {
			BaseApiService.queuedRequests = BaseApiService.queuedRequests ?? defer();
			return BaseApiService.queuedRequests.promise.then(() => {
				return this.sendRequest<T>(request, synchroneRequest);
			});
		}

		if (synchroneRequest) {
			BaseApiService.queueAllRequests = true;
		}

		const p = this.sendRequest<T>(request, synchroneRequest);

		p.then(() => {
			if (synchroneRequest) {
				BaseApiService.queueAllRequests = false;
				BaseApiService.queuedRequests?.resolve();
				BaseApiService.queuedRequests = null;
			}
		}).catch((err) => {
			if (synchroneRequest) {
				BaseApiService.queueAllRequests = false;
				BaseApiService.queuedRequests?.reject(err);
				BaseApiService.queuedRequests = null;
			}
		});
		return p;
	}

	private async sendRequest<T>(request: () => Promise<Response>, synchroneRequest = false): Promise<T> {
		synchroneRequest = synchroneRequest || BaseApiService.queueAllRequests;
		const response = await request();
		return this.processResponse<T>(response, request);
	}

	protected async processResponse<T>(response: Response, request: () => Promise<Response>): Promise<T> {
		let responseJson: unknown;
		request = request.bind(this);
		try {
			responseJson = await response.json();
		} catch (err: unknown) {
			responseJson = null;
		}

		if (!response.ok) {
			return Promise.reject(responseJson);
		}

		return responseJson as T;
	}

	protected async onError(error: unknown) {
		return Promise.reject(error);
	}
}

export interface IResponse {
	http_status: number;
}
