import { Int } from '../interfaces/int.type';

export const roundToInt = (num: number): Int => Math.round(num) as Int;
