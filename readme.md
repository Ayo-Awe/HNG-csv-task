# HNG9 CSV to CHIP-0007 formatter

## Overview

The cli program generates a json file in the CHIP-0007 format for each team in the csv file.

It generates a folder called NFTs or NFTs(i) (where i is an integer greater than 0) and creates subfolders within it for each of the teams. Each subfolder contains the json files for the NFTs of the associated team.

Once the JSON files are created, a new csv is created with an additional column for the hashes of each NFT

This CLI app was written in NodeJs

![example-image](/example.png)

## Getting Started

To use this cli app, you should already have NodeJS installed. If you don't checkout [Nodejs](https://nodejs.org/en/download/)

### Installation

Clone the repository via

```bash
git clone https://github.com/Ayo-Awe/HNG-csv-task.git

cd HNG-csv-task
```

- Install package dependencies

```bash
npm install
```

- Install command globally,

```bash
npm install -g .
```

or

```bash
npm link
```

### Usage

![usage](usage.png)

**command**: gen-json

**parameters**: filename

Once you've installed the package globally, you can run the application via

```bash
gen-json csvfile.csv
```

If you try running the script on windows and you get an error similar to this

![policyError](policyError.png)

You can resolve it by running,

```ps
 Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**Note**: your file doesn't need to be named csvfile.csv
