"use client";

import {
  getProjectInfo,
  getTaskDetails,
  updateTaskStatus,
} from "@/app/actions";
import EmptyState from "@/app/components/EmptyState";
import UserInfo from "@/app/components/UserInfo";
import Wrapper from "@/app/components/Wrapper";
import { Project, Task } from "@/type";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill-new";
import { toast } from "react-hot-toast";
import "react-quill-new/dist/quill.snow.css";
import { useUser } from "@clerk/nextjs";
import { PaymentMethod } from "@prisma/client";

const Page = ({ params }: { params: Promise<{ taskId: string }> }) => {
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress;

  const [task, setTask] = useState<Task | null>(null);
  const [taskId, setTaskId] = useState<string>("");
  const [project, setProject] = useState<Project | null>(null);
  const [status, setStatus] = useState("");
  const [realStatus, setRealStatus] = useState<string>("");
  const [solution, setSolution] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(
    null
  );

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ font: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ color: [] }, { background: [] }],
      ["blockquote", "code-block"],
      ["link", "image"],
      ["clean"],
    ],
  };

  const fetchInfos = async (taskId: string) => {
    try {
      const task = await getTaskDetails(taskId);
      setTask(task);
      setStatus(task.status);
      setRealStatus(task.status);
      setPaymentMethod(task.paymentMethod || null);
      fetchProject(task.projectId);
    } catch {
      toast.error("Erreur lors du chargement des détails de la tâche.");
    }
  };

  const fetchProject = async (projectId: string) => {
    try {
      const project = await getProjectInfo(projectId, false);
      setProject(project);
    } catch {
      toast.error("Erreur lors du chargement du projet");
    }
  };

  useEffect(() => {
    const getId = async () => {
      const resolvedParams = await params;
      setTaskId(resolvedParams.taskId);
      fetchInfos(resolvedParams.taskId);
    };
    getId();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const changeStatus = async (taskId: string, newStatus: string) => {
    try {
      if (newStatus !== realStatus) {
        // Assurez-vous que paymentMethod n'est pas null avant de l'utiliser
        const payment = paymentMethod ?? undefined; // Remplacer `null` par `undefined` si nécessaire
        await updateTaskStatus(taskId, newStatus, solution, payment);
        setRealStatus(newStatus);
        fetchInfos(taskId);
      }
    } catch {
      toast.error("Erreur lors du changement de statut");
    }
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = event.target.value;
    setStatus(newStatus);
    const modal = document.getElementById(
      "modal_solution"
    ) as HTMLDialogElement;
    if (newStatus === "To Do" || newStatus === "In Progress") {
      changeStatus(taskId, newStatus);
      toast.success("Status changé");
      modal.close();
    } else {
      modal.showModal();
    }
  };

  const closeTask = async (newStatus: string) => {
    const modal = document.getElementById(
      "modal_solution"
    ) as HTMLDialogElement;
    try {
      if (solution !== "" && paymentMethod !== null) {
        await updateTaskStatus(
          taskId,
          newStatus,
          solution,
          paymentMethod ?? undefined
        );
        fetchInfos(taskId);
        modal.close();
        toast.success("Tâche clôturée avec paiement");
      } else {
        toast.error("Il manque une solution ou un mode de paiement");
      }
    } catch {
      toast.error("Erreur lors du changement de statut");
    }
  };

  const printPage = () => {
    const printContent = document.body.innerHTML;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = `
      <html>
        <head>
          <title>Impression de la tâche</title>
          <style>
            /* Ajoutez ici des styles supplémentaires si nécessaire */
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              color: #333;
            }
            .container {
              max-width: 800px;
              margin: 0 auto;
            }
          </style>
        </head>
        <body>
          <div class="container">
            ${printContent}
          </div>
        </body>
      </html>
    `;
    window.print();

    setTimeout(() => {
      document.body.innerHTML = originalContent;
    }, 1000);
  };

  return (
    <Wrapper>
      {task ? (
        <div>
          <div className="flex flex-col md:justify-between md:flex-row">
            <div className="breadcrumbs text-sm">
              <ul>
                <li>
                  <Link
                    className="badge badge-primary"
                    href={`/project/${task?.projectId}`}
                  >
                    Retour
                  </Link>
                </li>
                <li>
                  <div className="badge badge-primary">{project?.name}</div>
                </li>
              </ul>
            </div>
            <div className="p-5 border border-base-300 rounded-xl w-full md:w-fit my-4">
              <UserInfo
                role="Assigné à"
                email={task.user?.email || null}
                name={task.user?.name || null}
              />
            </div>
          </div>

          <h1 className="font-semibold italic text-2xl mb-4">{task.name}</h1>

          <div className="flex justify-between items-center mb-4">
            <span>
              A livrer le
              <div className="badge badge-ghost ml-2">
                {task?.dueDate?.toLocaleDateString()}
              </div>
            </span>
            <div>
              <select
                value={status}
                onChange={handleStatusChange}
                className="select select-sm select-bordered select-primary focus:outline-none ml-3"
                disabled={status === "Done" || task.user?.email !== email}
              >
                <option value="To Do">A faire</option>
                <option value="In Progress">En cours</option>
                <option value="Done">Terminée</option>
              </select>
            </div>
          </div>

          <div className="ql-snow w-full">
            <div
              className="ql-editor p-5 border-base-300 border rounded-xl"
              dangerouslySetInnerHTML={{ __html: task.description }}
            />
          </div>

          {task.solutionDescription && (
            <div>
              <div className="badge badge-primary my-4">Solution</div>
              <div className="ql-snow w-full">
                <div
                  className="ql-editor p-5 border-base-300 border rounded-xl"
                  dangerouslySetInnerHTML={{ __html: task.solutionDescription }}
                />
              </div>
            </div>
          )}

          <div className="flex justify-between items-center p-4 border rounded-lg mt-4 bg-gray-100">
          <div className="p-4 border rounded-lg bg-gray-100">
          <h2 className="text-gray-700 font-medium">Montant de la tâche</h2>
              <p className="text-xl font-bold">
                {task.amount ? `${task.amount} Fcfa` : "Non renseigné"}
              </p>
            </div>

            {paymentMethod && (
              <div className="p-4 border rounded-lg bg-gray-100">
                <p className="text-gray-700 font-medium">
                  Mode de paiement sélectionné
                </p>
                <p className="text-lg font-bold text-center">{paymentMethod}</p>
              </div>
            )}

            <button onClick={printPage} className="btn btn-sm btn-primary">
              Imprimer
            </button>
          </div>

          <dialog id="modal_solution" className="modal">
            <div className="modal-box">
              <form method="dialog">
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                  ✕
                </button>
              </form>
              <h3 className="font-bold text-lg">Quelle est la solution ?</h3>
              <p className="py-4">Décrivez ce que vous avez fait exactement</p>
              <ReactQuill
                placeholder="Décrivez la solution"
                value={solution}
                modules={modules}
                onChange={setSolution}
              />

              <h3 className="font-bold text-lg mt-4">Mode de paiement</h3>
              <select
                className="select select-bordered w-full mt-2"
                value={paymentMethod || ""}
                onChange={(e) =>
                  setPaymentMethod(e.target.value as PaymentMethod)
                }
              >
                <option value="">Sélectionnez un mode de paiement</option>
                <option value="CHEQUE">Chèque</option>
                <option value="VIREMENT">Virement</option>
                <option value="ESPECE">Espèce</option>
              </select>

              <button onClick={() => closeTask(status)} className="btn mt-4">
                Terminer
              </button>
            </div>
          </dialog>
        </div>
      ) : (
        <EmptyState
          imageSrc="/empty-task.png"
          imageAlt="Picture of an empty project"
          message="Cette tâche n'existe pas"
        />
      )}
    </Wrapper>
  );
};

export default Page;
