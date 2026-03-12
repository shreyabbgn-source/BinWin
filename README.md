# BinWin: Smart Waste Segregation and Reward System

BinWin is a prototype application designed to encourage proper waste segregation using a QR-based system. Users scan a QR code placed on a dustbin to identify the type of waste it accepts such as plastic, metal, or organic waste and receive reward points for disposing of waste correctly.

The goal of BinWin is to promote sustainable waste management through technology and gamification.

## Features

• QR code scanning for smart dustbin identification
• Waste segregation guidance for different waste categories
• Reward points for responsible waste disposal
• Cloud based data storage using Firebase
• Fast frontend built with Vite and TypeScript

## Project Architecture

### Frontend

Vite
TypeScript
HTML and CSS

Provides the user interface for QR scanning, waste information display, and user interaction.

### Backend and Cloud Services

Firebase

Handles user data storage, reward point tracking, and real time database management.

## Project Structure

```
BinWin
│
├── src/                    Application source code
├── index.html              Main entry point
├── firebase-applet-config.json
├── firebase-blueprint.json
├── firestore.rules         Database rules
├── metadata.json
├── vite.config.ts          Vite configuration
├── package.json            Project dependencies
└── tsconfig.json           TypeScript configuration
```

## Installation

Clone the repository

```
git clone https://github.com/shreyabbgn-source/BinWin
```

Install dependencies

```
npm install
```

Run the development server

```
npm run dev
```

## Tech Stack

TypeScript
Vite
Firebase
HTML and CSS

## Future Improvements

AI based waste classification using image recognition
Mobile application version for Android and iOS
Smart bin sensors to detect bin capacity
City wide reward system for recycling
