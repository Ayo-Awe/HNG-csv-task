const csv = require("csv-parser");
const fs = require("fs");

const { exit } = require("process");

function parseAtrributes(attributesString) {
  const attributes = attributesString.split(";").map((a) => a.trim());

  const parsedAttributes = attributes.map((attribute) => {
    const atr = attribute.split(":").map((a) => a.trim());
    return {
      trait_type: atr[0],
      value: atr[1],
    };
  });

  return parsedAttributes;
}

function generateChipFormat(nft) {
  return {
    format: "CHIP-0007",
    name: nft["Name"],
    description: nft["Description"],
    minting_tool: nft["TEAM NAMES"],
    sensitive_content: false,
    series_number: nft["Series Number"],
    series_total: 420,
    attributes: [
      ...parseAtrributes(nft["Attributes"]),
      {
        trait_type: "gender",
        value: nft.Gender,
      },
    ],
    collection: genCollectionData(nft.UUID),
  };
}

function genCollectionData(uuid) {
  return {
    name: "Zuri NFT Tickets for Free Lunch",
    id: uuid,
    attributes: [
      {
        type: "description",
        value: "Rewards for accomplishments during HNGi9.",
      },
    ],
  };
}

function readCSV(filename) {
  console.log("Reading csv...");
  return new Promise((resolve, reject) => {
    const results = [];

    // Read file
    const stream = fs
      .createReadStream(filename)
      .on("error", (error) => reject(error));

    // Parse csv file to object format
    stream
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("error", (e) => reject(e))
      .on("end", () => {
        let teamName = "";
        const chips = results.map((nft) => {
          if (nft["TEAM NAMES"].trim() !== "") {
            teamName = nft["TEAM NAMES"];
          }

          return {
            ...nft,
            "TEAM NAMES": teamName,
          };
        });

        resolve(chips);
      });
  });
}

module.exports = { generateChipFormat, readCSV };
