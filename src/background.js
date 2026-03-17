const id = "shorterSubjectColumn";

async function initializeColumn() {
	try {
		const rawSettings = await browser.storage.sync.get();

		let rules = [];
		if (rawSettings.rules) {
			rules = rawSettings.rules;
		} else if (rawSettings.pattern !== undefined) {
			// Migrate old setting
			rules.push({
				id: id,
				columnName: rawSettings.columnName || 'Custom subject',
				pattern: rawSettings.pattern || '^\\[[^\\]]+\\]',
				replacedText: rawSettings.replacedText || '',
			});
			await browser.storage.sync.set({ rules: rules });
		} else {
			// Default rules
			rules.push({
				id: id,
				columnName: 'Custom subject',
				pattern: '^\\[[^\\]]+\\]',
				replacedText: '',
			});
		}

		for (const rule of rules) {
			browser.customSubject.add(rule.id, rule.columnName, rule.pattern, rule.replacedText);
		}
	} catch (e) {
		console.error(`Error initializing custom subject column: ${e}`);
	}
}

initializeColumn();
