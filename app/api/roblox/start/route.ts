import { NextResponse } from "next/server";

const words = [
  "Tiger",
  "Moon",
  "Rocket",
  "Pixel",
  "Nova",
  "Shadow",
  "Fire",
  "Cloud",
  "Storm",
  "Galaxy",
  "Neon",
  "Wolf",
  "River",
  "Star",
  "Crystal",
  "Thunder",
  "Comet",
  "Ocean",
  "Dragon",
  "Frost",
  "Lightning",
  "Cosmic",
  "Ruby",
  "Silver",
];

function generateVerificationCode() {
  const picked: string[] = [];

  while (picked.length < 8) {
    const word = words[Math.floor(Math.random() * words.length)];

    if (!picked.includes(word)) {
      picked.push(word);
    }
  }

  return picked.join(" ");
}

export async function POST() {
  const verificationCode = generateVerificationCode();

  return NextResponse.json({
    verificationCode,
  });
}
