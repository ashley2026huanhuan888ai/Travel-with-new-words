const DB_NAME = "travel_translation_memory_db";
const DB_VERSION = 2;
const STORES = {
  memories: "memories",
  queue: "queue",
  sourceImages: "sourceImages",
  meta: "meta",
};

let dbPromise;

function openDb() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORES.memories)) {
        const memories = db.createObjectStore(STORES.memories, { keyPath: "id" });
        memories.createIndex("createdAt", "createdAt");
        memories.createIndex("topic", "topic");
        memories.createIndex("status", "status");
      }
      if (!db.objectStoreNames.contains(STORES.queue)) {
        const queue = db.createObjectStore(STORES.queue, { keyPath: "id" });
        queue.createIndex("status", "status");
        queue.createIndex("createdAt", "createdAt");
      }
      if (!db.objectStoreNames.contains(STORES.sourceImages)) {
        const sourceImages = db.createObjectStore(STORES.sourceImages, { keyPath: "id" });
        sourceImages.createIndex("createdAt", "createdAt");
        sourceImages.createIndex("kind", "kind");
      }
      if (!db.objectStoreNames.contains(STORES.meta)) {
        db.createObjectStore(STORES.meta, { keyPath: "key" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  return dbPromise;
}

async function withStore(storeName, mode, operation) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, mode);
    const store = tx.objectStore(storeName);
    const request = operation(store);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function getAll(storeName) {
  return withStore(storeName, "readonly", (store) => store.getAll());
}

async function put(storeName, value) {
  await withStore(storeName, "readwrite", (store) => store.put(value));
  return value;
}

async function remove(storeName, key) {
  return withStore(storeName, "readwrite", (store) => store.delete(key));
}

async function getMeta(key) {
  const item = await withStore(STORES.meta, "readonly", (store) => store.get(key));
  return item?.value;
}

async function setMeta(key, value) {
  return put(STORES.meta, { key, value });
}

async function ensureSeedMemories(seedMemories) {
  const seeded = await getMeta("seeded_v01");
  const memories = await getAll(STORES.memories);
  if (!seeded && memories.length === 0) {
    await Promise.all(seedMemories.map((memory) => put(STORES.memories, memory)));
    await setMeta("seeded_v01", true);
    return seedMemories;
  }
  return memories;
}

async function loadAppData(seedMemories, defaultSettings) {
  const memories = await ensureSeedMemories(seedMemories);
  const settings = (await getMeta("settings")) || defaultSettings;
  const queue = await getAll(STORES.queue);
  const sourceImages = await getAll(STORES.sourceImages);
  return { memories, settings, queue, sourceImages };
}

async function saveMemory(memory) {
  return put(STORES.memories, memory);
}

async function saveSourceImage(sourceImage) {
  return put(STORES.sourceImages, sourceImage);
}

async function getSourceImage(id) {
  return withStore(STORES.sourceImages, "readonly", (store) => store.get(id));
}

async function removeMemory(id) {
  return remove(STORES.memories, id);
}

async function saveSettings(settings) {
  return setMeta("settings", settings);
}

async function enqueueTask(task) {
  return put(STORES.queue, {
    status: "pending",
    attempts: 0,
    createdAt: new Date().toISOString(),
    ...task,
  });
}

async function updateTask(task) {
  return put(STORES.queue, task);
}

async function clearCompletedQueue() {
  const tasks = await getAll(STORES.queue);
  await Promise.all(tasks.filter((task) => task.status === "done").map((task) => remove(STORES.queue, task.id)));
  return getAll(STORES.queue);
}

export const storage = {
  loadAppData,
  saveMemory,
  removeMemory,
  saveSourceImage,
  getSourceImage,
  saveSettings,
  enqueueTask,
  updateTask,
  clearCompletedQueue,
};
