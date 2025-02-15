"use server"

import prisma from "@/lib/prisma";
import { randomBytes } from "crypto";
import nodemailer from 'nodemailer';


export async function checkAndAddUser(email: string, name: string) {
    if (!email) return
    try {
        const existingUser = await prisma.user.findUnique({
            where: {
                email: email
            }
        })
        if (!existingUser && name) {
            await prisma.user.create({
                data: {
                    email,
                    name
                }
            })
            console.error("Erreur lors de la vérification de l'utilisateur:");
        } else {
            console.error("Utilisateur déjà présent dans la base de données");
        }
    } catch (error) {
        console.error("Erreur lors de la vérification de l'utilisateur:", error);
    }
}

function generateUniqueCode(): string {
    return randomBytes(6).toString('hex')
}

export async function createProject(name: string, description: string, email: string) {
    try {
        if (!email) {
            throw new Error('Email est requis pour créer un projet');
        }

        const inviteCode = generateUniqueCode();
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        });

        if (!user) {
            throw new Error('Utilisateur non trouvé');
        }

        const newProject = await prisma.project.create({
            data: {
                name,
                description,
                inviteCode,
                createdById: user.id
            }
        });

        return newProject;
    } catch (error) {
        console.error('Erreur lors de la création du projet:', error);
        if (error instanceof Error) {
            throw new Error(`Erreur lors de la création du projet: ${error.message}`);
        } else {
            throw new Error('Erreur lors de la création du projet');
        }
    }
}

export async function getProjectsCreatedByUser(email: string) {
    try {

        const projects = await prisma.project.findMany({
            where: {
                createdBy: { email }
            },
            include: {
                tasks: {
                    include: {
                        user: true,
                        createdBy: true
                    }
                },
                users: {
                    select: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true
                            }
                        }
                    }
                }
            }
        })

        const formattedProjects = projects.map((project) => ({
            ...project,
            users: project.users.map((userEntry) => userEntry.user)
        }))

        return formattedProjects

    } catch (error) {
        console.error(error)
        throw new Error
    }
}


export async function deleteProjectById(projectId: string) {
    try {
        await prisma.project.delete({
            where: {
                id: projectId
            }
        })
        console.log(`Projet avec l'ID ${projectId} supprimé avec succès.`);
    } catch (error) {
        console.error(error)
        throw new Error
    }
}

export async function addUserToProject(email: string, inviteCode: string) {
    try {

        const project = await prisma.project.findUnique({
            where: { inviteCode }
        })

        if (!project) {
            throw new Error('Projet non trouvé');
        }

        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
            throw new Error('Utilisateur non trouvé');
        }

        const existingAssociation = await prisma.projectUser.findUnique({
            where: {
                userId_projectId: {
                    userId: user.id,
                    projectId: project.id
                }
            }
        })

        if (existingAssociation) {
            throw new Error('Utilisateur déjà associé à ce projet');
        }

        await prisma.projectUser.create({
            data: {
                userId: user.id,
                projectId: project.id
            }
        })
        return 'Utilisateur ajouté au projet avec succès';
    } catch (error) {
        console.error(error)
        throw new Error
    }
}

export async function getProjectsAssociatedWithUser(email: string) {
    try {

        const projects = await prisma.project.findMany({
            where: {
                users: {
                    some: {
                        user: {
                            email
                        }
                    }
                }
            },
            include: {
                tasks: true,
                users: {
                    select: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            }
                        }
                    }
                }
            }

        })

        const formattedProjects = projects.map((project) => ({
            ...project,
            users: project.users.map((userEntry) => userEntry.user)
        }))

        return formattedProjects

    } catch (error) {
        console.error(error)
        throw new Error
    }
}

export async function getProjectInfo(idProject: string, details: boolean) {
    try {
        const project = await prisma.project.findUnique({
            where: {
                id: idProject
            },
            include: details ? {
                tasks: {
                    include: {
                        user: true,
                        createdBy: true
                    }
                },
                users: {
                    select: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            }
                        }
                    }
                },
                createdBy: true
            } : undefined,
        })

        if (!project) {
            throw new Error('Projet non trouvé');
        }

        return project
    } catch (error) {
        console.error(error)
        throw new Error
    }
}

export async function getProjectUsers(idProject: string) {
    try {
        const projectWithUsers = await prisma.project.findUnique({
            where: {
                id: idProject
            },
            include: {
                users: {
                    include: {
                        user: true,
                    }
                },
            }

        })

        const users = projectWithUsers?.users.map((projectUser => projectUser.user)) || []
        return users

    } catch (error) {
        console.error(error)
        throw new Error
    }
}

