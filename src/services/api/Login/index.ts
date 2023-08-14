import { CreateUserLoginRequest, UserLoginChallengeResponse } from "@dfns/sdk";
import BaseApiService from "../BaseApiService";
import { apiUrl } from "../../../common/constant";


export default class Login extends BaseApiService {
	private static instance: Login;
	private readonly baseUrl = apiUrl.concat("/api/login");
	private constructor() {
		super();
		Login.instance = this;
	}

	public static getInstance(reset?: boolean) {
		if (!Login.instance || reset) return new this();
		return Login.instance;
	}

	public async delegated(username: string): Promise<{userAuthToken: string}> {
		const path = this.baseUrl.concat("/delegated");
		try {
			return await this.postRequest(path, { username });
		} catch (err) {
			this.onError(err);
			return Promise.reject(err);
		}
	}

	public async init(oAuthToken: string): Promise<UserLoginChallengeResponse> {
		const path = this.baseUrl.concat("/init");
		try {
			return await this.postRequest(path, { oAuthToken });
		} catch (err) {
			this.onError(err);
			return Promise.reject(err);
		}
	}

	public async complete(params: CreateUserLoginRequest): Promise<{userAuthToken: string}> {
		const path = this.baseUrl.concat("/complete");
		try {
			return await this.postRequest(path, params);
		} catch (err) {
			this.onError(err);
			return Promise.reject(err);
		}
	}
}
