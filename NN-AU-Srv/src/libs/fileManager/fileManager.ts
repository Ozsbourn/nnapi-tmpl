


class FileManager {
	_lastFile: string;

	constructor() {
		this._lastFile = '';
	};

	getLastFile = () => {
		return this._lastFile;
	};
};

export const fm = FileManager();