import { Project as PrismaProject, Task as PrismaTask, User } from '@prisma/client';

export type PaymentMethod = "CHEQUE" | "VIREMENT" | "ESPECE"; // Ajout de PaymentMethod

export type TaskStatus = "To Do" | "In Progress" | "Done"; // Définition d'un type pour les statuts de tâche

export type Project = PrismaProject & {
  totalTasks?: number;
  collaboratorsCount?: number;
  taskStats?: {
    toDo: number;
    inProgress: number;
    done: number;
  };
  percentages?: {
    progressPercentage: number;
    inProgressPercentage: number;
    toDoPercentage: number;
  };
  tasks?: Task[];
  users?: User[]; 
  createdBy?: User;
};

export type Task = PrismaTask & {
  user?: User | null;
  createdBy?: User | null;
};
