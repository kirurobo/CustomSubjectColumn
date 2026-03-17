// 旧バージョンでの固定ID
const id = "shorterSubjectColumn";

// デフォルトの設定
const defaultSettings = {
	"rules": [
		{
			"id": "shorterSubjectColumn",
			"columnName": "Custom subject",
			"pattern": "^\\[[^\\]]+\\]",
			"replacedText": "",
		}
	]
};

let currentRules = [];
let storedRules = [];

function migrateSettings(res) {
	if (res.rules) {
		return res.rules;
	}
	if (res.pattern !== undefined) {
		return [{
			id: id,
			columnName: res.columnName || defaultSettings.rules[0].columnName,
			pattern: res.pattern || defaultSettings.rules[0].pattern,
			replacedText: res.replacedText || defaultSettings.rules[0].replacedText
		}];
	}
	return JSON.parse(JSON.stringify(defaultSettings.rules));
}

function renderRules() {
	const container = document.getElementById("rulesContainer");
	container.innerHTML = "";
	const template = document.getElementById("ruleTemplate");

	currentRules.forEach((rule, index) => {
		const clone = template.content.cloneNode(true);
		clone.querySelector(".columnName").value = rule.columnName;
		clone.querySelector(".pattern").value = rule.pattern;
		clone.querySelector(".replacedText").value = rule.replacedText || "";

		clone.querySelector(".removeRule").addEventListener("click", () => {
			currentRules.splice(index, 1);
			renderRules();
		});

		container.appendChild(clone);
	});
}

function addRule() {
	currentRules.push({
		id: "CustomSubjectColumn_" + crypto.randomUUID(),
		columnName: "New Column",
		pattern: ".*",
		replacedText: ""
	});
	renderRules();
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
async function _saveOptions() {
	// 1. Read values from DOM
	const container = document.getElementById("rulesContainer");
	const ruleElements = container.querySelectorAll(".rule-field");
	const newRules = [];

	ruleElements.forEach((el, index) => {
		const ruleId = currentRules[index].id;
		const columnName = el.querySelector(".columnName").value;
		const pattern = el.querySelector(".pattern").value;
		const replacedText = el.querySelector(".replacedText").value;

		newRules.push({
			id: ruleId,
			columnName: columnName,
			pattern: pattern,
			replacedText: replacedText
		});
	});

	currentRules = newRules;

	// 2. Clear old columns from Thunderbird
	for (const rule of storedRules) {
		browser.customSubject.remove(rule.id);
	}

	await browser.storage.sync.set({ rules: currentRules });

	// 3. Add new columns to Thunderbird
	for (const rule of currentRules) {
		browser.customSubject.add(rule.id, rule.columnName, rule.pattern, rule.replacedText);
	}

	storedRules = JSON.parse(JSON.stringify(currentRules));
}

/**
 * 設定を読み込む
 */
function reloadOptions() {
	var getSettings = browser.storage.sync.get();
	getSettings.then((res) => {
		currentRules = migrateSettings(res);
		storedRules = JSON.parse(JSON.stringify(currentRules));
		renderRules();

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
		for (const rule of storedRules) {
			browser.customSubject.remove(rule.id);
		}

		currentRules = JSON.parse(JSON.stringify(defaultSettings.rules));
		storedRules = [];
		renderRules();

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
document.getElementById("addRule").addEventListener("click", addRule);
