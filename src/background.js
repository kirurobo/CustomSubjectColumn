const id = "shorterSubjectColumn";

async function initializeColumn() {
	try {
		const savedItem = await browser.storage.sync.get({
			columnName: 'Custom subject',
			pattern: '^\\[[^\\]]+\\]',
			replacedText: '',
		});
		browser.customSubject.add(id, savedItem.columnName, savedItem.pattern, savedItem.replacedText);
	} catch (e) {
		console.error(`Error initializing custom subject column: ${e}`);
	}
}

initializeColumn();
