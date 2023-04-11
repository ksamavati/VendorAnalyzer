const API_KEY = "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";
const MAX_TOKENS = 2048;

async function modifyDataset(prompt, dataset) {
	const RESPONSE_PILOT = "\n\nBusiness Name|Contact Name|Address|City|State|Zip\n";
	const apiUrl = "https://api.openai.com/v1/engines/text-davinci-003/completions";
	let requestBody = {
		prompt: `Input data: ${dataset} Modification: ${prompt}${RESPONSE_PILOT}`,
		max_tokens: MAX_TOKENS,
		temperature: 0.5,
		n: 1,
	};
	const headers = {
		"Content-Type": "application/json",gh
		Authorization: `Bearer ${API_KEY}`,
	};
	const response = await fetch(apiUrl, {
		method: "POST",
		headers: headers,
		body: JSON.stringify(requestBody),
	});
	const data = await response.json();
	// progressCallback();
	return data.choices[0].text;
}

async function modifyAndDisplayDataset() {
	const prompt = document.getElementById("prompt").value;
	const dataset = document.getElementById("dataset").value;
	const outputTable = document.getElementById("output-table");
	outputTable.innerHTML = "";

	// Show loading spinner
	const loadingSpinner = document.getElementById("loading-spinner");
	const loadingProgress = document.getElementById("loading-progress");
	loadingSpinner.style.display = "block";
	loadingProgress.style.display = "block";
	loadingProgress.innerText = `Analyzing...0%`;

	let modifiedDataset = "";
	let startIndex = 0;
	let endIndex = 0;
	if (startIndex + MAX_TOKENS < dataset.length) {
		endIndex = dataset.indexOf("\n", startIndex + MAX_TOKENS) + 1;
	} else {
		endIndex = dataset.length;
	}
	var completedRequests = 0;
	var totalRequests = 0;

	// Parse the modified dataset into a table
	var table = document.createElement("table");

	const headerRow = document.createElement("tr");
	headerRow.appendChild(document.createElement("th")).appendChild(document.createTextNode("Vendor Name"));
	headerRow.appendChild(document.createElement("th")).appendChild(document.createTextNode("Contact Name"));
	headerRow.appendChild(document.createElement("th")).appendChild(document.createTextNode("Address"));
	headerRow.appendChild(document.createElement("th")).appendChild(document.createTextNode("City"));
	headerRow.appendChild(document.createElement("th")).appendChild(document.createTextNode("State"));
	headerRow.appendChild(document.createElement("th")).appendChild(document.createTextNode("Zip Code"));

	table.appendChild(headerRow);

	const updateProgress = (modifiedDataset) => {
		completedRequests++;
		const progress = Math.floor((completedRequests / totalRequests) * 100);
		loadingProgress.innerText = `Analyzing...${progress}%`;

		const rows = modifiedDataset.split("\n");

		for (let i = 0; i < rows.length; i++) {
			if (rows[i].trim() === "") {
				continue;
			}
			const cells = rows[i].split("|");
			const row = document.createElement("tr");
			for (let j = 0; j < cells.length; j++) {
				const cell = document.createElement("td");
				cell.appendChild(document.createTextNode(cells[j]));
				row.appendChild(cell);
			}
			while (row.childElementCount < 5) {
				const cell = document.createElement("td");
				cell.appendChild(document.createTextNode(""));
				row.appendChild(cell);
			}
			table.appendChild(row);
		}
		outputTable.appendChild(table);

		if (progress == 100) {
			// Hide loading spinner and percent
			document.getElementById("loading-spinner").style.display = "none";
			document.getElementById("loading-progress").style.display = "none";
		}
	};

	while (endIndex !== 0) {
		const input = dataset.substring(startIndex, endIndex);
		totalRequests++;
		// modifiedDataset += await modifyDataset(prompt, input, updateProgress);
		// modifiedDataset +=
		modifyDataset(prompt, input).then((data) => {
			updateProgress(data);
		});
		startIndex = endIndex;
		endIndex = dataset.indexOf("\n", startIndex + MAX_TOKENS) + 1;
	}

	//   // Parse the modified dataset into a table
	//   const table = document.createElement("table");

	//   const headerRow = document.createElement("tr");
	//   headerRow.appendChild(document.createElement("th")).appendChild(document.createTextNode("Client Name"));
	//   headerRow.appendChild(document.createElement("th")).appendChild(document.createTextNode("Address"));
	//   headerRow.appendChild(document.createElement("th")).appendChild(document.createTextNode("City"));
	//   headerRow.appendChild(document.createElement("th")).appendChild(document.createTextNode("State"));
	//   headerRow.appendChild(document.createElement("th")).appendChild(document.createTextNode("Zip Code"));
	//   table.appendChild(headerRow);

	//   const rows = modifiedDataset.split("\n");

	//   for (let i = 0; i < rows.length; i++) {
	//     if (rows[i].trim() === "") {
	//       continue;
	//     }
	//     const cells = rows[i].split("|");
	//     const row = document.createElement("tr");
	//     for (let j = 0; j < cells.length; j++) {
	//       const cell = document.createElement("td");
	//       cell.appendChild(document.createTextNode(cells[j]));
	//       row.appendChild(cell);
	//     }
	//     table.appendChild(row);
	//   }
	//   outputTable.appendChild(table);
}
