export type TaskStatus = 'completed' | 'running' | 'pending' | 'error';

export type TaskType = 'start' | 'task' | 'workflow' | 'end';

export type WorkflowTask = {
  id: string;
  name: string;
  type: TaskType;
  status: TaskStatus;
  description?: string;
  estimatedTime?: string;
  cost?: string;
  level?: number;
  subTasks?: WorkflowTask[];
};

