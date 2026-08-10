import { User } from '@/types';
import { initials } from '@/utils/format';
import { storage } from './storage';

const USERS_KEY = 'finctrl_users';
const CURRENT_USER_KEY = 'finctrl_user';
const LOGGED_KEY = 'finctrl_loggedIn';

export const DEMO_USER: User = {
  id: 'u1',
  name: 'João Silva',
  email: 'joao@email.com',
  password: '123456',
  avatar: 'JS',
  plan: 'Gratuito',
  createdAt: '2024-01-15',
  phone: '+55 (11) 99999-9999',
};

export const ADMIN_USER: User = {
  id: 'admin1',
  name: 'Admin Finzy',
  email: 'admin@finzy.com',
  password: 'admin123',
  avatar: 'AF',
  plan: 'Admin',
  createdAt: '2024-01-01',
  phone: '+55 (11) 99999-0000',
  isAdmin: true,
};

function safeParse<T>(value: string | null, fallback: T): T {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function getUsers() {
  const users = safeParse<User[]>(storage.get(USERS_KEY), []);

  if (!users.some((user) => user.email === DEMO_USER.email)) {
    const nextUsers = [DEMO_USER, ...users];
    storage.set(USERS_KEY, JSON.stringify(nextUsers));
    return nextUsers;
  }

  return users;
}

export function getCurrentUser() {
  const isLogged = storage.get(LOGGED_KEY) === 'true';
  const user = safeParse<User | null>(
    storage.get(CURRENT_USER_KEY),
    null,
  );

  return isLogged ? user : null;
}

export function saveSession(user: User) {
  const safeUser = { ...user };
  delete safeUser.password;

  storage.set(CURRENT_USER_KEY, JSON.stringify(safeUser));
  storage.set(LOGGED_KEY, 'true');

  return safeUser;
}

export function login(email: string, password: string) {
  const user = getUsers().find(
    (item) => item.email.toLowerCase() === email.toLowerCase(),
  );

  if (!user || user.password !== password) {
    return null;
  }

  return saveSession(user);
}

export function loginDemo() {
  return saveSession(DEMO_USER);
}

export function updateCurrentUser(
  update: Pick<User, 'name' | 'email' | 'phone'>,
) {
  const current = getCurrentUser() ?? DEMO_USER;

  const nextUser = {
    ...current,
    ...update,
    avatar: initials(update.name),
  };

  storage.set(CURRENT_USER_KEY, JSON.stringify(nextUser));

  return nextUser;
}

export function register(
  name: string,
  email: string,
  password: string,
  phone?: string,
) {
  const users = getUsers();

  if (
    users.some(
      (user) => user.email.toLowerCase() === email.toLowerCase(),
    )
  ) {
    return null;
  }

  const newUser: User = {
    id: `u${Date.now()}`,
    name,
    email,
    password,
    avatar: initials(name),
    plan: 'Gratuito',
    createdAt: new Date().toISOString().split('T')[0],
    phone,
  };

  const nextUsers = [newUser, ...users];

  storage.set(USERS_KEY, JSON.stringify(nextUsers));

  return saveSession(newUser);
}

export function logout() {
  storage.remove(CURRENT_USER_KEY);
  storage.remove(LOGGED_KEY);
}

export function blockUser(userId: string) {
  const users = getUsers();

  const nextUsers = users.map((user) =>
    user.id === userId
      ? { ...user, blocked: true }
      : user,
  );

  storage.set(USERS_KEY, JSON.stringify(nextUsers));
}

export function unblockUser(userId: string) {
  const users = getUsers();

  const nextUsers = users.map((user) =>
    user.id === userId
      ? { ...user, blocked: false }
      : user,
  );

  storage.set(USERS_KEY, JSON.stringify(nextUsers));
}

export function deleteUser(userId: string) {
  const users = getUsers();

  const nextUsers = users.filter(
    (user) => user.id !== userId,
  );

  storage.set(USERS_KEY, JSON.stringify(nextUsers));
}

export function isAdmin(): boolean {
  const user = getCurrentUser();
  return user?.isAdmin === true;
}