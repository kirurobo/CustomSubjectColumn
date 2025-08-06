// 旧バージョンでの固定ID
const id = "shorterSubjectColumn";

// このアドオンの列につけるID接頭辞
const idPrefix = "CustomSubjectColumn_";

// デフォルトの設定
const defaultSettings = {
	// デフォルトのパターンは、件名先頭の[]で囲まれた文字列を除去
	"pattern": "^\\[[^\\]]+\\]",
	"columnName": "Custom subject",
	"replacedText": "",
};

// 現時点での設定JSON表現
var currentOptionsJson = null;

/**
 * JSONファイルから設定を読み込む
 * @param {*} file 
 * @returns json
 */
function loadDefaultOptionsJson(file) {
	var reader = new FileReader();
	reader.onload = function () {
		currentOptionsJson = JSON.parse(reader.result);
	}
	reader.readAsText(file);
}

/**
 * 現在のJSONから設定を読み込む
 */
function loadOptions() {
	
}

/**
 * 設定を保存する
 * @param {*} e 
 */
function saveOptions(e) {
	_saveOptions();
	e.preventDefault();
}

/**
 * 設定保存の内部処理
 */
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
	//browser.customSubject.remove(idPrefix);
	//browser.customSubject.add(idPrefix, columnName, pattern, replacedText);
}

/**
 * 設定を読み込む
 */
function reloadOptions() {
	var getSettings = browser.storage.sync.get({
		columnName: defaultSettings.columnName,
		pattern: defaultSettings.pattern,
		replacedText: defaultSettings.replacedText,
	});
	getSettings.then((res) => {
		document.querySelector("#pattern").value = res.pattern;
		document.querySelector("#columnName").value = res.columnName;
		document.querySelector("#replacedText").value = res.replacedText;

		// 設定を適用して保存
		_saveOptions();
	});
}

/**
 * 設定を初期化する
 */
function resetOptions() {
	var clearStorage = browser.storage.sync.clear();
	clearStorage.then(() => {
		document.querySelector("#pattern").value = defaultSettings.pattern;
		document.querySelector("#columnName").value = defaultSettings.columnName;
		document.querySelector("#replacedText").value = defaultSettings.replacedText;

		_saveOptions();
	});
}

/**
 * 設定初期化の確認ダイアログを表示する
 */
function _confirmResetOptions() {
	const messsage = browser.i18n.getMessage("options.confirmInitialize")
	 || "Are you sure you want to initialize the settings?";

	if (confirm(messsage)) {
		resetOptions();
	}
}


document.addEventListener('DOMContentLoaded', reloadOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
document.querySelector("#initialize").addEventListener("click", _confirmResetOptions);
