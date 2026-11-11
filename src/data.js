export const categoryOrder = ['Ownership', 'Insurance', 'Certificates', 'Plans & drawings', 'Warranties'];
export const navItems = ['Property', 'Projects', 'Contacts', 'Documents'];
export const uid = () => crypto.randomUUID();
export const today = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/London' }).format(new Date());
export const formatDate = value => { const date = new Date(value + 'T12:00:00'); return value && !Number.isNaN(date.getTime()) ? new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(date) : 'Not recorded'; };
export const money = value => value === '' || value == null ? 'Not set' : new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(Number(value));
export function initialData() {
  return {
    version: 1,
    property: { name: 'My property', address: '', type: 'House', notes: '', purchaseDate: '', sample: true },
    documents: [
      { id: 'doc-title', name: 'Title register', category: 'Ownership', related: 'Whole property', date: '2020-02-03', notes: 'Keep your ownership records and purchase paperwork together.', sample: true },
      { id: 'doc-deed', name: 'Transfer deed', category: 'Ownership', related: 'Whole property', date: '2020-02-03', notes: '', sample: true },
      { id: 'doc-policy', name: 'Buildings & contents policy', category: 'Insurance', related: 'Whole property', date: '2026-01-15', insurer: 'Example Mutual', policyNumber: 'DEMO-10482', renewal: '2027-01-15', premium: '384', excess: '250', status: 'Active', notes: 'Example policy record. Replace these details with your own cover.', sample: true },
      { id: 'doc-epc', name: 'Energy performance certificate', category: 'Certificates', related: 'Whole property', date: '2024-03-10', expiry: '2034-03-10', notes: '', sample: true },
      { id: 'doc-electrical', name: 'Electrical installation certificate', category: 'Certificates', related: 'Whole property', date: '2024-06-22', notes: '', sample: true },
      { id: 'doc-plan', name: 'Ground floor plan', category: 'Plans & drawings', related: 'Whole property', date: '2024-08-05', notes: 'Illustrative plan only. Upload your own measured drawing.', sample: true },
    ],
    projects: [
      { id: 'project-kitchen', name: 'Kitchen renovation', related: 'Kitchen', status: 'Planning', budget: '8500', spent: '', due: '', contactId: '', nextAction: 'Compare contractor quotes', notes: 'Improve storage and lighting. Confirm the scope before approving work.', sample: true },
      { id: 'project-garden', name: 'Replace garden fencing', related: 'Garden', status: 'Getting quotes', budget: '1800', spent: '', due: '', contactId: '', nextAction: 'Arrange a site visit', notes: '', sample: true },
      { id: 'project-hall', name: 'Hallway decoration', related: 'Hallway', status: 'Idea', budget: '', spent: '', due: '', contactId: '', nextAction: 'Choose paint samples', notes: '', sample: true },
    ],
    contacts: [
      { id: 'contact-jamie', name: 'Jamie Brooks', company: 'Example Heating Co.', trade: 'Plumber & heating engineer', phone: '', email: '', website: '', status: 'Preferred', notes: 'Sample contact. Add your trusted tradespeople and how you found them.', sample: true },
      { id: 'contact-sam', name: 'Sam Patel', company: 'Example Electrical', trade: 'Electrician', phone: '', email: '', website: '', status: 'Contact saved', notes: '', sample: true },
      { id: 'contact-rowan', name: 'Rowan Hill', company: '', trade: 'Carpenter & joiner', phone: '', email: '', website: '', status: 'Contact saved', notes: '', sample: true },
    ],
    rooms: [
      { id: 'room-kitchen', name: 'Kitchen', location: 'Ground floor', dimensions: '', paint: '', notes: '', sample: true },
      { id: 'room-hall', name: 'Hallway', location: 'Ground floor', dimensions: '', paint: '', notes: '', sample: true },
      { id: 'room-garden', name: 'Garden', location: 'Outside', dimensions: '', paint: '', notes: '', sample: true },
    ],
    maintenance: [
      { id: 'task-boiler', name: 'Annual boiler service', related: 'Heating', due: '2026-12-15', status: 'To book', frequency: 'Annually', contactId: '', notes: '', sample: true },
      { id: 'task-gutters', name: 'Clear the gutters', related: 'Exterior', due: '2026-11-30', status: 'Planned', frequency: 'Annually', contactId: '', notes: '', sample: true },
    ],
  };
}

