import { UserRecoveryChallenge } from "@dfns/sdk/codegen/datamodel/Auth";
import BaseApiService from "../BaseApiService";

export default class Recover extends BaseApiService {
	private static instance: Recover;
	private baseUrl: string;

	private constructor(
		protected apiUrl: string,
		protected appId: string,
	) {
		super();
		this.baseUrl = this.apiUrl.concat("/api/recover");
		Recover.instance = this;
	}

	public static getInstance(apiUrl: string, appId: string, reset?: boolean) {
		if (!Recover.instance || reset || Recover.instance.apiUrl !== apiUrl || Recover.instance.appId !== appId)
			return new this(apiUrl, appId);
		return Recover.instance;
	}

	public async delegated(oAuthToken: string, credentialId: string): Promise<UserRecoveryChallenge> {
		const path = this.baseUrl.concat("/delegated");
		try {
			return await this.postRequest(path, { oAuthToken, credentialId }, { appId: this.appId });
		} catch (err) {
			this.onError(err);
			return Promise.reject(err);
		}
	}
}
