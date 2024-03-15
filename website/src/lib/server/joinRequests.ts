import { Event } from 'ts-typed-events';
import type { JoinRequest } from '@prisma/client';

export const joinRequestEvent = new Event<JoinRequest>();