const DB_NAME = 'hearth-house-register';
let dbPromise;
function database() {
  if (!dbPromise) dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore('state');
      request.result.createObjectStore('files');
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  return dbPromise;
}
async function transaction(storeName, mode, action) {
  const db = await database();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, mode);
    const request = action(tx.objectStore(storeName));
    let result;
    if (request) request.onsuccess = () => { result = request.result; };
    tx.oncomplete = () => resolve(result);
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error || new Error('Storage transaction aborted'));
  });
}
export const loadData = () => transaction('state', 'readonly', store => store.get('house'));
export const saveData = state => transaction('state', 'readwrite', store => store.put(state, 'house'));
export const putFile = (id, file) => transaction('files', 'readwrite', store => store.put(file, id));
export const getFile = id => transaction('files', 'readonly', store => store.get(id));
export const removeFile = id => transaction('files', 'readwrite', store => store.delete(id));
export async function fileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
export function base64AsBlob(base64, type) {
  const binary = atob(base64);
  return new Blob([Uint8Array.from(binary, c => c.charCodeAt(0))], { type });
}
export function validateBackup(backup) {
  if (!['miyard-backup', 'hearth-backup'].includes(backup.format) || backup.version !== 1 || !backup.data?.property || typeof backup.data.property.name !== 'string') throw new Error('This is not a supported MiYard backup.');
  for (const key of ['documents', 'projects', 'contacts', 'rooms', 'maintenance']) {
    if (!Array.isArray(backup.data[key]) || backup.data[key].some(r => !r || typeof r.id !== 'string' || typeof r.name !== 'string')) throw new Error('The backup contains invalid records.');
    if (new Set(backup.data[key].map(r => r.id)).size !== backup.data[key].length) throw new Error('The backup contains duplicate records.');
    if (backup.data[key].some(row => Object.values(row).some(value => value !== null && !['string', 'number', 'boolean'].includes(typeof value)))) throw new Error('The backup contains unsupported field values.');
    const textFields = ['id', 'name', 'category', 'related', 'date', 'notes', 'insurer', 'policyNumber', 'renewal', 'expiry', 'status', 'fileId', 'fileName', 'fileType', 'updatedAt', 'due', 'contactId', 'nextAction', 'company', 'trade', 'phone', 'email', 'website', 'location', 'dimensions', 'paint', 'frequency', 'completedAt'];
    if (backup.data[key].some(row => textFields.some(field => row[field] != null && typeof row[field] !== 'string'))) throw new Error('The backup contains invalid text fields.');
    if (backup.data[key].some(row => ['budget', 'spent', 'premium', 'excess', 'fileSize'].some(field => row[field] != null && row[field] !== '' && (!Number.isFinite(Number(row[field])) || Number(row[field]) < 0)))) throw new Error('The backup contains invalid amounts.');
  }
  if (Object.values(backup.data.property).some(value => value !== null && !['string', 'number', 'boolean'].includes(typeof value))) throw new Error('The property record is invalid.');
  if (backup.data.documents.some(row => !categoryOrder.includes(row.category))) throw new Error('The backup contains an unknown document category.');
  if (!Array.isArray(backup.files) || backup.files.some(f => typeof f.id !== 'string' || typeof f.base64 !== 'string' || typeof f.type !== 'string')) throw new Error('The backup contains invalid attachments.');
  const fileIds = new Set(backup.files.map(f => f.id));
  if (backup.data.documents.some(d => d.fileId && !fileIds.has(d.fileId))) throw new Error('This backup is missing an attachment.');
  return backup;
}
export async function restoreBackup(backup) {
  validateBackup(backup);
  const blobs = backup.files.map(file => ({ id: file.id, blob: base64AsBlob(file.base64, file.type) }));
  const db = await database();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(['state', 'files'], 'readwrite');
    const files = tx.objectStore('files');
    files.clear();
    blobs.forEach(file => files.put(file.blob, file.id));
    tx.objectStore('state').put(backup.data, 'house');
    tx.oncomplete = () => resolve(backup.data);
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error || new Error('Restore failed. Your existing data was kept.'));
  });
}
