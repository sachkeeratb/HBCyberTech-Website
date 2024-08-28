# HB CyberTech Website

This is a website created for the HB CyberTech club. The website serves as a platform to share information, connect with members, and organize activities and workshops.

## Table of Contents

- [Introduction](#introduction)
- [Purpose](#purpose)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)

## Introduction

HB CyberTech is a club focused on CyberSecurity, Embedded Programming, and more. This website serves as a platform to share information, connect with members, and organize activities and workshops.

## Purpose

- **Informational Learning Sessions**: Gain knowledge on various topics through engaging slideshows.
- **Networking**: Connect with like-minded individuals and potential employers.
- **Activities and Workshops**: Participate in hands-on activities and workshops to learn through application.
- **Community**: Join a passionate community where you can ask questions, share knowledge, and help others.

## Features

- **Forum**: Create posts, comment on posts, and engage with the community.
- **Users**: Sign up, sign in, and verify accounts through email.
- **Password Hashing**: Securely hash user passwords before storing them in the database.
- **Verification**: All values are verified before usage. No value slips up.

## Installation

### Prerequisites

- Node.js
- pnpm (or npm/yarn)
- Rust (for the server)

### Client

1. Navigate to the `client` directory:

   ```sh
   cd client
   ```

2. Install dependencies:

   ```sh
   pnpm install
   ```

3. Create a `.env` file based on `.env.example` and configure the environment variables.

### Server

1. Navigate to the `server` directory:

   ```sh
   cd server
   ```

2. Install dependencies:

   ```sh
   cargo build
   ```

3. Create a `.env` file based on `.env.example` and configure the environment variables.

## Usage

### Client

1. Start the client development server:

   ```sh
   pnpm run dev
   ```

2. Open your browser and navigate to `http://localhost:5173`.

### Server

1. Start the server:

   ```sh
   cargo run
   ```

2. The server will be running on `http://HOST:PORT`, where HOST and PORT are .env values.
