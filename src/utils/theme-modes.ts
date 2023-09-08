

// export class ThemeMode {
// 	private static ctx: ThemeMode;
// 	private _type: EThemeModeType = (localStorage.getItem('theme-mode') as EThemeModeType) ?? EThemeModeType.FNAC;
// 	private readonly event = new EventEmitter<EThemeModeType>();

// 	private constructor() {
// 		ThemeMode.ctx = this;
// 		this.switch(this.type);
// 	}

// 	public static getInstance() {
// 		if (!ThemeMode.ctx) {
// 			return new this();
// 		}
// 		return ThemeMode.ctx;
// 	}

// 	public get type() {
// 		return this._type;
// 	}

// 	/**
// 	 * @returns removelistener callback
// 	 */
// 	public onSwitch(callback: (type: EThemeModeType) => void) {
// 		return this.event.on('switch-theme-mode', callback);
// 	}

// 	public switch(type: EThemeModeType) {
// 		if (type === this.type) return;
// 		this._type = type;
// 		localStorage.setItem('theme-mode', this._type);
// 		this.event.emit('switch-theme-mode', this._type);
// 	}
// }
