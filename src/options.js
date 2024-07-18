const id = "shorterSubjectColumn";
const defaultSettings = {
	// デフォルトのパターンは、件名先頭の[]で囲まれた文字列を除去
	"pattern": "^\\[[^\\]]+\\]",
	"columnName": "Custom subject",
	"replacedText": "",
};

function _saveOptions() {
	let pattern = document.querySelector("#pattern").value;
	let columnName = document.querySelector("#columnName").value;
	let replacedText = document.querySelector("#replacedText").value;

	browser.storage.sync.set({
		pattern: pattern,
		columnName: columnName,
		replacedText: replacedText,

	});

	browser.customSubject.remove(id);
	browser.customSubject.add(id, columnName, pattern, replacedText);
}

function saveOptions(e) {
	_saveOptions();
	e.preventDefault();
}

function reloadOptions() {
	var getSettings = browser.storage.sync.get({
		columnName: defaultSettings.columnName,
		pattern: defaultSettings.pattern,
		replacedText: defaultSettings.replacedText,
	});
	getSettings.then((res) => {
		//browser.customSubject.remove(id);
		//browser.customSubject.add(id, res.columnName, res.pattern, res.replacedText);
		document.querySelector("#pattern").value = res.pattern;
		document.querySelector("#columnName").value = res.columnName;
		document.querySelector("#replacedText").value = res.replacedText;
	});
}

function restoreOptions() {
	// var savedItem = browser.storage.sync.get({
	// 	columnName: defaultSettings.columnName,
	// 	pattern: defaultSettings.pattern,
	// 	replacedText: defaultSettings.replacedText,
	// });
	// savedItem.then((res) => {
	// 	document.querySelector("#pattern").value = res.pattern;
	// 	document.querySelector("#columnName").value = res.columnName;
	// 	document.querySelector("#replacedText").value = res.replacedText;
	// });

	var clearStorage = browser.storage.sync.clear();
	clearStorage.then(() => {
		document.querySelector("#pattern").value = defaultSettings.pattern;
		document.querySelector("#columnName").value = defaultSettings.columnName;
		document.querySelector("#replacedText").value = defaultSettings.replacedText;

		_saveOptions();
	});
}

function confirmInitialize() {
	const messsage = browser.i18n.getMessage("options.confirmInitialize")
	 || "Are you sure you want to initialize the settings?";

	if (confirm(messsage)) {
		restoreOptions();
	}
}


document.addEventListener('DOMContentLoaded', reloadOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
document.querySelector("#initialize").addEventListener("click", confirmInitialize);
