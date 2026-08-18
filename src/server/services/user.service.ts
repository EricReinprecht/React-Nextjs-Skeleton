import type { User } from "@prisma/client";

import { ApplicationError } from "../errors/application-error";
import { userRepository } from "../repositories/user.repository";

export const updateUserProfile = (authenticatedUserId: string, requestedUserId: string, data: Partial<User>) => {
    if (authenticatedUserId !== requestedUserId) throw new ApplicationError("Forbidden", 403, "FORBIDDEN");
    return userRepository.update(requestedUserId, data);
};
