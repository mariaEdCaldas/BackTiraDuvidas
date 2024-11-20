import { Between, LessThan, MoreThan } from "typeorm";

export function WithinRange(start: unknown, stop: unknown) {
  if(start && stop) {
    return Between(start, stop);
  } else if(start) {
    return MoreThan(start);
  } else if(stop) {
    return LessThan(stop);
  }

  return null;
}
