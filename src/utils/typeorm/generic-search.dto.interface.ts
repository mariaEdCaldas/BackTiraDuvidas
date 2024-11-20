export type RangeValue<Entity, K extends keyof Entity> = Partial<{ from: Entity[K], to: Entity[K]}>
//type IsArray<T> = T extends Array<any> ? true : false;
type IsDate<T> = T extends Date ? true : false;
type IsNumber<T> = T extends number ? true : false;
type IsString<T> = T extends string ? true : false;

export type GenericSearchDto<Entity> = {
  [K in keyof Entity]?: 
    Entity[K] 
    | (IsNumber<Entity[K]> extends true ? Entity[K][] : undefined)
    | (IsString<Entity[K]> extends true ? Entity[K][] : undefined)
    | (IsDate<Entity[K]> extends true ? RangeValue<Entity, K> : undefined)
    | undefined
}
