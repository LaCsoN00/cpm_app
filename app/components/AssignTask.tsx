import { User } from '@prisma/client';
import React, { FC, useState } from 'react';
import UserInfo from './UserInfo';

interface AssignTaskProps {
    users: User[];
    projectId: string;
    onAssignTask: (users: User[]) => void;
}

const AssignTask: FC<AssignTaskProps> = ({ users, onAssignTask }) => {
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

    const toggleUserSelection = (user: User) => {
        setSelectedUsers((prevSelected) => {
            const isAlreadySelected = prevSelected.some((u) => u.id === user.id);
            const updatedSelection = isAlreadySelected
                ? prevSelected.filter((u) => u.id !== user.id)
                : [...prevSelected, user];
            return updatedSelection;
        });
    };

    const handleAssign = () => {
        onAssignTask(selectedUsers);
        const modal = document.getElementById('my_modal_3') as HTMLDialogElement;
        if (modal) {
            modal.close();
        }
    };

    return (
        <div className='w-full'>
            <div
                className="cursor-pointer border border-base-300 p-5 rounded-xl w-full"
                onClick={() => (document.getElementById('my_modal_3') as HTMLDialogElement).showModal()}
            >
                <UserInfo
                    role="Assignés à"
                    email={selectedUsers.length ? selectedUsers.map((u) => u.email).join(', ') : "Personne"}
                    name={selectedUsers.length ? selectedUsers.map((u) => u.name).join(', ') : ""}
                />
            </div>

            <dialog id="my_modal_3" className="modal">
                <div className="modal-box">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <h3 className="font-bold text-lg mb-3">Choisissez des collaborateurs</h3>
                    <div>
                        {users.map((user) => {
                            const isSelected = selectedUsers.some((u) => u.id === user.id);
                            return (
                                <div
                                    key={user.id}
                                    onClick={() => toggleUserSelection(user)}
                                    className={`cursor-pointer border border-base-300 p-5 rounded-xl w-full mb-3 ${isSelected ? 'bg-gray-200' : ''}`}
                                >
                                    <UserInfo
                                        role="Collaborateur"
                                        email={user.email || ''}
                                        name={user.name || ''}
                                    />
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex justify-end mt-3">
                        <button type="button" className="btn btn-primary" onClick={handleAssign}>Confirmer</button>
                    </div>
                </div>
            </dialog>
        </div>
    );
};

export default AssignTask;
