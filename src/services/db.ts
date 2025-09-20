import { openDB } from 'idb';
import type { DBSchema, IDBPDatabase } from 'idb';

const DB_NAME = 'pwa-survey-db';
const DB_VERSION = 2;
const RESPONSES_STORE = 'responses';
const REGISTRATIONS_STORE = 'registrations';

interface SurveyResponse {
  id: string;
  surveyId: string;
  answers: Record<string, any>;
  submittedAt: Date;
  completed: boolean;
}

interface RegistrationResponse {
  id: string;
  registrationId: string;
  responses: Record<string, any>;
  completedAt: string;
}

interface SurveyDB extends DBSchema {
  [RESPONSES_STORE]: {
    key: string;
    value: SurveyResponse;
    indexes: { 'by-surveyId': string };
  };
  [REGISTRATIONS_STORE]: {
    key: string;
    value: RegistrationResponse;
    indexes: { 'by-registrationId': string };
  };
}

let dbPromise: Promise<IDBPDatabase<SurveyDB>> | null = null;

const getDb = () => {
  if (!dbPromise) {
    dbPromise = openDB<SurveyDB>(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion) {
        if (oldVersion < 1) {
          const store = db.createObjectStore(RESPONSES_STORE, {
            keyPath: 'id',
          });
          store.createIndex('by-surveyId', 'surveyId');
        }
        if (oldVersion < 2) {
          const registrationStore = db.createObjectStore(REGISTRATIONS_STORE, {
            keyPath: 'id',
          });
          registrationStore.createIndex('by-registrationId', 'registrationId');
        }
      },
    });
  }
  return dbPromise;
};

export const addResponse = async (response: Omit<SurveyResponse, 'id' | 'submittedAt'> & { id?: string }) => {
  const db = await getDb();
  const tx = db.transaction(RESPONSES_STORE, 'readwrite');
  const newResponse: SurveyResponse = {
    ...response,
    id: response.id || new Date().toISOString(),
    submittedAt: new Date(),
  };
  await tx.store.put(newResponse);
  await tx.done;
  return newResponse;
};

export const getResponsesBySurvey = async (surveyId: string) => {
  const db = await getDb();
  return db.getAllFromIndex(RESPONSES_STORE, 'by-surveyId', surveyId);
};

export const getAllResponses = async () => {
  const db = await getDb();
  return db.getAll(RESPONSES_STORE);
};

export const saveRegistrationResponse = async (response: Omit<RegistrationResponse, 'id'>) => {
  const db = await getDb();
  const tx = db.transaction(REGISTRATIONS_STORE, 'readwrite');
  const newResponse: RegistrationResponse = {
    ...response,
    id: new Date().toISOString(),
  };
  await tx.store.put(newResponse);
  await tx.done;
  return newResponse;
};

export const getRegistrationsByType = async (registrationId: string) => {
  const db = await getDb();
  return db.getAllFromIndex(REGISTRATIONS_STORE, 'by-registrationId', registrationId);
};

export const getAllRegistrations = async () => {
  const db = await getDb();
  return db.getAll(REGISTRATIONS_STORE);
};
