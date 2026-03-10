const MAX_TOKENS = 4097 - 1800;
const MAX_DATA_LENGTH = 3200;
var responseArr = [];
// var logStream;
const FIXED_PROMPT = 
	"Organise vendor data into columns:\n" +
	"Missing data = ' '.\n" + 
	"If vendor name is a person, copy name into Contact Name.\n" +
	"If address ends with unit, apt, ste, FL, or other #, put it in Address Line 2.\n" +
	"Include anything in () in the Vendor name.\n";
	// "Change 'P.O. Box' to 'PO Box'.\n" +
	// "Fields may sometimes appear out of order, sort them accordingly.\n"
const EXAMPLE_DATA = 
	"Vendors List:\n" + 
	"Ted's Plumbing Heating & Cooling LLC P.O. Box 1286 Los Angeles\n" +
	"Abelardo Miramontes Bright Colors Paint 8635 Saguenay Ste 670, Brossard, Quebec, J4X 1P3, Canada\n" +
	"\n" +
	"1905 Wyoming Blvd Albuquerque, NM 87112\n";
const EXAMPLE_RESPONSE = 
	"Vendor Name|Contact Name|Address Line 1|Address Line 2|City|State|Zip|Country\n" + 
	"Ted's Plumbing Heating & Cooling LLC| |PO Box 1286| |Los Angeles| | | \n" +
	"Bright Colors Paint|Abelardo Miramontes|8635 Saguenay|Ste 670|Brossard|QC|J4X 1P3|Canada\n" +
	" | | | | | | \n" +
	" | |1905 Wyoming Blvd| |Albuquerque|NM|87112| \n";
const DATALESS_PROMPT_LENGTH = (FIXED_PROMPT + EXAMPLE_DATA + EXAMPLE_RESPONSE).length;

async function modifyDataset(prompt, index, dataset) {
	let fullPrompt = `${FIXED_PROMPT}\n${EXAMPLE_DATA}${dataset}\n\n\n${EXAMPLE_RESPONSE}`;
	try {
		const response = await fetch("/api/parse", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ fullPrompt }),
		});

		if (!response.ok) {
			console.error("API error status:", response.status);
			alert("Error: backend API call failed.");
			return "";
		}

		const data = await response.json();

		if (!data || typeof data.text !== "string") {
			console.error("Unexpected API response:", data);
			alert("Error: Unexpected response from backend API.");
			return "";
		}

		responseArr[index] = data.text;
		return data.text;
	} catch (err) {
		console.error("Error calling backend API:", err);
		alert("Error: Could not reach backend API.");
		return "";
	}
}

	// Parse the modified dataset into a table
	var table = document.createElement("table");

