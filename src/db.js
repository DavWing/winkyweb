const DB_NAME = 'MileageTrackerDB';
const DB_VERSION = 1;

const STORES = {
  TRIPS: 'trips',
  EXPENSES: 'expenses',
  RECEIPTS: 'receipts'
};

let db = null;

export async function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = event.target.result;

      if (!database.objectStoreNames.contains(STORES.TRIPS)) {
        const tripStore = database.createObjectStore(STORES.TRIPS, { keyPath: 'id', autoIncrement: true });
        tripStore.createIndex('date', 'date', { unique: false });
      }

      if (!database.objectStoreNames.contains(STORES.EXPENSES)) {
        const expenseStore = database.createObjectStore(STORES.EXPENSES, { keyPath: 'id', autoIncrement: true });
        expenseStore.createIndex('date', 'date', { unique: false });
        expenseStore.createIndex('category', 'category', { unique: false });
      }

      if (!database.objectStoreNames.contains(STORES.RECEIPTS)) {
        database.createObjectStore(STORES.RECEIPTS, { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

async function getDB() {
  if (!db) await initDB();
  return db;
}

export async function addTrip(trip) {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORES.TRIPS], 'readwrite');
    const store = transaction.objectStore(STORES.TRIPS);
    const request = store.add({ ...trip, id: Date.now() });
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

export async function getTrips() {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORES.TRIPS], 'readonly');
    const store = transaction.objectStore(STORES.TRIPS);
    const index = store.index('date');
    const request = index.getAll();
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const trips = request.result.reverse();
      resolve(trips);
    };
  });
}

export async function deleteTrip(id) {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORES.TRIPS], 'readwrite');
    const store = transaction.objectStore(STORES.TRIPS);
    const request = store.delete(id);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

export async function addExpense(expense) {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORES.EXPENSES], 'readwrite');
    const store = transaction.objectStore(STORES.EXPENSES);
    const request = store.add({ ...expense, id: Date.now() });
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

export async function getExpenses() {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORES.EXPENSES], 'readonly');
    const store = transaction.objectStore(STORES.EXPENSES);
    const index = store.index('date');
    const request = index.getAll();
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const expenses = request.result.reverse();
      resolve(expenses);
    };
  });
}

export async function deleteExpense(id) {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORES.EXPENSES], 'readwrite');
    const store = transaction.objectStore(STORES.EXPENSES);
    const request = store.delete(id);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

export async function addReceipt(receipt) {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORES.RECEIPTS], 'readwrite');
    const store = transaction.objectStore(STORES.RECEIPTS);
    const request = store.add(receipt);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

export async function getReceipt(id) {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORES.RECEIPTS], 'readonly');
    const store = transaction.objectStore(STORES.RECEIPTS);
    const request = store.get(id);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

export async function deleteReceipt(id) {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORES.RECEIPTS], 'readwrite');
    const store = transaction.objectStore(STORES.RECEIPTS);
    const request = store.delete(id);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}
