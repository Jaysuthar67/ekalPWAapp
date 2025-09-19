import { openDB } from 'idb';
import type { DBSchema, IDBPDatabase } from 'idb';

const DB_NAME = 'pwa-survey-db';
const DB_VERSION = 1;
const RESPONSES_STORE = 'responses';

interface SurveyResponse {
  id: string;
  surveyId: string;
  answers: Record<string, any>;
  submittedAt: Date;
  completed: boolean;
}

interface SurveyDB extends DBSchema {
  [RESPONSES_STORE]: {
    key: string;
    value: SurveyResponse;
    indexes: { 'by-surveyId': string };
  };
}

let dbPromise: Promise<IDBPDatabase<SurveyDB>> | null = null;

const getDb = () => {
  if (!dbPromise) {
    dbPromise = openDB<SurveyDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        const store = db.createObjectStore(RESPONSES_STORE, {
          keyPath: 'id',
        });
        store.createIndex('by-surveyId', 'surveyId');
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
