import { EventEmitter } from "events";

export class WindowStore {
	private static instance: WindowStore;
	private readonly event = new EventEmitter();

	private constructor() {
		WindowStore.instance = this;
		this.initEvents();
	}

	public static getInstance(): WindowStore {
		if (!WindowStore.instance) {
			return new this();
		}
		return WindowStore.instance;
	}

	public onScrollYDirectionChange(callback: (scrollYDifference: number) => void): () => void {
		this.event.on("scrollYDirectionChange", callback);
		return () => {
			this.event.off("scrollYDirectionChange", callback);
		};
	}

	public onResize(callback: (window: Window) => void): () => void {
		this.event.on("resize", callback);
		return () => {
			this.event.off("resize", callback);
		};
	}

	public onClick(callback: (e: MouseEvent) => void): () => void {
		this.event.on("click", callback);
		return () => {
			this.event.off("click", callback);
		};
	}

	private initEvents(): void {
		window.addEventListener("scroll", () => this.scrollYHandler());
		window.addEventListener("resize", () => this.resizeHandler());
		document.addEventListener("click", (e) => this.clickHandler(e), true);
	}

	private clickHandler(e: MouseEvent): void {
		this.event.emit("click", e);
	}

	private scrollYHandler = (() => {
		let previousY: number = window.scrollY;
		let snapShotY: number = previousY;
		let previousYDirection: number = 1;

		return (): void => {
			const scrollYDirection = window.scrollY - previousY > 0 ? 1 : -1;
			if (previousYDirection !== scrollYDirection) {
				snapShotY = window.scrollY;
			}

			this.event.emit("scrollYDirectionChange", snapShotY - window.scrollY);
			previousY = window.scrollY;
			previousYDirection = scrollYDirection;
		};
	})();

	private resizeHandler(): void {
		this.event.emit("resize", window);
	}
}
