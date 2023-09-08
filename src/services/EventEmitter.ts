export class EventEmitter<T = any> {
	events: Record<string, Array<(data: T) => void>> = {};

	on(event: string, listener: (data: T) => void) {
		if (!this.events[event]) {
			this.events[event] = [];
		}
		this.events[event].push(listener);
		return () => this.off(event, listener);
	}

	off(event: string, listener: (data: T) => void) {
		if (!this.events[event]) return;
		const index = this.events[event].indexOf(listener);
		if (index !== -1) {
			this.events[event].splice(index, 1);
		}
	}

	emit(event: string, data: T) {
		if (!this.events[event]) return;
		for (const listener of this.events[event]) {
			listener(data);
		}
	}
}