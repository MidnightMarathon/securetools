'use strict';

// ── Validation & normalization ──────────────────────────────────────────────

function isValidMAC(mac) {
  return /^([0-9a-fA-F]{2}:){5}[0-9a-fA-F]{2}$|^[0-9a-fA-F]{12}$/.test(mac.trim());
}

function normalizeMAC(mac) {
  return mac.replace(/:/g, '').toUpperCase();
}

// ── UUID generation ─────────────────────────────────────────────────────────

function generateUUIDv4() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = [...bytes].map(b => b.toString(16).padStart(2, '0'));
  return (
    hex.slice(0,  4).join('') + '-' +
    hex.slice(4,  6).join('') + '-' +
    hex.slice(6,  8).join('') + '-' +
    hex.slice(8, 10).join('') + '-' +
    hex.slice(10, 16).join('')
  );
}

function generateUUIDv1(mac) {
  if (mac.length !== 12) return null;
  const node = [];
  for (let i = 0; i < 12; i += 2) node.push(parseInt(mac.substr(i, 2), 16));

  const UUID_EPOCH_START = Date.UTC(1582, 9, 15);
  const timeSinceEpoch   = BigInt(Date.now() - UUID_EPOCH_START) * 10000n;

  const timeLow = Number(timeSinceEpoch & 0xFFFFFFFFn);
  const timeMid = Number((timeSinceEpoch >> 32n) & 0xFFFFn);
  const timeHi  = Number((timeSinceEpoch >> 48n) & 0x0FFFn);

  const clockSeq = crypto.getRandomValues(new Uint8Array(2));

  const bytes = new Uint8Array(16);
  bytes[0] = timeLow & 0xFF;
  bytes[1] = (timeLow >> 8)  & 0xFF;
  bytes[2] = (timeLow >> 16) & 0xFF;
  bytes[3] = (timeLow >> 24) & 0xFF;
  bytes[4] = timeMid & 0xFF;
  bytes[5] = (timeMid >> 8)  & 0xFF;
  bytes[6] = (timeHi & 0x0F) | 0x10;
  bytes[7] = (timeHi >> 4)   & 0xFF;
  bytes[8] = (clockSeq[0] & 0x3F) | 0x80;
  bytes[9] = clockSeq[1];
  bytes.set(node, 10);

  const hex = [...bytes].map(b => b.toString(16).padStart(2, '0'));
  return (
    hex.slice(0,  4).join('') + '-' +
    hex.slice(4,  6).join('') + '-' +
    hex.slice(6,  8).join('') + '-' +
    hex.slice(8, 10).join('') + '-' +
    hex.slice(10, 16).join('')
  );
}

// ── Copy helper ─────────────────────────────────────────────────────────────

function copyOutput(outputEl, msgEl) {
  outputEl.select();
  navigator.clipboard.writeText(outputEl.value).then(() => {
    msgEl.style.display = 'block';
    setTimeout(() => { msgEl.style.display = 'none'; }, 2000);
  });
}

// ── Wire up ─────────────────────────────────────────────────────────────────

const macInput      = document.getElementById('mac-input');
const generateV1Btn = document.getElementById('generate-v1');
const generateV4Btn = document.getElementById('generate-v4');
const uuidOutputV1  = document.getElementById('uuid-output-v1');
const uuidOutputV4  = document.getElementById('uuid-output-v4');
const copyMsgV1     = document.getElementById('copy-msg-v1');
const copyMsgV4     = document.getElementById('copy-msg-v4');

macInput.addEventListener('input', () => {
  const valid = isValidMAC(macInput.value);
  generateV1Btn.disabled    = !valid;
  macInput.style.borderColor = valid ? '#2d9cdb' : '#ccc';
});

generateV4Btn.addEventListener('click', () => {
  uuidOutputV4.value        = generateUUIDv4();
  copyMsgV4.style.display   = 'none';
});

generateV1Btn.addEventListener('click', () => {
  const uuid = generateUUIDv1(normalizeMAC(macInput.value));
  uuidOutputV1.value       = uuid ?? 'Invalid MAC address.';
  copyMsgV1.style.display  = 'none';
});

uuidOutputV4.addEventListener('click', () => copyOutput(uuidOutputV4, copyMsgV4));
uuidOutputV1.addEventListener('click', () => copyOutput(uuidOutputV1, copyMsgV1));

// Generate a v4 on load so the field isn't empty
generateV4Btn.click();
