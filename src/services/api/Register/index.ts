import { CreateUserRegistrationRequest, UserRegistrationChallenge, UserRegistrationResponse } from "@dfns/sdk";
import BaseApiService from "../BaseApiService";

export interface RegisterCompleteResponse {
	userAuthToken: string;
	result: UserRegistrationResponse;
}
export default class Register extends BaseApiService {
	private static instance: Register;
	private baseUrl: string;
	private constructor(
		protected apiUrl: string,
		protected appId: string,
	) {
		super();
		this.baseUrl = apiUrl.concat("/api/register");
		Register.instance = this;
	}

	public static getInstance(apiUrl: string, appId: string, reset?: boolean) {
		if (!Register.instance || reset || Register.instance.apiUrl !== apiUrl || Register.instance.appId !== appId)
			return new this(apiUrl, appId);

		return Register.instance;
	}

	public async init(oAuthToken: string): Promise<UserRegistrationChallenge> {
		const path = this.baseUrl.concat("/init");
		try {
			return await this.postRequest(path, { oAuthToken }, { appId: this.appId });
		} catch (err) {
			this.onError(err);
			return Promise.reject(err);
		}
	}

	public async restart(oAuthToken: string): Promise<UserRegistrationChallenge> {
		const path = this.baseUrl.concat("/restart");
		try {
			return await this.postRequest(path, { oAuthToken }, { appId: this.appId });
		} catch (err) {
			this.onError(err);
			return Promise.reject(err);
		}
	}

	public async withUsername(username: string): Promise<UserRegistrationChallenge> {
		const path = this.baseUrl.concat("/with-username");
		try {
			return await this.postRequest(path, { username }, { appId: this.appId });
		} catch (err) {
			this.onError(err);
			return Promise.reject(err);
		}
	}

	public async complete(tempAuthToken: string, signedChallenge: CreateUserRegistrationRequest): Promise<RegisterCompleteResponse> {
		const path = this.baseUrl.concat("/complete");
		try {
			return await this.postRequest(path, { tempAuthToken, signedChallenge }, { appId: this.appId });
		} catch (err) {
			this.onError(err);
			return Promise.reject(err);
		}
	}
}
