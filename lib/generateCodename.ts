const adjectives = [
  "Silent",
  "Swift",
  "Clever",
  "Shadow",
  "Phantom",
  "Velvet",
  "Crimson",
  "Golden",
  "Rogue",
  "Midnight",
];

const roles = [
  "Fox",
  "Falcon",
  "Viper",
  "Ghost",
  "Baron",
  "Lynx",
  "Jackal",
  "Raven",
  "Wolf",
  "Cobra",
];

const objects = [
  "Vault",
  "Heist",
  "Cipher",
  "Crown",
  "Dagger",
  "Torch",
  "Masque",
  "Gambit",
  "Alibi",
  "Caper",
];

function pickRandom(words: string[]): string {
  return words[Math.floor(Math.random() * words.length)];
}

export function generateCodename(): string {
  return pickRandom(adjectives) + pickRandom(roles) + pickRandom(objects);
}