async function generateClicked() {
	const prompt = document.getElementById("prompt").value;
	const dataset = document.getElementById("dataset").value;
	const outputTable = document.getElementById("output-table");
	outputTable.innerHTML = "";
	// logStream = window.open("log.txt", "Log");

	// Show loading spinner
	const loadingSpinner = document.getElementById("loading-spinner");
	const loadingProgress = document.getElementById("loading-progress");
	loadingSpinner.style.display = "block";
	loadingProgress.style.display = "block";
	loadingProgress.innerText = `Analyzing...0%`;

	let startIndex = 0;
	let endIndex = 1;
	if (startIndex + MAX_DATA_LENGTH < dataset.length) {
		endIndex = dataset.indexOf("\n", startIndex + MAX_DATA_LENGTH) + 1;
	} else {
		endIndex = dataset.length;
	}
	var completedRequests = 0;
	var totalRequests = 0;


	const headerRow = document.createElement("tr");
	headerRow.appendChild(document.createElement("th")).appendChild(document.createTextNode("Vendor Name"));
	headerRow.appendChild(document.createElement("th")).appendChild(document.createTextNode("Contact Name"));
	headerRow.appendChild(document.createElement("th")).appendChild(document.createTextNode("Address Line 1"));
	headerRow.appendChild(document.createElement("th")).appendChild(document.createTextNode("Address Line 2"));
	headerRow.appendChild(document.createElement("th")).appendChild(document.createTextNode("City"));
	headerRow.appendChild(document.createElement("th")).appendChild(document.createTextNode("State"));
	headerRow.appendChild(document.createElement("th")).appendChild(document.createTextNode("Zip Code"));
	headerRow.appendChild(document.createElement("th")).appendChild(document.createTextNode("Country"));
	table.appendChild(headerRow);

	const updateProgress = () => {
		completedRequests++;
		const progress = Math.floor((completedRequests / totalRequests) * 100);
		loadingProgress.innerText = `Analyzing... ${progress}%\n(${completedRequests} / ${totalRequests})`;

		table.innerHTML = "";

		const headerRow = document.createElement("tr");
		headerRow.appendChild(document.createElement("th")).appendChild(document.createTextNode("Vendor Name"));
		headerRow.appendChild(document.createElement("th")).appendChild(document.createTextNode("Contact Name"));
		headerRow.appendChild(document.createElement("th")).appendChild(document.createTextNode("Address Line 1"));
		headerRow.appendChild(document.createElement("th")).appendChild(document.createTextNode("Address Line 2"));
		headerRow.appendChild(document.createElement("th")).appendChild(document.createTextNode("City"));
		headerRow.appendChild(document.createElement("th")).appendChild(document.createTextNode("State"));
		headerRow.appendChild(document.createElement("th")).appendChild(document.createTextNode("Zip Code"));
		headerRow.appendChild(document.createElement("th")).appendChild(document.createTextNode("Country"));
		table.appendChild(headerRow);

		for (let a = 0; a < responseArr.length; a++) {
			if (responseArr[a] == null) return;
			const rows = responseArr[a].split("\n");

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
				while (row.childElementCount < 8) {
					const cell = document.createElement("td");
					cell.appendChild(document.createTextNode(""));
					row.appendChild(cell);
				}
				table.appendChild(row);
			}
		}

		// const rows = modifiedDataset.split("\n");

		// for (let i = 0; i < rows.length; i++) {
		// 	if (rows[i].trim() === "") {
		// 		continue;
		// 	}
		// 	const cells = rows[i].split("|");
		// 	const row = document.createElement("tr");
		// 	for (let j = 0; j < cells.length; j++) {
		// 		const cell = document.createElement("td");
		// 		cell.appendChild(document.createTextNode(cells[j]));
		// 		row.appendChild(cell);
		// 	}
		// 	while (row.childElementCount < 7) {
		// 		const cell = document.createElement("td");
		// 		cell.appendChild(document.createTextNode(""));
		// 		row.appendChild(cell);
		// 	}
		// 	table.appendChild(row);
		// }
		outputTable.appendChild(table);

		if (progress == 100) {
			// Hide loading spinner and percent
			document.getElementById("loading-spinner").style.display = "none";
			document.getElementById("loading-progress").style.display = "none";
			//Close the logfile
			// logStream.close();
		}
	};
	let finishedLoop = false;
	// while (!finishedLoop || (startIndex == 0) && (endIndex == 0)) {
	// 	if (endIndex == 0) {
	// 		finishedLoop = true;
	// 		endIndex = dataset.length - 1;
	// 	}
	// 	const input = dataset.substring(startIndex, endIndex);
	// 	modifyDataset(prompt, totalRequests, input).then((data) => {
	// 		updateProgress(data);
	// 	});
	// 	totalRequests++;
	// 	startIndex = endIndex;
	// 	endIndex = dataset.indexOf("\n", startIndex + MAX_TOKENS) + 1;
	// }

	while (!finishedLoop) {
		endIndex = dataset.indexOf("\n", startIndex + MAX_DATA_LENGTH) + 1;
		if (endIndex == 0) {
			finishedLoop = true;
			endIndex = dataset.length - 1;
		}
		const input = dataset.substring(startIndex, endIndex);
		modifyDataset(prompt, totalRequests, input).then((data) => {
			updateProgress();
		});
		totalRequests++;
		startIndex = endIndex;
	}
	loadingProgress.innerText = `Analyzing... 0%\n(0 / ${totalRequests} requests filled)`;

}

function copyClicked() {
	// Get a reference to the table element
	// let table = document.getElementById("output-table");

	// Create a range object
	let range = document.createRange();

	// Select the table contents
	range.selectNodeContents(table);

	// Create a selection object
	let selection = window.getSelection();

	// Remove any existing selections
	selection.removeAllRanges();

	// Add the range to the selection
	selection.addRange(range);

	// Copy the selection to clipboard
	document.execCommand("copy");

	// Alert the user
	alert("Table content copied to clipboard!");
}