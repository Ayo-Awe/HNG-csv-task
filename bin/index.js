#!/usr/bin/env node

const { exit } = require("process");
const { generateChipFormat, readCSV } = require("../utils/helpers");
const prettier = require("prettier");
const crypto = require("crypto");
const fs = require("fs");
const { stringify } = require("csv-stringify");
const args = process.argv;

if (args.length !== 3) {
  console.log("Usage: gen-json filename.csv");
  exit(1);
}

readCSV(args[2]).then((data) => {
  console.log("CSV successfully read!");

  // Create folder to store all NFTs
  const folderName = createNFTFolder();

  // Generate nft files forEach team in NFT folder
  data.forEach((nft, i) => GenerateNFTFiles(nft, i, data, folderName));

  console.log("Successfully generated json files for all NFTs");

  console.log("Creating new CSV with hash");

  createNewCSV("updatedCSV.csv", data);

  console.log("Successfully created new csv file, you're good to go!!");
});

function createNFTFolder() {
  let folderName = "NFTs";
  let count = 0;

  // If folder name exists, generate new folder name e.g NFTs(2)
  while (fs.existsSync(folderName)) {
    folderName = `NFTs(${++count})`;
  }

  // Create folder with new folder name
  fs.mkdir(folderName, (err) => {
    if (err) {
      console.log(`Error: Unable to create folder ${folderName}`);
      exit(1);
    }
  });

  return folderName;
}

function generateTeamFolder(subFolder) {
  // Create subfolder for team nft if it doesn't already exist
  if (!fs.existsSync(subFolder))
    fs.mkdir(subFolder, (err) => {
      if (err) {
        console.log(err.message);
        exit(1);
      }
    });
}

function writeJsonToFile(json, path) {
  // Create write stream to file path
  const stream = fs.createWriteStream(path);

  // Write json to file
  stream.write(json);

  // End write stream
  stream.end();
}

function GenerateNFTFiles(nft, i, data, folderName) {
  // Generate an object representation of the chip format
  const objectFormatNft = generateChipFormat(nft);

  // Parse chip formatted object to json
  const json = prettier.format(JSON.stringify(objectFormatNft), {
    parser: "json-stringify",
  });

  // Generate the sha256 hash for the json file
  const hash = crypto.createHash("sha256").update(json).digest("hex");

  // Create Hash column in csv
  data[i].HASH = hash;

  // Subfolder for NFT for each team
  const subFolder = `./${folderName}/${nft["TEAM NAMES"]}`;
  generateTeamFolder(subFolder);

  // Write json to file
  const path = `${subFolder}/${nft["Filename"]}.json`;
  writeJsonToFile(json, path);
}

function createNewCSV(filename, data) {
  const writableStream = fs.createWriteStream(filename);
  const columns = [...Object.keys(data[0])];
  const stringifier = stringify({ columns, header: true });

  data.forEach((d) => stringifier.write(d));

  stringifier.pipe(writableStream);
}
