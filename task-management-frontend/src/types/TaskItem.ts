import type {Priority} from "../enums/Priority";
import type {Status} from "../enums/Status";

export interface TaskItem {
    id: number;
    title: string;
    description: string;
    priority: Priority;
    status: Status;
    createdDate: string;
}
