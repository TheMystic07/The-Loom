# <h1 align="center">The Loom</h1>

## Welcome to The Loom

The Loom is an on-chain metaverse world built on AO where you can hold meetings and interact with others using your avatar. Enjoy text chat, video chat, and voice chat capabilities to connect and communicate seamlessly in this virtual environment.

[![protocol.land](https://arweave.net/eZp8gOeR8Yl_cyH9jJToaCrt2He1PHr0pR4o-mHbEcY)](https://protocol.land/#/repository/<REPO_ID>)

# Index

- [Welcome to The Loom](#welcome-to-the-loom)
- [Index](#index)
  - [Techstack](#techstack)
  - [Features](#features)
- [How to setup](#how-to-setup)
  - [Clone the repo](#clone-the-repo)
  - [Install dependencies in Client Directory](#install-dependencies-in-client-directory)
  - [Install dependencies in Server Directory](#install-dependencies-in-server-directory)
  - [ArConnect Wallet](#arconnect-wallet)
- [Finally run the webapp](#finally-run-the-webapp)
- [License](#license)

## Techstack
     
    - ThreeJS
    - Vite + ReactJS with Javascript
    - TailwindCSS
    - LUA
    - AO

## Features
### The Loom has three main maps:
- **Loom City**: A general map where people can meet and interact.
- **Hangar**: A place to showcase projects. Each project has a personal AI agent that visitors can interact with to learn more about the project by writing prompts.
- **Custom Room**: A customizable space that individuals or organizations can rent and furnish according to their needs by purchasing furniture from our store.

### Loom Features:
- **AI Agents**: Interact with personal AI agents for each showcased project to get detailed information by writing prompts.
- **Video, Voice, and Text Chat**: Communicate effortlessly with other users through integrated video, voice, and text chat features.
- **Renting Spaces**: Rent out spaces for meetings or events and customize them as per your requirements.
- **Build Your Space**: Personalize your rented space by buying and placing furniture from our store.
- **Avatar Skins**: Purchase unique avatar skins from the store to personalize your virtual presence.

# How to setup

## Clone the repo

Fork and clone the repo

```bash
git clone -b dev git@github.com:TheMystic07/The-Loom.git
cd The-Loom
```

## Install dependencies in Client Directory

```bash
cd client
yarn install
cd ..
```

## Install dependencies in Server Directory

```bash
cd server
npm install
```

## ArConnect Wallet
If you don't have ArConnect Wallet then [click here](https://www.arconnect.io/download) to download the wallet on your browser.

After downloading the wallet setup your wallet to use the The Loom

# Finally run the webapp

Go to the server directory and run this command
```bash
npm run start
```
And same go to the client directory and run this command
```bash
yarn dev
```

The webapp will be running on `localhost:5173`

To open the same application of another device for testing purposes, make sure that the device is connected to the same network as the device on which the webapp is running. Then visit `http://<IP_ADDRESS_OF_THE_DEVICE_RUNNING_THE_WEBAPP>:5713`

# License

The projects is licensed under [MIT](https://choosealicense.com/licenses/mit/)
