import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const client = new OpenAI();

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

let dataset = `Al's Plumbing Heating & Cooling LLC P.O. Box 2106 Los Angeles
303 Fire Auto Body Shop 403 North Carolina Ave San Francisco
B-6 Fire House 1420 Steph Rd SE Ste. 107 Rio Rancho
A #1 Air Fakeairline Inc 773 Carlos Avenue #416 Santa Fe
Harriett Goodman (EMP) 123 Crockett Ct Cincinnati`;

let fullPrompt = `${FIXED_PROMPT}\n${EXAMPLE_DATA}${dataset}\n\n\n${EXAMPLE_RESPONSE}`;

const response = await client.responses.create({
    model: "gpt-5",
    reasoning: { effort: "low" },
    // instructions: "",
    input: fullPrompt,
});

console.log(response.output_text);