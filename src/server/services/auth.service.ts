import type { Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';

import { createAuthToken } from '../auth/session';
import { ApplicationError } from '../errors/application-error';
import { userRepository } from '../repositories/user.repository';

export type RegisterUserInput = {
    username: string;
    email: string;
    password: string;
    firstname?: string;
    lastname?: string;
    birthdate?: string;
    country?: string;
    zip?: string | number;
    city?: string;
    street?: string;
    housenumber?: string | number;
    unit?: string;
};

const publicUser = <T extends { password: string }>(user: T) => {
    const { password: _password, ...safeUser } = user;
    return safeUser;
};

// Helper: Safely parse numbers to prevent NaN from breaking Prisma queries
const parseSafeInt = (val: string | number | undefined, defaultValue = 0): number => {
    if (val === undefined || val === null || val === '') return defaultValue;
    const parsed = parseInt(String(val), 10);
    return isNaN(parsed) ? defaultValue : parsed;
};

// Helper: Safely parse date strings
const parseSafeDate = (dateStr?: string): Date => {
    if (!dateStr) return new Date();
    const parsedDate = new Date(dateStr);
    return isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
};

export const authService = {
    getCurrentUser: (id: string) => userRepository.findPublicById(id),
    getUserByEmail: (email: string) => userRepository.findByEmail(email),

    async login(email: string, password: string) {
        if (!email || !password) {
            throw new ApplicationError(
                'Email and password are required',
                400,
                'INVALID_CREDENTIALS',
            );
        }

        const user = await userRepository.findByEmail(email);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new ApplicationError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
        }

        return {
            token: createAuthToken({ id: user.id, email: user.email }),
            user: publicUser(user),
        };
    },

    async register(input: RegisterUserInput) {
        // 1. Validate mandatory fields
        if (!input.username || !input.email || !input.password) {
            throw new ApplicationError('Missing required fields', 400, 'INVALID_INPUT');
        }

        // 2. Check for duplicate Email
        const existingEmail = await userRepository.findByEmail(input.email);
        if (existingEmail) {
            throw new ApplicationError('Email already in use', 409, 'EMAIL_IN_USE');
        }

        // 3. Check for duplicate Username (if method exists on your repository)
        if (
            'findByUsername' in userRepository &&
            typeof userRepository.findByUsername === 'function'
        ) {
            const existingUsername = await userRepository.findByUsername(input.username);
            if (existingUsername) {
                throw new ApplicationError('Username already in use', 409, 'USERNAME_IN_USE');
            }
        }

        // 4. Construct sanitized Prisma input data
        const data: Prisma.UserCreateInput = {
            username: input.username.trim(),
            email: input.email.trim().toLowerCase(),
            password: await bcrypt.hash(input.password, 10),
            firstname: input.firstname?.trim() ?? '',
            lastname: input.lastname?.trim() ?? '',
            birthdate: parseSafeDate(input.birthdate),
            country: input.country?.trim() ?? '',
            zip: parseSafeInt(input.zip, 0),
            city: input.city?.trim() ?? '',
            street: input.street?.trim() ?? '',
            // Extract digits only if housenumber contains letters (e.g., "12A" -> 12)
            housenumber: parseSafeInt(input.housenumber, 0),
            unit: input.unit?.trim() || null,
            language: 'en',
        };

        try {
            const user = await userRepository.create(data);
            return {
                token: createAuthToken({ id: user.id, email: user.email }),
                user: publicUser(user),
            };
        } catch (error: any) {
            // Prisma Unique Constraint Error (P2002) fallback
            if (error?.code === 'P2002') {
                const field = error.meta?.target?.[0] || 'Field';
                throw new ApplicationError(`${field} is already taken`, 409, 'DUPLICATE_FIELD');
            }
            throw error;
        }
    },
};
