"use client";
import React, { useEffect, useState } from 'react';
import Wrapper from '../components/Wrapper';
import { SquarePlus } from 'lucide-react';
import { toast } from "react-hot-toast";
import { addUserToProject, getProjectsAssociatedWithUser } from '../actions';
import { useUser } from '@clerk/nextjs';
import { Project } from '@/type';
import ProjectComponent from '../components/ProjectComponent';
import EmptyState from '../components/EmptyState';

const Page = () => {
    const [isClient, setIsClient] = useState(false);  // Pour indiquer si on est côté client
    const { user, isLoaded } = useUser();            // Clerk hook
    const email = user?.primaryEmailAddress?.emailAddress as string;
    const [inviteCode, setInviteCode] = useState("");
    const [associatedProjects, setAssociatedProjects] = useState<Project[]>([]);

    // Vérifier si l'environnement est bien côté client
    useEffect(() => {
        setIsClient(true); // Met à jour après le premier rendu
    }, []);

    // Vérification côté client avant de lancer des requêtes liées à l'utilisateur
    useEffect(() => {
        if (isClient && isLoaded && email) {
            fetchProjects(email);  // Une fois que l'utilisateur est chargé, fetch les projets
        }
    }, [isClient, isLoaded, email]);

    const fetchProjects = async (email: string) => {
        try {
            const associated = await getProjectsAssociatedWithUser(email);
            setAssociatedProjects(associated);
        } catch {
            toast.error("Erreur lors du chargement des projets");
        }
    };

    const handleSubmit = async () => {
        try {
            if (inviteCode !== "") {
                await addUserToProject(email, inviteCode);
                fetchProjects(email);
                setInviteCode("");
                toast.success("Vous pouvez maintenant collaborer sur ce projet");
            } else {
                toast.error("Il manque le code du projet");
            }
        } catch {
            toast.error("Code invalide ou vous appartenez déjà au projet");
        }
    };

    // Vérifier que nous sommes côté client avant de rendre le contenu
    if (!isClient) {
        return <div>Loading...</div>;
    }

    return (
        <Wrapper>
            <div className="flex">
                <div className="mb-4">
                    <input
                        value={inviteCode}
                        onChange={(e) => setInviteCode(e.target.value)}
                        type="text"
                        placeholder="Code d'invitation"
                        className="w-full p-2 input input-bordered"
                    />
                </div>
                <button className="btn btn-primary ml-4" onClick={handleSubmit}>
                    Rejoindre <SquarePlus className="w-4" />
                </button>
            </div>

            <div>
                {associatedProjects.length > 0 ? (
                    <ul className="w-full grid md:grid-cols-3 gap-6">
                        {associatedProjects.map((project) => (
                            <li key={project.id}>
                                <ProjectComponent
                                    project={project}
                                    admin={0}
                                    style={true}
                                />
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div>
                        <EmptyState
                            imageSrc="/empty-project.png"
                            imageAlt="Picture of an empty project"
                            message="Aucun projet associé"
                        />
                    </div>
                )}
            </div>
        </Wrapper>
    );
};

export default Page;
