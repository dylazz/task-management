export const Status = {
    Todo: 0,
    InProgress: 1,
    Done: 2
} as const;

export type Status = typeof Status[keyof typeof Status];
