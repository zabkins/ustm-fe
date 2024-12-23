export interface Page {
  content: Task[];
  page: {
    number: number;
    size: number;
    totalElements: number;
    totalPages: number;
  }
}

export interface Task {
  id: number;
  name: string;
  description: string;
  startDate: string;
  finishDate: string;
  status: 'PLANNED' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED';
  subTasks: SubTask[];
}

export interface SubTask {
  id: number;
  name: string;
  description: string;
  done: boolean;
}
