import { CreateUserRegistrationRequest, UserRegistrationChallenge, UserRegistrationResponse } from "@dfns/sdk";
import BaseApiService from "../BaseApiService";
import { apiUrl } from "../../../common/constant";


export interface RegisterCompleteResponse { userAuthToken: string; result: UserRegistrationResponse }
export default class Register extends BaseApiService {
	private static instance: Register;
	private readonly baseUrl = apiUrl.concat("/api/register");
	private constructor() {
		super();
		Register.instance = this;
	}

	public static getInstance(reset?: boolean) {
		if (!Register.instance || reset) return new this();
		return Register.instance;
	}

	public async init(oAuthToken: string): Promise<UserRegistrationChallenge> {
		const path = this.baseUrl.concat("/init");
		try {
			return await this.postRequest(path, { oAuthToken });
		} catch (err) {
			this.onError(err);
			return Promise.reject(err);
		}
	}

	public async withUsername(username: string): Promise<UserRegistrationChallenge> {
		const path = this.baseUrl.concat("/with-username");
		try {
			return await this.postRequest(path, { username });
		} catch (err) {
			this.onError(err);
			return Promise.reject(err);
		}
	}

	public async complete(
		tempAuthToken: string,
		signedChallenge: CreateUserRegistrationRequest,
	): Promise<RegisterCompleteResponse> {
		const path = this.baseUrl.concat("/complete");
		try {
			return await this.postRequest(path, { tempAuthToken, signedChallenge });
		} catch (err) {
			this.onError(err);
			return Promise.reject(err);
		}
	}
}
