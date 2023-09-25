type IResolve<T> = (value: T) => void;
type IReject = (reason?: any) => void;

export default class PromiseDeferred<T> {
	public resolve: IResolve<T>;
	public reject: IReject;
	public promise: Promise<T>;
	constructor() {
		this.promise = new Promise((resolve: IResolve<T>, reject: IReject) => {
			this.resolve = resolve;
			this.reject = reject;
		});
	}
}