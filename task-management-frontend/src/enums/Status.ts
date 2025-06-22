export const Status = {
    Incomplete: 0,
    InProgress: 1,
    Complete: 2
} as const;

export type Status = typeof Status[keyof typeof Status];
