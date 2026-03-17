// 旧バージョンでの固定ID
const id = "shorterSubjectColumn";

// デフォルトの設定
const defaultSettings = {
	"rules": [
		{
			"id": "shorterSubjectColumn",
			"ruleNo": 1,
			"columnName": "Custom subject",
			"pattern": "^\\[[^\\]]+\\]",
			"replacedText": "",
		}
	]
};

let currentRules = [];
let storedRules = [];

/**
 * 旧バージョンで保存された情報と互換性を保つための読み込み処理
 * @param {*} res 
 * @returns 
 */
function migrateSettings(res) {
	if (res.rules) {
		return res.rules;
	}
	if (res.pattern !== undefined) {
		return [{
			id: id,
			ruleNo: 1, // Fallback legacy ID integer
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

		// Apply i18n to the cloned template
		applyI18n(clone);

		// Extract integer from id if ruleNo property does not exist
		let displayId = rule.ruleNo;
		if (displayId === undefined) {
			const numMatch = rule.id.match(/\d+$/);
			displayId = numMatch ? parseInt(numMatch[0], 10) : index + 1;
		}

		clone.querySelector(".ruleNo").value = displayId;
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
	let maxNo = 0;

	// Default to examining current rules
	if (currentRules.length > 0) {
		currentRules.forEach(rule => {
			let ruleNoValue = rule.ruleNo;
			if (ruleNoValue === undefined) {
				const numMatch = rule.id.match(/\d+$/);
				if (numMatch) {
					ruleNoValue = parseInt(numMatch[0], 10);
				}
			}
			if (ruleNoValue > maxNo) {
				maxNo = ruleNoValue;
			}
		});
	}

	const newNo = maxNo + 1;

	currentRules.push({
		id: "CustomSubjectColumn_" + newNo,
		ruleNo: newNo,
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

	// Validation step: ensure IDs are unique
	const idSet = new Set();
	let hasError = false;

	ruleElements.forEach((el, index) => {
		const ruleNoInt = parseInt(el.querySelector(".ruleNo").value, 10);
		const columnName = el.querySelector(".columnName").value;
		const pattern = el.querySelector(".pattern").value;
		const replacedText = el.querySelector(".replacedText").value;

		if (isNaN(ruleNoInt)) {
			alert(browser.i18n.getMessage("options.errorInvalidId") || "Rule No must be a valid number.");
			hasError = true;
			return;
		}

		if (idSet.has(ruleNoInt)) {
			alert((browser.i18n.getMessage("options.errorDuplicateId") || "Duplicate Rule No found: ") + ruleNoInt);
			hasError = true;
			return;
		}
		idSet.add(ruleNoInt);

		try {
			if (pattern) {
				new RegExp(pattern);
			}
		} catch (e) {
			const errorMsgTpl = browser.i18n.getMessage("options.errorInvalidRegex") || "Invalid Regular Expression in Rule No {0}:\n";
			const errorMsg = errorMsgTpl.replace("{0}", ruleNoInt);
			alert(errorMsg + e.message);
			hasError = true;
			return;
		}

		const ruleId = "CustomSubjectColumn_" + ruleNoInt;

		newRules.push({
			id: ruleId,
			ruleNo: ruleNoInt,
			columnName: columnName,
			pattern: pattern,
			replacedText: replacedText
		});
	});

	if (hasError) {
		return;
	}

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

		// currentRules を ruleNo でソートする
		currentRules.sort((a, b) => a.ruleNo - b.ruleNo);

		storedRules = JSON.parse(JSON.stringify(currentRules));
		renderRules();

		// 設定を適用して保存
		_saveOptions();
	});
	// 全体に対して翻訳を適用
	applyI18n(document);
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

/**
 * data-i18n属性を持つ要素のテキストをロケールに合わせて置換
 * @param {*} element 
 */
function applyI18n(element) {
	const i18nElements = element.querySelectorAll("[data-i18n]");
	for (const el of i18nElements) {
		const messageName = el.dataset.i18n;
		if (messageName) {
			el.innerText = browser.i18n.getMessage(messageName) || messageName;
		}
	}
}

document.addEventListener('DOMContentLoaded', reloadOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
document.querySelector("#initialize").addEventListener("click", _confirmResetOptions);
document.getElementById("addRule").addEventListener("click", addRule);
