import { WordItem, CategoryId } from '../../types/game';
import { FOOD_WORDS } from './food';
import { PLACES_WORDS } from './places';
import { MOVIES_WORDS } from './movies';
import { SPORTS_WORDS } from './sports';
import { ANIMALS_WORDS } from './animals';
import { GAMES_WORDS } from './games';
import { DAILY_WORDS } from './daily';
import { KERALA_WORDS } from './kerala';
import { FUN_WORDS } from './fun';

export const ALL_WORDS: WordItem[] = [
  ...FOOD_WORDS,
  ...PLACES_WORDS,
  ...MOVIES_WORDS,
  ...SPORTS_WORDS,
  ...ANIMALS_WORDS,
  ...GAMES_WORDS,
  ...DAILY_WORDS,
  ...KERALA_WORDS,
  ...FUN_WORDS,
];

export function getFilteredWords(
  selectedCategories: (CategoryId | 'all')[],
  difficulty: 'all' | 'easy' | 'medium' | 'hard'
): WordItem[] {
  let pool = ALL_WORDS;

  if (!selectedCategories.includes('all') && selectedCategories.length > 0) {
    pool = pool.filter(item => selectedCategories.includes(item.category));
  }

  if (difficulty !== 'all') {
    const diffPool = pool.filter(item => item.difficulty === difficulty);
    // If strict filter leaves too few, fallback to entire filtered category pool
    if (diffPool.length >= 5) {
      pool = diffPool;
    }
  }

  return pool;
}

export function pickRandomWord(
  selectedCategories: (CategoryId | 'all')[],
  difficulty: 'all' | 'easy' | 'medium' | 'hard',
  excludeIds: string[] = []
): WordItem {
  const pool = getFilteredWords(selectedCategories, difficulty).filter(
    item => !excludeIds.includes(item.id)
  );

  const finalPool = pool.length > 0 ? pool : ALL_WORDS;
  const randomIndex = Math.floor(Math.random() * finalPool.length);
  return finalPool[randomIndex];
}
