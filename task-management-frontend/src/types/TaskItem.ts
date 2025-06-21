import type {Priority} from "../enums/Priority.ts";
import type {Status} from "../enums/Status.ts";

export interface TaskItem {
    id: number;
    title: string;
    description: string;
    priority: Priority;
    status: Status;
    createdDate: string;
}
