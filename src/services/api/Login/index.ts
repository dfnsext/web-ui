import { CreateUserLoginRequest, UserLoginChallengeResponse } from "@dfns/sdk";
import BaseApiService from "../BaseApiService";

export default class Login extends BaseApiService {
	private static instance: Login;
	private baseUrl: string;

	private constructor(
		protected apiUrl: string,
		protected appId: string,
	) {
		super();
		this.baseUrl = this.apiUrl.concat("/api/login");
		Login.instance = this;
	}

	public static getInstance(apiUrl: string, appId: string, reset?: boolean) {
		if (!Login.instance || reset || Login.instance.apiUrl !== apiUrl || Login.instance.appId !== appId) return new this(apiUrl, appId);
		return Login.instance;
	}

	public async delegated(oAuthToken: string): Promise<{ token: string }> {
		const path = this.baseUrl.concat("/delegated");
		try {
			return await this.postRequest(path, { oAuthToken }, { appId: this.appId });
		} catch (err) {
			this.onError(err);
			return Promise.reject(err);
		}
	}

	public async init(oAuthToken: string): Promise<UserLoginChallengeResponse> {
		const path = this.baseUrl.concat("/init");
		try {
			return await this.postRequest(path, { oAuthToken }, { appId: this.appId });
		} catch (err) {
			this.onError(err);
			return Promise.reject(err);
		}
	}

	public async complete(params: CreateUserLoginRequest): Promise<{ userAuthToken: string }> {
		const path = this.baseUrl.concat("/complete");
		try {
			return await this.postRequest(path, params, { appId: this.appId });
		} catch (err) {
			this.onError(err);
			return Promise.reject(err);
		}
	}
}
