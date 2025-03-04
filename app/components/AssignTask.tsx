import { User } from '@prisma/client'
import React, { FC, useState } from 'react'
import UserInfo from './UserInfo';

interface AssignTaskProps {
    users: User[]; 
    projectId: string;
    onAssignTask: (user: User) => void;
}

const AssignTask: FC<AssignTaskProps> = ({ users, onAssignTask }) => {

    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const handleAssign = (user: User) => {
        setSelectedUser(user);
        onAssignTask(user);
        const modal = document.getElementById('my_modal_3') as HTMLDialogElement;
        if (modal) {
            modal.close();
        }
    };

    return (
        <div className='w-full '>
            <div
                className="cursor-pointer border border-base-300 p-5 rounded-xl w-full" 
                onClick={() => (document.getElementById('my_modal_3') as HTMLDialogElement).showModal()}>
                <UserInfo
                    role="Assigné à"
                    email={selectedUser?.email || "Personne"}  // Affiche l'email de l'utilisateur sélectionné
                    name={selectedUser?.name || ""}  // Affiche le nom de l'utilisateur sélectionné
                />
            </div>

            <dialog id="my_modal_3" className="modal">
                <div className="modal-box">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <h3 className="font-bold text-lg mb-3">Choisissez un collaborateur</h3>
                    <div>
                        {users.map((user) => (
                            <div
                                onClick={() => handleAssign(user)} // Appelle handleAssign avec l'utilisateur sélectionné
                                className='cursor-pointer border border-base-300 p-5 rounded-xl w-full mb-3'
                                key={user.id}>
                                <UserInfo
                                    role="Assigné à"
                                    email={user.email || null}
                                    name={user.name || null}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </dialog>
        </div>
    )
}

export default AssignTask;