export async function createTask(
    name: string,
    description: string,
    dueDate: Date | null,
    projectId: string,
    createdByEmail: string,
    assignToEmail: string | undefined
) {

    try {
        const createdBy = await prisma.user.findUnique({
            where: { email: createdByEmail }
        })

        if (!createdBy) {
            throw new Error(`Utilisateur avec l'email ${createdByEmail} introuvable`);
        }

        let assignedUserId = createdBy.id

        if (assignToEmail) {
            const assignedUser = await prisma.user.findUnique({
                where: { email: assignToEmail }
            })
            if (!assignedUser) {
                throw new Error(`Utilisateur avec l'email ${assignToEmail} introuvable`);
            }
            assignedUserId = assignedUser.id
        }

        const newTask = await prisma.task.create({
            data: {
                name,
                description,
                dueDate,
                projectId,
                createdById: createdBy.id,
                userId: assignedUserId
            }
        })

        console.log('Tâche créée avec succès:', newTask);
        return newTask;
    } catch (error) {
        console.error(error)
        throw new Error
    }

}
export async function deleteTaskById(taskId: string) {
    try {
        await prisma.task.delete({
            where: {
                id: taskId
            }
        })
    } catch (error) {
        console.error(error)
        throw new Error
    }
}

export const getTaskDetails = async (taskId: string) => {
    try {
        const task = await prisma.task.findUnique({
            where: { id: taskId },
            include: {
                project: true,
                user: true,
                createdBy: true
            }
        })
        if (!task) {
            throw new Error('Tâche non trouvée');
        }

        return task

    } catch (error) {
        console.error(error)
        throw new Error
    }
}

export const updateTaskStatus = async (taskId: string, newStatus: string, solutionDescription?: string) => {
    try {

        const existingTask = await prisma.task.findUnique({
            where: {
                id: taskId
            }
        })

        if (!existingTask) {
            throw new Error('Tâche non trouvée');
        }

        if (newStatus === "Done" && solutionDescription) {
            await prisma.task.update({
                where: { id: taskId },
                data: {
                    status: newStatus,
                    solutionDescription
                }
            })
        } else {
            await prisma.task.update({
                where: { id: taskId },
                data: {
                    status: newStatus
                }
            })
        }
    } catch (error) {
        console.error(error)
        throw new Error
    }
}

export async function subscribeUser(email: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            throw new Error('Utilisateur non trouvé');
        }

        console.log(`Utilisateur avec l'email ${email} a été inscrit avec succès.`);
        return `Utilisateur avec l'email ${email} a été inscrit avec succès.`;

    } catch (error) {
        console.error('Erreur lors de la souscription de l\'utilisateur:', error);
        throw new Error('Erreur lors de la souscription de l\'utilisateur');
    }
}

export async function unsubscribeUser(email: string, projectId: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            throw new Error('Utilisateur non trouvé');
        }

        const projectUser = await prisma.projectUser.findUnique({
            where: {
                userId_projectId: {
                    userId: user.id,
                    projectId: projectId
                }
            }
        });

        if (!projectUser) {
            throw new Error('Utilisateur non associé à ce projet');
        }

        await prisma.projectUser.delete({
            where: {
                userId_projectId: {
                    userId: user.id,
                    projectId: projectId
                }
            }
        });

        console.log(`Utilisateur ${email} désabonné du projet avec succès.`);
        return `Utilisateur ${email} désabonné du projet avec succès.`;
    } catch (error) {
        console.error('Erreur lors de la désinscription de l\'utilisateur:', error);
        throw new Error('Erreur lors de la désinscription de l\'utilisateur');
    }
}

export async function sendNotification(userId: string, message: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            throw new Error('Utilisateur non trouvé');
        }

        if (!user.email) {
            throw new Error('Utilisateur n\'a pas d\'email enregistré');
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'lucmounguengui@gmail.com',
                pass: 'M@rvelInc00'
            }
        });

    
        const mailOptions = {
            from: 'lucmounguengui@gmail.com',
            to: user.email,               
            subject: 'Notification de projet',
            text: message,                
        };

        const info = await transporter.sendMail(mailOptions);

        console.log('Email envoyé: ', info.response);
        return `Notification envoyée avec succès à ${user.email}`;
    } catch (error) {
        console.error('Erreur lors de l\'envoi de la notification:', error);
        throw new Error('Erreur lors de l\'envoi de la notification');
    }
}
