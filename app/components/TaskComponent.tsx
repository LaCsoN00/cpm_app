import { Task } from "@/type";
import React, { FC } from "react";
import UserInfo from "./UserInfo";
import Link from "next/link";
import { ArrowRight, Trash } from "lucide-react";

interface TaskProps {
  task: Task;
  index: number;
  email?: string;
  onDelete?: (id: string) => void;
}

const TaskComponent: FC<TaskProps> = ({ task, index, email, onDelete }) => {
  const canDelete = email === task.createdBy?.email;

  const handleDeleteClick = () => {
    if (onDelete) {
      onDelete(task.id);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "To Do":
        return "bg-red-200 text-red-800";
      case "In Progress":
        return "bg-yellow-200 text-yellow-800";
      case "Done":
        return "bg-green-200 text-green-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  return (
    <>
      <td>{index + 1}</td>
      <td>
        <div className="flex flex-col">
          <div
            className={`badge text-xs mb-2 font-semibold ${getStatusBadge(
              task.status
            )}`}
          >
            {task.status === "To Do" && "A faire"}
            {task.status === "In Progress" && "En cours"}
            {task.status === "Done" && "Terminé"}
          </div>
          <span className="text-sm font-bold">
            {task.name.length > 100
              ? `${task.name.slice(0, 100)}...`
              : task.name}
          </span>
        </div>
      </td>

      <td>
        <UserInfo
          role=""
          email={task.user?.email || null}
          name={task.user?.name || null}
        />
      </td>

      <td>
        <div className="text-xs text-gray-500 hidden md:flex">
          {task.dueDate && new Date(task.dueDate).toLocaleDateString()}
        </div>
      </td>

      <td>
        <div className="text-xs text-gray-500 hidden md:flex">
          {task.amount ? `${task.amount} Fcfa` : "Non renseigné"}
        </div>
      </td>

      <td>
        <div className="flex h-fit">
          <Link
            className="btn btn-sm btn-primary"
            href={`/task-details/${task.id}`}
          >
            Plus
            <ArrowRight className="w-4" />
          </Link>
          {canDelete && (
            <button onClick={handleDeleteClick} className="btn btn-sm ml-2">
              <Trash className="w-4" />
            </button>
          )}
        </div>
      </td>
    </>
  );
};

export default TaskComponent;
