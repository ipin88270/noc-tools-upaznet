/* ═══════════════════════════════════════════════════════════
   GPON UPAZNET — UNB Script Generator
   app.js
═══════════════════════════════════════════════════════════ */

'use strict';

/* ── SCRIPT TEMPLATES ─────────────────────────────────────── */
const TEMPLATES = {

  v100: (v) =>
`conf t
interface gpon-olt_${v.IF}
  onu ${v.OID} type ALL sn ${v.SN}
exit
interface gpon-onu_${v.IF}:${v.OID}
  name ${v.IDP}
  description ${v.IDP} - ${v.NMP}
  tcont 1 profile kusuma
  gemport 1 tcont 1
  service-port 1 vport 1 user-vlan 100 vlan 100
exit
pon-onu-mng gpon-onu_${v.IF}:${v.OID}
  service 1 gemport 1 vlan 100
  wan-ip 1 mode pppoe username ${v.PU} password ${v.PP} vlan-profile v100 host 1
  security-mgmt 1 state enable mode forward protocol web
exit
exit
write`,

  rename: (v) =>
`conf t
interface gpon-onu_${v.IF}:${v.OID}
  name ${v.IDP}
  description ${v.IDP} - ${v.NMP}
exit`,

  v1600: (v) =>
`conf t
interface gpon-olt_${v.IF}
 onu ${v.OID} type ALL sn ${v.SN}
exit
interface gpon-onu_${v.IF}:${v.OID}
 name ${v.IDP}
 description ${v.IDP} - ${v.NMP}
 sn-bind enable sn
 tcont 1 name PPPOE profile kusuma
 gemport 1 name PPPOE tcont 1
 switchport mode hybrid vport 1
 service-port 1 vport 1 user-vlan 1600 vlan 1600
exit
pon-onu-mng gpon-onu_${v.IF}:${v.OID}
 service ServiceName gemport 1 cos 0 vlan 1600
 wan-ip 1 mode pppoe username ${v.PU} password ${v.PP} vlan-profile vlan1600 host 1
 wan-ip 1 ping-response enable traceroute-response enable
 security-mgmt 212 state enable mode forward protocol web
exit
exit
write`,

  v1501: (v) =>
`conf t
interface gpon-olt_${v.IF}
 onu ${v.OID} type ALL sn ${v.SN}
exit
interface gpon-onu_${v.IF}:${v.OID}
 name ${v.IDP}
 description ${v.IDP} - ${v.NMP}
 sn-bind enable sn
 tcont 1 name PPPOE profile kusuma
 gemport 1 name PPPOE tcont 1
 switchport mode hybrid vport 1
 service-port 1 vport 1 user-vlan 1501 vlan 1501
exit
pon-onu-mng gpon-onu_${v.IF}:${v.OID}
 service ServiceName gemport 1 cos 0 vlan 1501
 wan-ip 1 mode pppoe username ${v.PU} password ${v.PP} vlan-profile bolo host 1
 wan-ip 1 ping-response enable traceroute-response enable
 security-mgmt 212 state enable mode forward protocol web
exit
exit
write`,

  v602: (v) =>
`conf t
interface gpon-olt_${v.IF}
 onu ${v.OID} type ALL-ONT sn ${v.SN}
exit
interface gpon-onu_${v.IF}:${v.OID}
 name ${v.IDP}
 description ${v.IDP} - ${v.NMP}
 sn-bind enable sn
 tcont 1 name PPPOE profile metro10
 gemport 1 name PPPOE tcont 1
 switchport mode hybrid vport 1
 service-port 1 vport 1 user-vlan 602 vlan 602
exit
pon-onu-mng gpon-onu_${v.IF}:${v.OID}
 service ServiceName gemport 1 cos 0 vlan 602
 wan-ip 1 mode pppoe username ${v.PU} password ${v.PP} vlan-profile vlan602 host 1
 wan-ip 1 ping-response enable traceroute-response enable
 security-mgmt 212 state enable mode forward protocol web
exit
exit
write`,

  v903: (v) =>
`conf t
interface gpon-olt_${v.IF}
 onu ${v.OID} type ALL-ONT sn ${v.SN}
exit
interface gpon-onu_${v.IF}:${v.OID}
 name ${v.IDP}
 description ${v.IDP} - ${v.NMP}
 sn-bind enable sn
 tcont 1 name PPPOE profile default
 gemport 1 name PPPOE tcont 1
 encrypt 1 enable downstream
 switchport mode hybrid vport 1
 service-port 1 vport 1 user-vlan 903 vlan 903
exit
pon-onu-mng gpon-onu_${v.IF}:${v.OID}
 service ServiceName gemport 1 cos 0 vlan 903
 wan-ip 1 mode pppoe username ${v.PU} password ${v.PP} vlan-profile vlan903 host 1
 wan-ip 1 ping-response enable traceroute-response enable
 security-mgmt 212 state enable mode forward protocol web
exit
exit
write`,


  bridge: (v) =>
`conf t
interface gpon-olt_${v.IF}
 onu ${v.OID} type ALL sn ${v.SN}
exit
interface gpon-onu_${v.IF}:${v.OID}
 name ${v.IDP}
 description ${v.IDP} - ${v.NMP}
 sn-bind enable sn
 tcont 1 name PPPOE profile kusuma
 gemport 1 name PPPOE tcont 1
 gemport 2 name PPPOE tcont 1
 service-port 1 vport 1 user-vlan 105 vlan 105
 service-port 2 vport 2 user-vlan 102 vlan 102
exit
pon-onu-mng gpon-onu_${v.IF}:${v.OID}
 service 105 gemport 1 vlan 105
 service pppoe gemport 2 vlan 102
 vlan port eth_0/1 mode tag vlan 105
 vlan port eth_0/2 mode tag vlan 105
 vlan port eth_0/3 mode tag vlan 105
 vlan port eth_0/4 mode tag vlan 105
 wan-ip 1 mode pppoe username ${v.PU} password ${v.PP} vlan-profile pppoe_vlan102 host 1
 security-mgmt 1 state enable mode forward protocol web
exit
exit
write`,

  bridge_bolo: (v) =>
`conf t
interface gpon-olt_${v.IF}
 onu ${v.OID} type ALL sn ${v.SN}
exit
interface gpon-onu_${v.IF}:${v.OID}
 name ${v.IDP}
 description ${v.IDP} - ${v.NMP}
 sn-bind enable sn
 tcont 1 name PPPOE profile kusuma
 gemport 1 name PPPOE tcont 1
 gemport 2 name PPPOE tcont 1
 service-port 1 vport 1 user-vlan 1500 vlan 1500
 service-port 2 vport 2 user-vlan 1501 vlan 1501
exit
pon-onu-mng gpon-onu_${v.IF}:${v.OID}
 service 1500 gemport 1 vlan 1500
 service pppoe gemport 2 vlan 1501
 vlan port eth_0/1 mode hybrid def-vlan 1500
 vlan port eth_0/2 mode hybrid def-vlan 1500
 vlan port eth_0/3 mode hybrid def-vlan 1500
 wan-ip 1 mode pppoe username ${v.PU} password ${v.PP} vlan-profile bolo host 1
 security-mgmt 1 state enable mode forward protocol web
exit
exit
write`,

  bridge_1601: (v) =>
`conf t
interface gpon-olt_${v.IF}
  onu ${v.OID} type ALL sn ${v.SN}
exit
interface gpon-onu_${v.IF}:${v.OID}
  name ${v.IDP}
  description ${v.IDP} - ${v.NMP}
  sn-bind enable sn
  tcont 1 profile kusuma
  gemport 1 tcont 1
  gemport 2 tcont 1
  service-port 1 vport 1 user-vlan 1600 vlan 1600
  service-port 2 vport 2 user-vlan 1601 vlan 1601
exit
pon-onu-mng gpon-onu_${v.IF}:${v.OID}
  service pppoe gemport 1 vlan 1600
  service 1601 gemport 2 vlan 1601
  vlan port eth_0/1 mode hybrid def-vlan 1601
  vlan port eth_0/2 mode hybrid def-vlan 1601
  vlan port eth_0/3 mode hybrid def-vlan 1601
  vlan port eth_0/4 mode hybrid def-vlan 1601
  wan-ip mode pppoe username ${v.PU} password ${v.PP} vlan-profile vlan1600 host 1
  security-mgmt 1 state enable mode forward protocol web
exit
exit
write`,

  ucd_v511: (v) =>
`conf t
interface gpon-olt_${v.IF}
  onu ${v.OID} type ALL sn ${v.SN}
exit
interface gpon-onu_${v.IF}:${v.OID}
  name ${v.IDP}
  description ${v.IDP} - ${v.NMP}
  sn-bind enable sn
  tcont 1 name PPPOE profile kusuma
  gemport 1 name PPPOE tcont 1
  switchport mode hybrid vport 1
  service-port 1 vport 1 user-vlan 511 vlan 511
exit
pon-onu-mng gpon-onu_${v.IF}:${v.OID}
  service ServiceName gemport 1 cos 0 vlan 511
  wan-ip 1 mode pppoe username ${v.PU} password ${v.PP} vlan-profile 511 host 1
  wan-ip 1 ping-response enable traceroute-response enable
  security-mgmt 212 state enable mode forward protocol web
exit
exit
write`,

  ucd_bridge514: (v) =>
`conf t
interface gpon-olt_${v.IF}
  onu ${v.OID} type ALL sn ${v.SN}
exit
interface gpon-onu_${v.IF}:${v.OID}
  name ${v.IDP}
  description ${v.IDP} - ${v.NMP}
  sn-bind enable sn
  tcont 1 name PPPOE profile kusuma
  gemport 1 name PPPOE tcont 1
  gemport 2 name PPPOE tcont 1
  service-port 1 vport 1 user-vlan 514 vlan 514
  service-port 2 vport 2 user-vlan 511 vlan 511
exit
pon-onu-mng gpon-onu_${v.IF}:${v.OID}
  service 514 gemport 1 vlan 514
  service pppoe gemport 2 vlan 511
  vlan port eth_0/1 mode tag vlan 514
  vlan port eth_0/2 mode tag vlan 514
  vlan port eth_0/3 mode tag vlan 514
  wan-ip 1 mode pppoe username ${v.PU} password ${v.PP} vlan-profile 511 host 1
  security-mgmt 1 state enable mode forward protocol web
exit
exit
write`,
};

/* ── COMMAND HUB DEFINITIONS ──────────────────────────────── */
// Setiap grup berisi { group, items[] }
// Setiap item: { label, fn(v) → string }
const CMD_DEFS = [

  /* ── 1. MONITORING & DIAGNOSA ─────────────────────────── */
  { group: '1 · MONITORING & DIAGNOSA', items: [
    { label: 'CEK SN TERCONFIG PORT',
      fn: v => `show gpon onu baseinfo gpon-olt_${v.IF}` },
    { label: 'CEK DETAIL STATUS PELANGGAN',
      fn: v => `show gpon onu detail-info gpon-onu_${v.IF}:${v.OID}` },
    { label: 'CEK INTERFACE PELANGGAN',
      fn: v => `show run interface gpon-onu_${v.IF}:${v.OID}` },
    { label: 'CEK TIPE & VERSI FIRMWARE ONT',
      fn: v => `show gpon onu version gpon-onu_${v.IF}:${v.OID}` },
  ]},

  /* ── 2. KUALITAS SINYAL OPTIK ──────────────────────────── */
  { group: '2 · KUALITAS SINYAL OPTIK', items: [
    { label: 'CEK REDAMAN SELURUH ONU 1 PORT',
      fn: v => `show pon power onu-rx gpon-olt_${v.IF}` },
    { label: 'CEK TX POWER SFP OLT',
      fn: v => `show pon power olt-tx gpon-olt_${v.IF}` },
    { label: 'CEK KESEHATAN MODUL SFP OLT',
      fn: v => `show optical-module gpon-olt_${v.IF}` },
    { label: 'CEK JARAK KABEL FO KE PELANGGAN',
      fn: v => `show gpon onu distance gpon-olt_${v.IF}` },
  ]},

  /* ── 3. SEARCH, MAC & TRAFFIC ──────────────────────────── */
  { group: '3 · SEARCH, MAC & TRAFFIC', items: [
    { label: 'CEK ONU UNCONFIGURED / BELUM REGISTER',
      fn: _ => `show gpon onu uncfg` },
    { label: 'CARI INTERFACE ONU BERDASARKAN SN',
      fn: v => `show gpon onu by sn ${v.SN}` },
    { label: 'CARI PORT BERDASARKAN MAC ADDRESS',
      fn: v => `show mac ${v.MAC}` },
    { label: 'CEK TRAFFIC REALTIME & STATISTIK ERROR',
      fn: v => `show interface gpon-onu_${v.IF}:${v.OID}` },
    { label: 'CARI SESSION AKTIF DI MIKROTIK (WINBOX)',
      fn: v => `/ppp active print detail where name="${v.PU}"` },
  ]},

  /* ── 4. PROVISIONING & MIGRASI ─────────────────────────── */
  { group: '4 · PROVISIONING & MIGRASI', items: [
    { label: 'AKTIVASI / ENABLE PORT OLT',
      fn: v => `configure terminal\ninterface gpon-olt_${v.IF}\nno shutdown\nexit` },
  ]},


  /* ── 5. MAINTENANCE & CONTROL ONT ──────────────────────── */
  { group: '5 · MAINTENANCE & CONTROL ONT', items: [
    { label: 'REBOOT ONT REMOTE',
      fn: v => `configure terminal\npon-onu-mng gpon-onu_${v.IF}:${v.OID}\nreboot\nexit` },
    { label: 'FACTORY RESET ONT REMOTE',
      fn: v => `configure terminal\npon-onu-mng gpon-onu_${v.IF}:${v.OID}\nrestore factory\nexit` },
  ]},

  /* ── 6. ALARM, LOG & SISTEM OLT ────────────────────────── */
  { group: '6 · ALARM, LOG & SISTEM OLT', items: [
    { label: 'CEK RIWAYAT ALARM (DyingGasp / LOS)',
      fn: _ => `show logging alarm\nshow gpon alarm history` },
    { label: 'CEK BEBAN CPU & RAM OLT',
      fn: _ => `show processor\nshow memory` },
    { label: 'SIMPAN KONFIGURASI (WRITE)',
      fn: _ => `write` },
  ]},
];

/* ── DOM REFS ─────────────────────────────────────────────── */
const $ = (id) => document.getElementById(id);

/* ── INDEXEDDB STORAGE ────────────────────────────────────── */
const APP_DB_NAME = 'gponUpaznetDB';
const APP_DB_VERSION = 1;
const APP_STORE_NAME = 'appData';
const DEFAULT_DATA_ONLY = false;
const EMPTY_DEFAULT_FTTH_NETWORK = true;
let appDbPromise;

function openAppDb() {
  if (appDbPromise) return appDbPromise;
  appDbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(APP_DB_NAME, APP_DB_VERSION);
    request.onupgradeneeded = () => request.result.createObjectStore(APP_STORE_NAME);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  return appDbPromise;
}

async function readAppData(key, fallback) {
  try {
    const snapshot = await CLOUD_STATE_DOC.get();
    if (snapshot.exists && snapshot.exists() && Object.prototype.hasOwnProperty.call(snapshot.data(), key)) {
      return snapshot.data()[key];
    }
  } catch (error) {
    console.warn('Cloud read failed, using local fallback:', error);
  }
  try {
    const db = await openAppDb();
    return await new Promise((resolve, reject) => {
      const request = db.transaction(APP_STORE_NAME, 'readonly').objectStore(APP_STORE_NAME).get(key);
      request.onsuccess = () => resolve(request.result === undefined ? fallback : request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('IndexedDB read failed:', error);
    return fallback;
  }
}

async function writeAppData(key, value) {
  try {
    await CLOUD_STATE_DOC.set({ [key]: value, updatedAt: firebase.firestore.FieldValue.serverTimestamp() }, { merge: true });
    return;
  } catch (error) {
    console.warn('Cloud write failed, using local fallback:', error);
  }
  if (DEFAULT_DATA_ONLY) return;
  try {
    const db = await openAppDb();
    await new Promise((resolve, reject) => {
      const request = db.transaction(APP_STORE_NAME, 'readwrite').objectStore(APP_STORE_NAME).put(value, key);
      request.onsuccess = resolve;
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('IndexedDB write failed:', error);
    showToast('Penyimpanan lokal gagal diperbarui.');
  }
}

async function migrateStorageData() {
  const migrations = [
    ['ftthPoints', null],
    ['ftthRoutes', []],
    ['unbScriptHistory', []],
    ['gponCustomers', []],
  ];
  for (const [key, fallback] of migrations) {
    const current = await readAppData(key, undefined);
    if (current !== undefined) continue;
    const legacy = localStorage.getItem(key);
    const value = legacy === null ? fallback : (() => {
      try { return JSON.parse(legacy); } catch { return fallback; }
    })();
    await writeAppData(key, value);
    if (legacy !== null) localStorage.removeItem(key);
  }
}

const EL = {
  configType:    $('configType'),
  interfaceOlt:  $('interfaceOlt'),
  onuId:         $('onuId'),
  sn:            $('sn'),
  macAddr:       $('macAddr'),
  idPelanggan:   $('idPelanggan'),
  namaPelanggan: $('namaPelanggan'),
  paketLayanan:  $('paketLayanan'),
  pppoeUser:     $('pppoeUser'),
  pppoePass:     $('pppoePass'),
  outputOlt:     $('outputOlt'),
  outputMkt:     $('outputMkt'),
  cmdList:       $('cmdList'),
  cmdSearch:     $('cmdSearch'),
  toastContainer:$('toast-container'),
  validationMsg: $('validationMsg'),
  hintInterface: $('hintInterface'),
  // modal
  qfModal:       $('qfModal'),
  qfClose:       $('qfClose'),
  qfCancel:      $('qfCancel'),
  qfSubmit:      $('qfSubmit'),
  tabKoneksi:    $('tabKoneksi'),
  tabOnu:        $('tabOnu'),
  panelKoneksi:  $('panelKoneksi'),
  panelOnu:      $('panelOnu'),
  pasteKoneksi:  $('pasteKoneksi'),
  pasteOnu:      $('pasteOnu'),
  // branch buttons
  branchUnb:     $('branchUnb'),
  branchUcd:     $('branchUcd'),
};

// Branch sets for configType filtering
const BRANCH_SETS = {
  unb: new Set(['v100','v1600','v1501','v602','v903','bridge','bridge_bolo','bridge_1601']),
  ucd: new Set(['ucd_v511','ucd_bridge514'])
};

function setBranch(branch) {
  const sel = EL.configType;
  if (!sel) return;
  let firstVisible = -1;
  for (let i=0;i<sel.options.length;i++) {
    const opt = sel.options[i];
    const val = opt.value;
    if (BRANCH_SETS[branch] && BRANCH_SETS[branch].has(val)) {
      opt.style.display = '';
      if (firstVisible === -1) firstVisible = i;
    } else {
      opt.style.display = 'none';
    }
  }
  // select first visible option
  if (firstVisible >= 0) sel.selectedIndex = firstVisible;
  // update button active states (simple class toggle)
  if (EL.branchUnb && EL.branchUcd) {
    EL.branchUnb.classList.toggle('active', branch === 'unb');
    EL.branchUcd.classList.toggle('active', branch === 'ucd');
  }
  renderCmdHub();
}

// attach listeners to branch buttons (buttons exist in DOM)
if (EL.branchUnb) EL.branchUnb.addEventListener('click', () => setBranch('unb'));
if (EL.branchUcd) EL.branchUcd.addEventListener('click', () => setBranch('ucd'));

/* ── HELPERS ──────────────────────────────────────────────── */
function getVars() {
  return {
    IF:  EL.interfaceOlt.value.trim()                || '{INTERFACE_OLT}',
    OID: EL.onuId.value.trim()                       || '{ONU_ID}',
    SN:  EL.sn.value.trim().toUpperCase()            || '{SN}',
    IDP: EL.idPelanggan.value.trim()                 || '{ID_PELANGGAN}',
    NMP: EL.namaPelanggan.value.trim().toUpperCase() || '{NAMA_PELANGGAN}',
    PL:  EL.paketLayanan.value,
    PU:  EL.pppoeUser.value.trim()                   || '{PPPOE_USER}',
    PP:  EL.pppoePass.value.trim()                   || '{PPPOE_PASS}',
    MAC: EL.macAddr.value.trim()                     || '{MAC}',
  };
}

/* ── VALIDASI FORM ────────────────────────────────────────── */
const REQUIRED_FIELDS = [
  { el: () => EL.interfaceOlt,  label: 'Interface OLT',   pattern: /^\d+\/\d+\/\d+$/ },
  { el: () => EL.onuId,         label: 'ONU ID',          pattern: /^\d+$/ },
  { el: () => EL.sn,            label: 'Serial Number',   pattern: /^[A-Za-z0-9]{8,}$/ },
  { el: () => EL.idPelanggan,   label: 'ID Pelanggan',    pattern: null },
  { el: () => EL.namaPelanggan, label: 'Nama Pelanggan',  pattern: null },
  { el: () => EL.pppoeUser,     label: 'PPPoE User',      pattern: null },
  { el: () => EL.pppoePass,     label: 'PPPoE Pass',      pattern: null },
];

function validateForm() {
  const errors = [];
  // clear previous state
  REQUIRED_FIELDS.forEach(f => f.el().classList.remove('invalid'));
  EL.validationMsg.style.display = 'none';

  REQUIRED_FIELDS.forEach(f => {
    const el  = f.el();
    const val = el.value.trim();
    if (!val) {
      errors.push(`<b>${f.label}</b> wajib diisi`);
      el.classList.add('invalid');
    } else if (f.pattern && !f.pattern.test(val)) {
      if (f.label === 'Interface OLT') {
        EL.hintInterface.style.display = 'block';
      }
      errors.push(`<b>${f.label}</b> format tidak valid`);
      el.classList.add('invalid');
    }
  });

  if (errors.length) {
    EL.validationMsg.innerHTML = '⚠ ' + errors.join(' &nbsp;·&nbsp; ');
    EL.validationMsg.style.display = 'block';
    return false;
  }
  EL.hintInterface.style.display = 'none';
  return true;
}

// Hapus state invalid saat user mulai mengetik
REQUIRED_FIELDS.forEach(f => {
  f.el().addEventListener('input', () => {
    f.el().classList.remove('invalid');
    // sembunyikan hint jika interface sudah benar
    if (f.label === 'Interface OLT' && /^\d+\/\d+\/\d+$/.test(f.el().value.trim())) {
      EL.hintInterface.style.display = 'none';
    }
    EL.validationMsg.style.display = 'none';
  });
});

function showToast(msg) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
    stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>${msg}`;
  EL.toastContainer.appendChild(t);
  setTimeout(() => {
    t.classList.add('fade-out');
    setTimeout(() => t.remove(), 320);
  }, 2200);
}

function copyToClipboard(text, btn) {
  navigator.clipboard.writeText(text).catch(() => {
    // fallback execCommand
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0;';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  });
  showToast('Berhasil disalin ke clipboard!');
  if (!btn) return;
  const orig = btn.innerHTML;
  btn.classList.add('copied');
  btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
    stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Copied!`;
  setTimeout(() => { btn.classList.remove('copied'); btn.innerHTML = orig; }, 2000);
}

/* ── COMMAND HUB ──────────────────────────────────────────── */
function esc(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

/* ── COLLAPSED STATE UNTUK CMD GROUPS ────────────────────────
   Simpan state per grup (key = group label, value = true=collapsed)  */
const CMD_GROUP_STATE = {};

function renderCmdHub(query = '') {
  const v   = getVars();
  const q   = query.toLowerCase();
  EL.cmdList.innerHTML = '';
  let totalVisible = 0;

  CMD_DEFS.forEach(group => {
    // Filter items berdasarkan query
    const items = q
      ? group.items.filter(cmd =>
          cmd.label.toLowerCase().includes(q) ||
          cmd.fn(v).toLowerCase().includes(q))
      : group.items;

    if (!items.length) return; // skip grup kosong saat filter aktif

    // Group header (sembunyikan saat ada filter)
    if (!q) {
      const isCollapsed = !!CMD_GROUP_STATE[group.group];
      const hdr = document.createElement('div');
      hdr.className = 'cmd-group-header' + (isCollapsed ? ' collapsed' : '');
      hdr.innerHTML = `${esc(group.group)}<i class="chev">▾</i>`;
      hdr.addEventListener('click', () => {
        CMD_GROUP_STATE[group.group] = !CMD_GROUP_STATE[group.group];
        renderCmdHub(EL.cmdSearch.value.trim().toLowerCase());
      });
      EL.cmdList.appendChild(hdr);
      if (isCollapsed) return; // skip rendering items kalau collapsed
    }

    items.forEach(cmd => {
      const text = cmd.fn(v);
      const card = document.createElement('div');
      card.className = 'cmd-card';
      card.innerHTML = `
        <div class="cmd-card-label">${cmd.label}</div>
        <div class="cmd-code">${esc(text)}</div>`;
      card.addEventListener('click', () => {
        copyToClipboard(text);
        card.classList.add('flash-copied');
        setTimeout(() => card.classList.remove('flash-copied'), 700);
      });
      EL.cmdList.appendChild(card);
      totalVisible++;
    });
  });

  // Tampilkan pesan jika tidak ada hasil
  if (q && totalVisible === 0) {
    const msg = document.createElement('div');
    msg.className = 'cmd-no-results';
    msg.textContent = `Tidak ada command yang cocok dengan "${query}"`;
    EL.cmdList.appendChild(msg);
  }
}

/* ── HISTORY (IndexedDB, max 10) ─────────────────────────── */
const HISTORY_KEY = 'unbScriptHistory';
let historyCache = [];

function loadHistory() {
  return historyCache;
}

function saveHistory(list) {
  historyCache = list;
  writeAppData(HISTORY_KEY, list);
}

function pushHistory(entry) {
  const list = loadHistory();
  // Cegah duplikat berurutan
  if (list.length && list[0].id === entry.id) return;
  list.unshift(entry);
  if (list.length > 10) list.length = 10;
  saveHistory(list);
  renderHistory();
}

function renderHistory() {
  const list = loadHistory();
  const box  = document.getElementById('historyBox');
  const el   = document.getElementById('historyList');
  const cnt  = document.getElementById('historyCount');
  if (!list.length) {
    box.style.display = 'none';
    return;
  }
  box.style.display  = 'block';
  cnt.textContent    = list.length;
  el.innerHTML       = '';
  list.forEach(h => {
    const row = document.createElement('div');
    row.className = 'history-item';
    row.innerHTML = `
      <div class="history-item-meta">
        <div class="history-item-title">${esc(h.title)}</div>
        <div class="history-item-sub">${esc(h.type)} &nbsp;·&nbsp; ${esc(h.time)}</div>
      </div>
      <button class="history-item-btn">Recall</button>`;
    row.querySelector('.history-item-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      recallHistory(h);
    });
    el.appendChild(row);
  });
}

function recallHistory(h) {
  document.getElementById('interfaceOlt').value  = h.interfaceOlt || '';
  document.getElementById('onuId').value         = h.onuId        || '';
  document.getElementById('sn').value            = h.sn           || '';
  document.getElementById('idPelanggan').value   = h.idPelanggan  || '';
  document.getElementById('namaPelanggan').value = h.namaPelanggan|| '';
  document.getElementById('pppoeUser').value     = h.pppoeUser    || '';
  document.getElementById('pppoePass').value     = h.pppoePass    || '';
  if (h.configType) document.getElementById('configType').value    = h.configType;
  if (h.paket)      document.getElementById('paketLayanan').value  = h.paket;
  EL.outputOlt.textContent = h.scriptOlt || '';
  EL.outputMkt.textContent = h.scriptMkt || '';
  renderCmdHub();
  showToast('History berhasil di-recall!');
}

document.getElementById('btnClearHistory').addEventListener('click', () => {
  saveHistory([]);
  renderHistory();
  showToast('History dihapus!');
});

/* ── GENERATE SCRIPT ──────────────────────────────────────── */
function generateScript() {
  if (!validateForm()) {
    // scroll form ke atas agar error terlihat
    EL.validationMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    return;
  }

  const v    = getVars();
  const type = EL.configType.value;
  const fn   = TEMPLATES[type];

  const scriptOlt = fn(v);
  const scriptMkt = `/ppp secret add name=${v.PU} password=${v.PP} service=pppoe profile="${v.PL}" comment="${v.IDP}-${v.NMP}"`;

  EL.outputOlt.textContent = scriptOlt;
  EL.outputMkt.textContent = scriptMkt;
  renderVerificationCommands(v);
  setWorkflowProgress(4);

  // Simpan ke history
  const now = new Date();
  const timeStr = now.toLocaleDateString('id-ID') + ' ' + now.toLocaleTimeString('id-ID', { hour:'2-digit', minute:'2-digit' });
  pushHistory({
    id:           `${Date.now()}`,
    title:        `${v.IDP} – ${v.NMP}`,
    type:         document.getElementById('configType').options[document.getElementById('configType').selectedIndex].text,
    time:         timeStr,
    interfaceOlt: v.IF,  onuId:    v.OID, sn:           v.SN,
    idPelanggan:  v.IDP, namaPelanggan: v.NMP,
    pppoeUser:    v.PU,  pppoePass: v.PP,
    configType:   type,  paket:    v.PL,
    scriptOlt,           scriptMkt,
  });

  // Jika form punya ID Pelanggan valid, perbarui database lokal (update existing / add new)
  try {
    if (v.IDP && v.IDP !== '{ID_PELANGGAN}') {
      const customers = loadCustomers();
      const existingIdx = customers.findIndex(c => c.idPelanggan === v.IDP);
      const macFormatted = EL.macAddr.value ? formatMac(EL.macAddr.value.trim()) : '';
      const custData = {
        idPelanggan:   v.IDP,
        namaPelanggan: v.NMP || '',
        interfaceOlt:  v.IF || '',
        onuId:         v.OID || '',
        sn:            v.SN || '',
        macAddr:       macFormatted || '',
        pppoeUser:     v.PU || v.IDP,
        pppoePass:     v.PP || '',
        paket:         normalizePaket(v.PL)
      };
      if (existingIdx >= 0) {
        // merge but prefer latest non-empty values from custData
        customers[existingIdx] = Object.assign({}, customers[existingIdx], custData);
      } else {
        customers.unshift(custData);
      }
      saveCustomers(customers);
      renderCustomerTable();
    }
  } catch (err) {
    console.error('Failed to update customers DB after generate:', err);
  }

  renderCmdHub();
  showToast('Script berhasil di-generate! Data pelanggan diperbarui.');
}

function getVerificationCommands(v) {
  return [
    { label: 'Status ONU', command: `show gpon onu state gpon-olt_${v.IF}` },
    { label: 'Optical Power', command: `show pon power attenuation gpon-onu_${v.IF}:${v.OID}` },
    { label: 'WAN IP', command: `show gpon remote-onu wan-ip gpon-onu_${v.IF}:${v.OID}` },
    { label: 'MAC Address', command: `show mac gpon-onu_${v.IF}:${v.OID}` },
    { label: 'Running Configuration', command: `show onu running config gpon-onu_${v.IF}:${v.OID}` },
  ];
}

function renderVerificationCommands(v) {
  const commands = getVerificationCommands(v);
  $('verificationList').innerHTML = commands.map(item => `
    <div class="verification-item">
      <div class="verification-label">${item.label}</div>
      <div class="verification-command">${esc(item.command)}</div>
    </div>`).join('');
  $('copyVerification').dataset.commands = commands.map(item => item.command).join('\n');
}

function setWorkflowProgress(activeStep, completeThrough = activeStep - 1) {
  document.querySelectorAll('.workflow-step').forEach(step => {
    const number = Number(step.dataset.step);
    step.classList.toggle('done', number <= completeThrough);
    step.classList.toggle('active', number === activeStep);
  });
  const labels = {
    1: 'Siap melakukan register ONU.',
    2: 'Register ONU selesai. Lanjutkan konfigurasi service.',
    3: 'Service selesai. Lanjutkan konfigurasi WAN.',
    4: 'Konfigurasi dibuat. Jalankan command verifikasi di OLT.',
    5: 'Provisioning selesai dan hasil sudah disimpan.',
  };
  $('workflowStatus').textContent = labels[activeStep];
}

$('copyVerification').addEventListener('click', function() {
  const commands = this.dataset.commands || '';
  if (!commands) { showToast('Generate script terlebih dahulu!'); return; }
  copyToClipboard(commands, this);
});

$('btnWorkflowSaved').addEventListener('click', () => {
  const script = EL.outputOlt.textContent.trim();
  if (!script || script.startsWith('//')) {
    showToast('Generate script terlebih dahulu!');
    return;
  }
  setWorkflowProgress(5, 4);
  showToast('Workflow provisioning ditandai selesai!');
});

$('workflowSteps').addEventListener('click', event => {
  const step = event.target.closest('.workflow-step');
  if (!step) return;
  const number = Number(step.dataset.step);
  if (number === 4 && $('verificationList').querySelector('.verification-item')) {
    setWorkflowProgress(4);
  }
});

/* ── COPY BUTTON HANDLERS ─────────────────────────────────── */
$('copyOlt').addEventListener('click', function () {
  const txt = EL.outputOlt.textContent.trim();
  if (!txt || txt.startsWith('//')) { showToast('Generate script terlebih dahulu!'); return; }
  copyToClipboard(txt, this);
});

$('copyMkt').addEventListener('click', function () {
  const txt = EL.outputMkt.textContent.trim();
  if (!txt || txt.startsWith('//')) { showToast('Generate script terlebih dahulu!'); return; }
  copyToClipboard(txt, this);
});

/* ── EXPORT SCRIPT KE FILE .TXT ──────────────────────────── */
function downloadTxt(content, filename) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

$('exportOlt').addEventListener('click', () => {
  const txt = EL.outputOlt.textContent.trim();
  if (!txt || txt.startsWith('//')) { showToast('Generate script terlebih dahulu!'); return; }
  const v = getVars();
  downloadTxt(txt, `OLT_${v.IDP || 'script'}_${v.IF || 'port'}.txt`);
  showToast('Script OLT berhasil diunduh!');
});

$('exportMkt').addEventListener('click', () => {
  const txt = EL.outputMkt.textContent.trim();
  if (!txt || txt.startsWith('//')) { showToast('Generate script terlebih dahulu!'); return; }
  const v = getVars();
  downloadTxt(txt, `MKT_${v.IDP || 'secret'}.txt`);
  showToast('Script Mikrotik berhasil diunduh!');
});

/* ── FORM SYNC: ID Pelanggan → PPPoE User ─────────────────── */
EL.idPelanggan.addEventListener('input', function () {
  EL.pppoeUser.value = this.value;
  renderCmdHub();
});

/* ── MAC ADDRESS AUTO-FORMAT ──────────────────────────────── */
// Konversi format apapun → Cisco-style: xxxx.xxxx.xxxx
// Contoh: 8C:DC:02:BC:78:C9 → 8cdc.02bc.78c9
//         8C-DC-02-BC-78-C9 → 8cdc.02bc.78c9
//         8CDC02BC78C9      → 8cdc.02bc.78c9
function formatMac(raw) {
  // Strip semua pemisah, ambil hanya hex, lowercase
  const hex = raw.replace(/[^0-9a-fA-F]/g, '').toLowerCase();
  if (hex.length !== 12) return raw; // bukan MAC valid, kembalikan apa adanya
  return `${hex.slice(0,4)}.${hex.slice(4,8)}.${hex.slice(8,12)}`;
}

EL.macAddr.addEventListener('input', function () {
  const formatted = formatMac(this.value);
  // Hanya ganti jika hasil berbeda dan input sudah cukup panjang (12+ hex char)
  const hexLen = this.value.replace(/[^0-9a-fA-F]/g, '').length;
  if (hexLen === 12 && formatted !== this.value) {
    this.value = formatted;
  }
  renderCmdHub();
});

/* ── AUTO-REFRESH CMD HUB ─────────────────────────────────── */
['interfaceOlt', 'onuId', 'sn', 'pppoeUser', 'pppoePass'].forEach(id => {
  $(id).addEventListener('input', renderCmdHub);
});

$('btnGenerate').addEventListener('click', generateScript);

function updateMigrationFields() {
  const action = $('migrationAction').value;
  $('migration-new-interface').style.display = action === 'move-port' ? '' : 'none';
  $('migration-new-onu').style.display = action === 'move-port' ? '' : 'none';
  $('migration-new-sn').style.display = action === 'swap-sn' ? '' : 'none';
  $('migration-vlan').style.display = action === 'change-vlan' ? '' : 'none';
  $('migration-package').style.display = action === 'change-vlan' ? '' : 'none';
}

$('toggleMigration').addEventListener('click', function() {
  const body = $('migrationBody');
  const expanded = body.classList.toggle('hidden') === false;
  this.textContent = expanded ? 'Tutup' : 'Buka';
  this.setAttribute('aria-expanded', String(expanded));
});

function generateMigrationCommand() {
  const action = $('migrationAction').value;
  const interfaceOlt = EL.interfaceOlt.value.trim();
  const onuId = EL.onuId.value.trim();
  const currentSn = EL.sn.value.trim().toUpperCase();
  const idPel = EL.idPelanggan.value.trim();
  const pppoeUser = EL.pppoeUser.value.trim() || idPel;
  const pppoePass = EL.pppoePass.value.trim();
  const newInterface = $('migrationInterface').value.trim();
  const newOnuId = $('migrationOnuId').value.trim();
  const newSn = $('migrationSn').value.trim().toUpperCase();
  const vlan = $('migrationVlan').value.trim();
  const packageName = $('migrationPackage').value;

  if (!interfaceOlt || !onuId) {
    showToast('Isi Interface OLT dan ONU ID pada form utama terlebih dahulu!');
    return '';
  }

  let script;
  if (action === 'delete') {
    script = `conf t\ninterface gpon-olt_${interfaceOlt}\nno onu ${onuId}\nexit\nwrite`;
  } else if (action === 'swap-sn') {
    if (!newSn) { showToast('Isi SN Baru terlebih dahulu!'); return ''; }
    script = `conf t\ninterface gpon-onu_${interfaceOlt}:${onuId}\nregistration-method sn ${newSn}\nexit\nwrite`;
  } else if (action === 'move-port') {
    if (!newInterface || !newOnuId || !currentSn) {
      showToast('Isi Interface Baru, ONU ID Baru, dan pastikan SN lama tersedia!');
      return '';
    }
    script = `conf t\ninterface gpon-olt_${interfaceOlt}\nno onu ${onuId}\nexit\ninterface gpon-olt_${newInterface}\nonu ${newOnuId} type ALL sn ${currentSn}\nexit\nwrite`;
  } else if (action === 'change-vlan') {
    if (!vlan || !pppoeUser || !pppoePass) {
      showToast('Isi VLAN Baru, PPPoE User, dan PPPoE Pass terlebih dahulu!');
      return '';
    }
    script = `conf t\ninterface gpon-onu_${interfaceOlt}:${onuId}\n service-port 1 vport 1 user-vlan ${vlan} vlan ${vlan}\nexit\npon-onu-mng gpon-onu_${interfaceOlt}:${onuId}\n service 1 gemport 1 vlan ${vlan}\n wan-ip 1 mode pppoe username ${pppoeUser} password ${pppoePass} vlan-profile vlan${vlan} host 1\nexit\nexit\nwrite\n\n/ppp secret set [find name="${pppoeUser}"] profile="${packageName}"`;
  } else {
    script = `conf t\npon-onu-mng gpon-onu_${interfaceOlt}:${onuId}\nrestore factory\nexit\nwrite`;
  }

  $('migrationOutput').textContent = script;
  $('migrationOutput').classList.remove('hidden');
  showToast('Script operasi berhasil dibuat!');
  return script;
}

$('migrationAction').addEventListener('change', updateMigrationFields);
$('btnGenerateMigration').addEventListener('click', generateMigrationCommand);
$('btnCopyMigration').addEventListener('click', function() {
  const script = $('migrationOutput').textContent.trim();
  if (!script) { showToast('Generate script operasi terlebih dahulu!'); return; }
  copyToClipboard(script, this);
});

updateMigrationFields();

// Quick Rename helpers: generate and copy rename commands from current form values
function generateRenameCommand(includeDescription = true) {
  const ifVal = EL.interfaceOlt.value.trim();
  const oid   = EL.onuId.value.trim();
  if (!ifVal || !oid) { showToast('Isi Interface OLT dan ONU ID terlebih dahulu!'); return null; }
  const idp = EL.idPelanggan.value.trim() || EL.pppoeUser.value.trim();
  const name = EL.namaPelanggan.value.trim();
  if (!idp) { showToast('ID Pelanggan (atau PPPoE User) harus diisi!'); return null; }

  let cmd = `conf t\ninterface gpon-onu_${ifVal}:${oid}\n  name ${idp}\n`;
  if (includeDescription) cmd += `  description ${idp} - ${name || ''}\n`;
  cmd += `exit`;
  return cmd;
}

const btnQuickRename = $('btnQuickRename');
const btnNameOnly    = $('btnNameOnly');
if (btnQuickRename) btnQuickRename.addEventListener('click', () => {
  const cmd = generateRenameCommand(true);
  if (!cmd) return;
  EL.outputOlt.textContent = cmd;
  copyToClipboard(cmd);
  showToast('Perintah rename (name+description) disalin ke clipboard!');
});
if (btnNameOnly) btnNameOnly.addEventListener('click', () => {
  const cmd = generateRenameCommand(false);
  if (!cmd) return;
  EL.outputOlt.textContent = cmd;
  copyToClipboard(cmd);
  showToast('Perintah rename (name saja) disalin ke clipboard!');
});

/* ── RESET FORM ───────────────────────────────────────────── */
$('btnReset').addEventListener('click', () => {
  ['interfaceOlt','onuId','sn','macAddr','idPelanggan',
   'namaPelanggan','pppoeUser','pppoePass'].forEach(id => $(id).value = '');
  EL.configType.value    = 'v100';
  EL.paketLayanan.value  = 'KUSUMA 1';
  EL.outputOlt.innerHTML = '<span class="script-placeholder">// Isi form dan klik "Generate Script" untuk menampilkan script OLT ZTE...</span>';
  EL.outputMkt.innerHTML = '<span class="script-placeholder">// Script Mikrotik PPPoE Secret akan muncul di sini...</span>';
  $('verificationList').innerHTML = '<div class="script-placeholder">// Generate script terlebih dahulu untuk menampilkan command verifikasi...</div>';
  $('copyVerification').dataset.commands = '';
  setWorkflowProgress(1, 0);
  EL.validationMsg.style.display  = 'none';
  EL.hintInterface.style.display  = 'none';
  REQUIRED_FIELDS.forEach(f => f.el().classList.remove('invalid'));
  renderCmdHub();
  showToast('Form berhasil direset!');
});

/* ── CMD SEARCH / FILTER ──────────────────────────────────── */
EL.cmdSearch.addEventListener('input', function () {
  const q = this.value.trim().toLowerCase();
  renderCmdHub(q);
});

/* ── TAB SWITCHING ────────────────────────────────────────── */
const TAB_PANELS = {
  unb:       $('panelUnb'),
  ftth:      $('panelFtth'),
  tools:     $('panelTools'),
  pelanggan: $('panelPelanggan'),
};

/* ── FTTH VALIDATION ──────────────────────────────────────── */
const FTTH_POINTS = [
  { type: 'otb', name: 'OTB-01 UNB', coordinates: '-7.00581, 110.43821', capacity: '24 core', used: '18 port', status: 'valid' },
  { type: 'otb', name: 'OTB-02 TLOGOSARI', coordinates: '-7.01244, 110.45108', capacity: '24 core', used: '24 port', status: 'check' },
  { type: 'odc', name: 'ODC-01 UNB', coordinates: '-7.00921, 110.44517', capacity: '288 core', used: '176 port', status: 'valid' },
  { type: 'odc', name: 'ODC-02 PEDURUNGAN', coordinates: '-7.02108, 110.45920', capacity: '288 core', used: '201 port', status: 'valid' },
  { type: 'odp', name: 'ODP-01 UNB-01', coordinates: '-7.01420, 110.45211', capacity: '16 port', used: '11 port', status: 'valid' },
  { type: 'odp', name: 'ODP-02 UNB-02', coordinates: '-7.01872, 110.46208', capacity: '16 port', used: '16 port', status: 'check' },
];
let ftthMap;
let ftthMapMarkers = [];
let ftthLogicalLines = [];
let ftthSearchMarker;
let ftthTileLayer;
let ftthRouteLayers = [];
let ftthRoutes = [];
let ftthRouteEditing = false;
let ftthRoutePoints = [];
let ftthEditingRouteIndex = null;
let ftthRouteRequestId = 0;
const FTTH_ROUTING_URL = 'https://router.project-osrm.org/route/v1/driving/';
const FTTH_TYPES = { otb: ['Validasi OTB', 'Optical Terminal Box'], odc: ['Validasi ODC', 'Optical Distribution Cabinet'], odp: ['Validasi ODP', 'Optical Distribution Point'] };
let activeFtthType = 'otb';

function getPointPosition(point) {
  const [lat, lng] = point.coordinates.split(',').map(Number);
  return { lat: point.lat ?? lat, lng: point.lng ?? lng };
}

function parseSearchCoordinates(value) {
  const match = value.trim().match(/^(-?\d+(?:\.\d+)?)\s*[,; ]\s*(-?\d+(?:\.\d+)?)$/);
  if (!match) return null;
  const lat = Number(match[1]);
  const lng = Number(match[2]);
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180 ? { lat, lng } : null;
}

function getMapMarkerPosition(point, duplicateIndex, duplicateCount) {
  const position = getPointPosition(point);
  if (duplicateCount < 2) return position;
  const offset = 0.00004;
  const centeredIndex = duplicateIndex - (duplicateCount - 1) / 2;
  return { lat: position.lat, lng: position.lng + centeredIndex * offset };
}

function updateFtthMap(points, searchedCoordinates = null) {
  if (!ftthMap || !window.L) return;

  // Clear existing markers and logical lines
  ftthMapMarkers.forEach(marker => marker.remove());
  ftthLogicalLines.forEach(line => line.remove());
  ftthLogicalLines = [];

  if (ftthSearchMarker) { ftthMap.closePopup(); ftthSearchMarker.remove(); }
  document.querySelectorAll('#ftthMap .leaflet-popup').forEach(popup => popup.remove());

  // Apply map filter (tipe) + hanya tampilkan titik yang status-nya valid
  const filterEl = document.getElementById('ftthMapFilter');
  const filterVal = filterEl ? filterEl.value : 'all';
  if (filterVal !== 'all') {
    points = points.filter(p => p.type === filterVal);
  }
  points = points.filter(p => p.status === 'valid');

  // Count markers per location to offset duplicates
  const locationCounts = new Map();
  points.forEach(point => {
    const position = getPointPosition(point);
    const key = `${position.lat},${position.lng}`;
    locationCounts.set(key, (locationCounts.get(key) || 0) + 1);
  });

  const locationIndexes = new Map();
  ftthMapMarkers = points.map(point => {
    const position   = getPointPosition(point);
    const key        = `${position.lat},${position.lng}`;
    const dupIndex   = locationIndexes.get(key) || 0;
    locationIndexes.set(key, dupIndex + 1);
    const markerPos  = getMapMarkerPosition(point, dupIndex, locationCounts.get(key));
    const sameLocation = locationCounts.get(key) > 1;
    const locationNote = sameLocation ? '<br><em>Berbagi koordinat dengan titik jaringan lain</em>' : '';
    const fillColor  = point.type === 'otb' ? '#2f80ed' : point.type === 'odc' ? '#f2994a' : '#22a06b';
    return L.circleMarker([markerPos.lat, markerPos.lng], {
      radius: 8, color: '#fff', weight: 2, fillColor, fillOpacity: 0.95,
    })
      .addTo(ftthMap)
      .bindTooltip(`${point.type.toUpperCase()} ${point.name}`, {
        permanent: true, direction: 'right', offset: [9, 0],
        className: `ftth-point-label ftth-point-label-${point.type}`,
      })
      .bindPopup(
        `<strong>${point.name}</strong>${point.type.toUpperCase()} · ${point.coordinates}<br>` +
        `${point.capacity} · ${point.used}${locationNote}`
      );
  });

  // Draw logical ODP → ODC connections
  points.forEach(point => {
    if (point.type === 'odp' && point.odc) {
      const odcPoint = points.find(p => p.type === 'odc' && p.name === point.odc);
      if (odcPoint) {
        const p1   = getPointPosition(point);
        const p2   = getPointPosition(odcPoint);
        const line = L.polyline([p1, p2], { color: '#22a06b', weight: 2, dashArray: '5 5', opacity: 0.6 }).addTo(ftthMap);
        ftthLogicalLines.push(line);
      }
    }
  });

  // Pan/zoom to search result or first point
  if (searchedCoordinates) {
    ftthSearchMarker = L.marker([searchedCoordinates.lat, searchedCoordinates.lng])
      .addTo(ftthMap)
      .bindPopup(`<strong>Koordinat pencarian</strong><br>${searchedCoordinates.lat}, ${searchedCoordinates.lng}`)
      .openPopup();
    ftthMap.setView(searchedCoordinates, 17);
  } else if (points.length) {
    ftthMap.setView(getPointPosition(points[0]), 13);
  }
}

function populateRouteOptions() {
  const odpSelect = $('ftthRouteOdp');
  const odcSelect = $('ftthRouteOdc');
  if (!odpSelect || !odcSelect) return;
  odpSelect.innerHTML = '<option value="">Pilih Titik Awal (ODP/ODC)</option>' + FTTH_POINTS.filter(point => point.type === 'odp' || point.type === 'odc').map(point => `<option value="${point.name}">${point.name}</option>`).join('');
  odcSelect.innerHTML = '<option value="">Pilih Tujuan (ODC)</option>' + FTTH_POINTS.filter(point => point.type === 'odc').map(point => `<option value="${point.name}">${point.name}</option>`).join('');
}

function formatRouteDistance(meters) {
  if (!Number.isFinite(meters)) return '-';
  return meters >= 1000 ? `${(meters / 1000).toFixed(2)} km` : `${Math.round(meters)} m`;
}

async function generateNearestRoadRoute(odpName, odcName) {
  const odp = FTTH_POINTS.find(point => point.name === odpName);
  const odc = FTTH_POINTS.find(point => point.name === odcName);
  if (!odp || !odc || !ftthMap) return;

  const requestId = ++ftthRouteRequestId;
  const odpPosition = getPointPosition(odp);
  const odcPosition = getPointPosition(odc);
  const status = $('ftthRouteStatus');
  if (status) status.textContent = 'Mengambil rute jalan terdekat...';

  try {
    const url = `${FTTH_ROUTING_URL}${odpPosition.lng},${odpPosition.lat};${odcPosition.lng},${odcPosition.lat}?overview=full&geometries=geojson&steps=false`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Routing HTTP ${response.status}`);
    const result = await response.json();
    const route = result.routes?.[0];
    if (!route?.geometry?.coordinates?.length) throw new Error('Rute jalan tidak tersedia');
    if (requestId !== ftthRouteRequestId) return;

    const path = route.geometry.coordinates.map(([lng, lat]) => [lat, lng]);
    const savedRoute = { odp: odpName, odc: odcName, path, distance: route.distance, duration: route.duration, source: 'osrm' };
    const existingIndex = ftthRoutes.findIndex(item => item.odp === odpName && item.odc === odcName);
    if (existingIndex === -1) ftthRoutes.push(savedRoute); else ftthRoutes[existingIndex] = savedRoute;
    writeAppData('ftthRoutes', ftthRoutes);
    renderFtthRoutes();
    ftthMap.fitBounds(path, { padding: [36, 36] });
    if (status) status.textContent = `Rute otomatis dibuat · ${formatRouteDistance(route.distance)} lewat jalan.`;
  } catch (error) {
    if (requestId !== ftthRouteRequestId) return;
    if (status) status.textContent = 'Rute otomatis gagal. Periksa koneksi internet atau gambar manual.';
    showToast('Rute jalan belum tersedia. ODP tetap tersimpan; gunakan gambar manual bila perlu.');
  }
}

function generateSelectedRoute() {
  const odpName = $('ftthRouteOdp')?.value;
  const odcName = $('ftthRouteOdc')?.value;
  if (!odpName || !odcName) return;
  generateNearestRoadRoute(odpName, odcName);
}

function renderFtthRoutes() {
  if (!ftthMap) return;
  ftthRouteLayers.forEach(layer => layer.remove());
  ftthRouteLayers = ftthRoutes.map(route => L.polyline(route.path, { color:'#e84c61', weight:4, opacity:.85 }).addTo(ftthMap).bindPopup(`<strong>${route.odp} → ${route.odc}</strong>Jalur jalan · ${formatRouteDistance(route.distance)} · ${route.path.length} titik`));
  const list = $('ftthRouteList');
  if (list) list.innerHTML = ftthRoutes.length ? ftthRoutes.map((route, index) => `<div class="ftth-route-item"><span class="route-legend"></span><strong>${route.odp}</strong> → ${route.odc}<span>${formatRouteDistance(route.distance)}</span><button data-route-edit="${index}">Edit</button><button data-route-delete="${index}">Hapus</button></div>`).join('') : '<span class="ftth-route-empty">Belum ada jalur kabel yang disimpan.</span>';
}

function renderCurrentRoute() {
  if (ftthRouteLayers.current) ftthRouteLayers.current.remove();
  if (ftthRoutePoints.length) ftthRouteLayers.current = L.polyline(ftthRoutePoints, { color:'#e84c61', weight:5, dashArray:'8 6' }).addTo(ftthMap);
}

function startRouteEdit(routeIndex = null) {
  const odp = $('ftthRouteOdp').value;
  const odc = $('ftthRouteOdc').value;
  if (!odp || !odc) { $('ftthRouteStatus').textContent = 'Pilih ODP dan ODC terlebih dahulu.'; return; }
  ftthEditingRouteIndex = routeIndex; ftthRoutePoints = routeIndex === null ? [] : ftthRoutes[routeIndex].path.map(point => L.latLng(point[0], point[1])); ftthRouteEditing = true;
  ftthMap.doubleClickZoom.disable(); $('btnStartRoute').disabled = true; $('btnSaveRoute').disabled = ftthRoutePoints.length < 2; $('ftthRouteStatus').textContent = 'Klik peta untuk menambah titik jalur, lalu simpan.'; renderCurrentRoute();
}

function finishRouteEdit() {
  if (ftthRoutePoints.length < 2) { $('ftthRouteStatus').textContent = 'Jalur membutuhkan minimal dua titik.'; return; }
  const route = { odp:$('ftthRouteOdp').value, odc:$('ftthRouteOdc').value, path:ftthRoutePoints.map(point => [point.lat, point.lng]) };
  if (ftthEditingRouteIndex === null) ftthRoutes.push(route); else ftthRoutes[ftthEditingRouteIndex] = route;
  writeAppData('ftthRoutes', ftthRoutes); if (ftthRouteLayers.current) { ftthRouteLayers.current.remove(); delete ftthRouteLayers.current; }
  ftthRouteEditing = false; ftthRoutePoints = []; ftthEditingRouteIndex = null; ftthMap.doubleClickZoom.enable(); $('btnStartRoute').disabled = false; $('btnSaveRoute').disabled = true; $('ftthRouteStatus').textContent = 'Jalur berhasil disimpan.'; renderFtthRoutes();
}

function loadLeafletMap() {
  if (!window.L) return;
  $('ftthMap').innerHTML = '';
  ftthMap = L.map('ftthMap').setView([-7.01, 110.445], 13);
  ftthTileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom:19, updateWhenIdle:false, keepBuffer:4, attribution:'&copy; OpenStreetMap contributors' }).addTo(ftthMap);
  ftthTileLayer.on('tileerror', () => showToast('Tile peta belum termuat. Periksa koneksi internet lalu buka ulang tab FTTH.'));
  $('ftthMap').classList.add('leaflet-ready');
  updateFtthMap(FTTH_POINTS);
  ftthMap.on('click', event => { if (!ftthRouteEditing) return; ftthRoutePoints.push(event.latlng); $('btnSaveRoute').disabled = ftthRoutePoints.length < 2; renderCurrentRoute(); });
  populateRouteOptions(); renderFtthRoutes();
}

/**
 * Validate an array of imported FTTH points.
 * Returns an array of error message strings; empty array = all valid.
 * NOTE: Duplicate names in the import list are intentionally allowed —
 *       importFtthExcel will upsert them (last row wins within the same file).
 */
function validateFtthData(points) {
  const errors = [];
  points.forEach((point, i) => {
    const label = point.name || `baris ${i + 1}`;
    if (!point.name)
      errors.push(`${label}: nama wajib diisi`);
    if (!point.type || !['otb', 'odc', 'odp'].includes(point.type))
      errors.push(`${label}: tipe tidak valid (harus otb/odc/odp)`);
    if (!Number.isFinite(point.lat) || !Number.isFinite(point.lng))
      errors.push(`${label}: koordinat tidak valid`);
  });
  return errors;
}

function importFtthFile(file) {
  if (!file || !window.XLSX) return;
  const reader = new FileReader();
  reader.onload = async event => {
    const workbook = XLSX.read(event.target.result, { type: 'array' });
    const rows = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
    const imported = rows.map(row => {
      const type = String(row.type || row.Tipe || '').trim().toLowerCase();
      const lat = Number(row.latitude ?? row.Latitude);
      const lng = Number(row.longitude ?? row.Longitude);
      return { type, name: row.name || row.Nama || 'Titik FTTH', coordinates: `${lat}, ${lng}`, lat, lng, capacity: row.capacity || row.Kapasitas || '-', used: row.used || row.Terpakai || '-', status: String(row.status || row.Status || 'valid').trim().toLowerCase() === 'valid' ? 'valid' : 'check' };
    }).filter(point => ['otb', 'odc', 'odp'].includes(point.type) && Number.isFinite(point.lat) && Number.isFinite(point.lng));
    if (!imported.length) { showToast('File tidak memiliki baris koordinat FTTH yang valid.'); return; }
    // Validate imported data
    const validationErrors = validateFtthData(imported);
    if (validationErrors.length) { showToast('Validasi gagal: ' + validationErrors.join(', ')); return; }
    FTTH_POINTS.splice(0, FTTH_POINTS.length, ...imported);
    await writeAppData('ftthPoints', FTTH_POINTS);
    populateOdcOptions(); populateRouteOptions(); renderFtthTables(); renderFtthValidation(); showToast(`${imported.length} titik FTTH berhasil diimpor.`);
  };
  reader.readAsArrayBuffer(file);
}

/**
 * Parse nilai redaman dari berbagai format:
 *   "-19.40", "-20,21", "- 15", "-21:75", "22,25" (tanpa minus → negatif otomatis)
 * Kembalikan angka float, atau 0 jika tidak dapat di-parse.
 */
function parseRedaman(raw) {
  if (raw === null || raw === undefined) return 0;
  let s = String(raw).trim();
  if (s === '' || s === '-' || s === '—') return 0;
  // Hapus spasi setelah minus: "- 15" → "-15"
  s = s.replace(/^-\s+/, '-');
  // Ganti koma/titik dua desimal → titik
  s = s.replace(',', '.').replace(':', '.');
  // Ambil hanya karakter numerik + minus + titik
  s = s.replace(/[^0-9.\-]/g, '');
  const n = parseFloat(s);
  if (!Number.isFinite(n)) return 0;
  // Nilai redaman selalu negatif — jika positif, jadikan negatif
  return n > 0 ? -n : n;
}

function normalizeFtthImportRow(row, type) {
  // ── Koordinat ──────────────────────────────────────────────
  // Support: dedicated lat/lng columns, atau combined "Koordinat" column ("lat,lng")
  let latitude  = Number(row.latitude  ?? row.Latitude  ?? row.lat ?? row.Lat ?? NaN);
  let longitude = Number(row.longitude ?? row.Longitude ?? row.lng ?? row.Lng ?? NaN);

  // Coba semua kemungkinan nama kolom koordinat
  const rawKoord = (
    row.Koordinat ?? row.koordinat ??
    row.Coordinates ?? row.coordinates ?? ''
  );
  if (rawKoord) {
    // Format: "-8.07871,111.90516" atau "-8.07871, 111.90516"
    const parts = String(rawKoord).split(',');
    if (parts.length >= 2) {
      const a = parseFloat(parts[0].trim());
      const b = parseFloat(parts[1].trim());
      if (Number.isFinite(a) && Number.isFinite(b)) { latitude = a; longitude = b; }
    }
  }

  // ── Nama ───────────────────────────────────────────────────
  const name = (row.name || row.Nama || row.nama || '').trim()
    || (type === 'odp' ? '' : (row.ODC || row.OTB || '').trim())
    || '';

  // ── Splitter — ambil angka saja (e.g. "1:8" → "8", "16" → "16") ──
  const rawSplitter = String(row.Splitter || row.splitter || '').trim();
  // Jika format "1:8" ambil bagian setelah ':', jika angka biasa langsung
  const splitter = rawSplitter.includes(':')
    ? rawSplitter.split(':').pop().trim()
    : rawSplitter;

  // ── Kapasitas — gunakan nilai Splitter sebagai kapasitas ODP ──
  // Kolom "Splitter" di data ODP berisi kapasitas port (8, 16, dst)
  const capacityRaw = row.capacity || row.Kapasitas || splitter ||
    (type === 'odp' ? 8 : type === 'odc' ? 288 : 48);
  const capacity = parseInt(capacityRaw) || 0;

  // ── Port Idle ──────────────────────────────────────────────
  // Bisa kosong, negatif (kelebihan pelanggan), atau normal
  const idleRaw = row['Port idle'] ?? row['Port Idle'] ?? row.idle ?? '';
  const idle    = idleRaw === '' || idleRaw === null || idleRaw === undefined
    ? 0
    : parseInt(String(idleRaw).trim()) || 0;

  // ── Pelanggan ──────────────────────────────────────────────
  // Prioritas: kolom Pelanggan > hitung dari capacity - idle
  const pelangganRaw = row.Pelanggan ?? row.pelanggan ?? row.customers ?? row.Customers;
  let customers;
  if (pelangganRaw !== undefined && pelangganRaw !== null && pelangganRaw !== '') {
    customers = parseInt(String(pelangganRaw).trim());
    if (isNaN(customers)) customers = Math.max(0, capacity - idle);
  } else {
    customers = Math.max(0, capacity - idle);
  }

  // ── Redaman — format beragam ───────────────────────────────
  const redaman = parseRedaman(row.attenuation ?? row.Redaman ?? row.redaman ?? '');

  // ── Keterangan ─────────────────────────────────────────────
  // Bersihkan HTML entities (<br>, tag, dll) dari keterangan
  const descRaw = (row.Keterangan || row.keterangan || row.description || row.Description || '').trim();
  const description = descRaw.replace(/<[^>]*>/g, '').replace(/&[a-z]+;/gi, ' ').trim();

  const status = String(row.status || row.Status || 'valid').toLowerCase() === 'valid' ? 'valid' : 'check';

  const fallbackName = name || `${type.toUpperCase()} ${FTTH_POINTS.filter(p => p.type === type).length + 1}`;

  if (type === 'odp') {
    // Kolom ODC induk: bisa "ODC", "Konek ODC", "ODC Induk", "odc"
    const odc_parent = (
      row['Konek ODC'] || row['konek odc'] ||
      row['ODC Induk'] || row['odc_induk'] ||
      row.ODC          || row.odc          || ''
    ).trim();
    // Alamat: kolom "Alamat"
    const address = (row.Alamat || row.alamat || row.address || row.Address || '').trim();

    return {
      type,
      name:        fallbackName,
      odc:         odc_parent,
      address,
      splitter,
      attenuation: redaman,
      customers,
      description,
      coordinates: `${latitude}, ${longitude}`,
      lat:         latitude,
      lng:         longitude,
      capacity,
      idle,
      used:        String(row.used || row.Terpakai || '-'),
      status,
    };
  }

  if (type === 'odc') {
    // Untuk ODC: kolom "ODP" berisi jumlah ODP yang terhubung (angka)
    const odp_count = parseInt(row.ODP ?? row.odp_count ?? row['Jumlah ODP'] ?? 0) || 0;
    const olt       = (row.OLT || row.olt || row.Olt || '').trim();
    const iface     = (row.Interface || row.interface || row.Port || row.port || '').trim();
    // ODC pakai kapasitas default 288 jika Splitter tidak mengandung angka kapasitas
    const odcCapacity = parseInt(row.capacity || row.Kapasitas || capacity || 288) || 288;
    return {
      type,
      name:        fallbackName,
      olt,
      interface:   iface,
      splitter,
      attenuation: redaman,
      odp:         odp_count,
      customers,
      description,
      coordinates: `${latitude}, ${longitude}`,
      lat:         latitude,
      lng:         longitude,
      capacity:    odcCapacity,
      idle,
      used:        String(row.used || row.Terpakai || '-'),
      status,
    };
  }

  // OTB
  const olt   = (row.OLT || row.olt || row.Olt || '').trim();
  const iface = (row.Interface || row.interface || row.Port || row.port || '').trim();
  const pop   = (row.PoP || row.pop || row.POP || '').trim();
  return {
    type,
    name:        fallbackName,
    olt,
    interface:   iface,
    pop,
    splitter,
    attenuation: redaman,
    customers,
    description,
    coordinates: `${latitude}, ${longitude}`,
    lat:         latitude,
    lng:         longitude,
    capacity,
    idle,
    used:        String(row.used || row.Terpakai || '-'),
    status,
  };
}

function importFtthExcel(file, type) {
  if (!file || !window.XLSX) return;
  const reader = new FileReader();
  reader.onload = event => {
    const workbook = XLSX.read(event.target.result, { type: 'array' });
    const rows     = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
    const imported = rows
      .map(row => normalizeFtthImportRow(row, type))
      .filter(p => p.name && Number.isFinite(p.lat) && Number.isFinite(p.lng));

    if (!imported.length) {
      showToast('File Excel tidak memiliki data valid. Pastikan ada kolom Nama dan Koordinat.');
      return;
    }

    // ── Upsert: update jika nama sudah ada, tambah jika baru ─
    let updated = 0;
    let added   = 0;
    imported.forEach(point => {
      const existingIdx = FTTH_POINTS.findIndex(
        p => p.type === point.type && p.name === point.name
      );
      if (existingIdx !== -1) {
        FTTH_POINTS[existingIdx] = point;
        updated++;
      } else {
        FTTH_POINTS.push(point);
        added++;
      }
    });

    writeAppData('ftthPoints', FTTH_POINTS);
    populateOdcOptions();
    populateRouteOptions();
    renderFtthTables();
    renderFtthValidation();

    const parts = [];
    if (added)   parts.push(`${added} data baru ditambahkan`);
    if (updated) parts.push(`${updated} data diperbarui`);
    showToast(`Import ${type.toUpperCase()} selesai: ${parts.join(', ')}.`);
    event.target.value = '';
  };
  reader.readAsArrayBuffer(file);
}

function exportFtthExcel(type) {
  if (!window.XLSX) { showToast('Library Excel belum termuat.'); return; }

  // Definisi kolom per tipe — header sama dengan kolom import supaya bisa re-import
  const SCHEMA = {
    odp: [
      { header: 'Nama',        field: p => p.name          || '' },
      { header: 'Pelanggan',   field: p => p.customers     ?? '' },
      { header: 'Port Idle',   field: p => p.idle          ?? '' },
      { header: 'Splitter',    field: p => p.splitter      || '' },
      { header: 'Redaman',     field: p => p.attenuation   ?? '' },
      { header: 'Keterangan',  field: p => p.description   || '' },
      { header: 'Koordinat',   field: p => p.coordinates   || '' },
      { header: 'Alamat',      field: p => p.address       || '' },
      { header: 'Konek ODC',   field: p => p.odc           || '' },
    ],
    odc: [
      { header: 'Nama',        field: p => p.name          || '' },
      { header: 'OLT',         field: p => p.olt           || '' },
      { header: 'Interface',   field: p => p.interface     || '' },
      { header: 'Splitter',    field: p => p.splitter      || '' },
      { header: 'Redaman',     field: p => p.attenuation   ?? '' },
      { header: 'ODP',         field: p => p.odp           ?? '' },
      { header: 'Pelanggan',   field: p => p.customers     ?? '' },
      { header: 'Keterangan',  field: p => p.description   || '' },
      { header: 'Koordinat',   field: p => p.coordinates   || '' },
    ],
    otb: [
      { header: 'Nama',        field: p => p.name          || '' },
      { header: 'Port',        field: p => p.port          || '' },
      { header: 'PoP',         field: p => p.pop           || '' },
      { header: 'Keterangan',  field: p => p.description   || '' },
      { header: 'Koordinat',   field: p => p.coordinates   || '' },
    ],
  };

  const schema = SCHEMA[type] || SCHEMA.otb;
  const points = FTTH_POINTS.filter(p => p.type === type);
  const dataRows = (points.length ? points : [{}]).map(p =>
    Object.fromEntries(schema.map(col => [col.header, col.field(p)]))
  );

  const worksheet = XLSX.utils.json_to_sheet(dataRows);
  const workbook  = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, type.toUpperCase());
  XLSX.writeFile(workbook, `FTTH_${type.toUpperCase()}_${new Date().toISOString().slice(0, 10)}.xlsx`);
  showToast(`Data ${type.toUpperCase()} berhasil diexport.`);
}

['odp', 'odc', 'otb'].forEach(type => {
  $(`ftthImport${type.charAt(0).toUpperCase() + type.slice(1)}`)?.addEventListener('change', event => importFtthExcel(event.target.files[0], type));
  document.querySelector(`[data-ftth-export="${type}"]`)?.addEventListener('click', () => exportFtthExcel(type));
});
function renderFtthValidation() {
  const rawQuery          = ($('ftthSearch')?.value || '').trim();
  const query             = rawQuery.toLowerCase();
  const searchedCoordinates = parseSearchCoordinates(rawQuery);
  const points            = FTTH_POINTS.filter(point =>
    !query || `${point.name} ${point.coordinates}`.toLowerCase().includes(query)
  );
  if (ftthMap) updateFtthMap(searchedCoordinates ? [] : points, searchedCoordinates);
}

function statusBadge(status) {
  return status === 'valid'
    ? `<span class="ftth-status-badge valid">✓ Valid</span>`
    : `<span class="ftth-status-badge check">⚠ Belum Valid</span>`;
}

function renderFtthStatsBar(type) {
  const all   = FTTH_POINTS.filter(p => p.type === type);
  const valid = all.filter(p => p.status === 'valid').length;
  const check = all.length - valid;
  const el    = $(`ftthStats${type.charAt(0).toUpperCase() + type.slice(1)}`);
  if (!el) return;
  el.innerHTML =
    `<span class="ftth-stat-chip total">Total: <b>${all.length}</b></span>` +
    `<span class="ftth-stat-chip valid">✓ Valid: <b>${valid}</b></span>` +
    `<span class="ftth-stat-chip check">⚠ Belum Valid: <b>${check}</b></span>`;
}

function renderFtthTables() {
  // Action buttons: Edit, Valid toggle, Hapus
  const actions = point => {
    const idx       = FTTH_POINTS.indexOf(point);
    const isValid   = point.status === 'valid';
    const validCls  = isValid ? 'row-valid is-valid' : 'row-valid';
    const validLbl  = isValid ? '✓ Valid' : '? Cek';
    const validTip  = isValid ? 'Tervalidasi — klik untuk batal' : 'Belum divalidasi — klik untuk validasi';
    return `<div class="ftth-row-actions">` +
      `<button class="row-edit"   data-ftth-edit="${idx}">Edit</button>` +
      `<button class="${validCls}" data-ftth-valid="${idx}" title="${validTip}">${validLbl}</button>` +
      `<button class="row-delete" data-ftth-delete="${idx}">Hapus</button>` +
      `</div>`;
  };

  // Build tbody rows; first column is a bulk-select checkbox
  // Supports optional status filter via select#ftthStatusFilter{Type}
  const rows = (type, columns) => {
    const filterEl = $(`ftthStatusFilter${type.charAt(0).toUpperCase() + type.slice(1)}`);
    const filterVal = filterEl ? filterEl.value : 'all';
    return FTTH_POINTS
      .filter(p => {
        if (!p || p.type !== type) return false;
        if (filterVal === 'valid' && p.status !== 'valid') return false;
        if (filterVal === 'check' && p.status === 'valid') return false;
        return true;
      })
      .map(point => {
        const idx  = FTTH_POINTS.indexOf(point);
        const rowCls = point.status === 'valid' ? ' class="row-status-valid"' : ' class="row-status-check"';
        const cols = columns.map(col => `<td>${col(point)}</td>`).join('');
        return `<tr${rowCls}>` +
          `<td class="col-check"><input type="checkbox" class="ftth-bulk-check" data-ftth-idx="${idx}" data-ftth-type="${type}"/></td>` +
          cols +
          `</tr>`;
      })
      .join('');
  };

  $('ftthOdpRows').innerHTML = rows('odp', [
    p => p.name,
    p => statusBadge(p.status),
    p => p.customers || '0',
    p => p.idle      ?? p.capacity,
    p => p.splitter  || p.capacity,
    p => p.attenuation || '-',
    p => p.description || p.used,
    p => p.address   || '-',
    actions,
  ]);
  $('ftthOdcRows').innerHTML = rows('odc', [
    p => p.name,
    p => statusBadge(p.status),
    p => p.olt        || '-',
    p => p.interface  || '-',
    p => p.splitter   || '-',
    p => p.attenuation || '-',
    p => p.odp        || '-',
    p => p.customers  || '0',
    p => p.description || '-',
    actions,
  ]);
  $('ftthOtbRows').innerHTML = rows('otb', [
    p => p.name,
    p => p.port || '48',
    p => p.pop  || '-',
    p => p.description || '-',
    actions,
  ]);
  $('ftthPortGrid').innerHTML = Array.from({ length: 48 }, (_, i) =>
    `<span>${i + 1}<i></i><i></i></span>`
  ).join('');

  // Update stats bars
  renderFtthStatsBar('odp');
  renderFtthStatsBar('odc');

  // Refresh status panel if it's visible
  if (document.querySelector('[data-ftth-panel="status"].active')) {
    renderFtthStatusPanel();
  }
}

/* ── Render tab Status Validasi ─────────────────────────────── */
function renderFtthStatusPanel() {
  const typeFilter   = ($('ftthValidFilterType')?.value   || 'all');
  const statusFilter = ($('ftthValidFilterStatus')?.value || 'all');
  const searchQ      = ($('ftthValidSearch')?.value       || '').trim().toLowerCase();

  // Summary counts
  const odp  = FTTH_POINTS.filter(p => p.type === 'odp');
  const odc  = FTTH_POINTS.filter(p => p.type === 'odc');
  const allTargets = [...odp, ...odc];
  const totalValid = allTargets.filter(p => p.status === 'valid').length;
  const totalCheck = allTargets.length - totalValid;
  const pct = allTargets.length ? Math.round(totalValid / allTargets.length * 100) : 0;

  const summaryEl = $('ftthValidSummary');
  if (summaryEl) {
    summaryEl.innerHTML = `
      <div class="ftth-vcard total">
        <div class="ftth-vcard-num">${allTargets.length}</div>
        <div class="ftth-vcard-label">Total ODP + ODC</div>
      </div>
      <div class="ftth-vcard valid">
        <div class="ftth-vcard-num">${totalValid}</div>
        <div class="ftth-vcard-label">✓ Sudah Valid</div>
      </div>
      <div class="ftth-vcard check">
        <div class="ftth-vcard-num">${totalCheck}</div>
        <div class="ftth-vcard-label">⚠ Belum Valid</div>
      </div>
      <div class="ftth-vcard pct">
        <div class="ftth-vcard-num">${pct}%</div>
        <div class="ftth-vcard-label">Persentase Valid</div>
        <div class="ftth-vcard-bar"><div class="ftth-vcard-fill" style="width:${pct}%"></div></div>
      </div>
      <div class="ftth-vcard odp-detail">
        <div class="ftth-vcard-num">${odp.filter(p=>p.status==='valid').length}<span>/${odp.length}</span></div>
        <div class="ftth-vcard-label">ODP Valid</div>
      </div>
      <div class="ftth-vcard odc-detail">
        <div class="ftth-vcard-num">${odc.filter(p=>p.status==='valid').length}<span>/${odc.length}</span></div>
        <div class="ftth-vcard-label">ODC Valid</div>
      </div>
    `;
  }

  // Filtered list
  const list = allTargets.filter(p => {
    if (typeFilter   !== 'all' && p.type   !== typeFilter)   return false;
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (searchQ && !p.name.toLowerCase().includes(searchQ))  return false;
    return true;
  });

  const tbody = $('ftthValidRows');
  if (!tbody) return;

  if (!list.length) {
    tbody.innerHTML = `<tr><td colspan="10" style="text-align:center;padding:20px;color:#94a3b8;">Tidak ada data yang cocok dengan filter.</td></tr>`;
    return;
  }

  tbody.innerHTML = list.map((p, i) => {
    const idx = FTTH_POINTS.indexOf(p);
    const isValid = p.status === 'valid';
    const rowCls = isValid ? 'row-status-valid' : 'row-status-check';
    const parent = p.type === 'odp' ? (p.odc || '-') : (p.olt || '-');
    return `<tr class="${rowCls}">
      <td>${i + 1}</td>
      <td><span class="ftth-type-badge ${p.type}">${p.type.toUpperCase()}</span></td>
      <td><b>${p.name}</b></td>
      <td>${statusBadge(p.status)}</td>
      <td>${parent}</td>
      <td>${p.customers ?? '-'}</td>
      <td>${p.idle ?? '-'}</td>
      <td>${p.attenuation || '-'}</td>
      <td>${p.description || '-'}</td>
      <td>
        <div class="ftth-row-actions">
          <button class="row-edit" data-ftth-edit="${idx}">Edit</button>
          <button class="${isValid ? 'row-valid is-valid' : 'row-valid'}" data-ftth-valid="${idx}" title="${isValid ? 'Klik untuk batalkan validasi' : 'Klik untuk validasi'}">${isValid ? '✓ Valid' : '? Cek'}</button>
        </div>
      </td>
    </tr>`;
  }).join('');
}

function populateOdcOptions() {
  const select = $('ftthOdpOdc');
  if (!select) return;
  const currentValue = select.value;
  const odcPoints    = FTTH_POINTS.filter(p => p.type === 'odc');
  select.innerHTML   = '<option value="">Pilih ODC</option>' +
    odcPoints.map(p => `<option value="${p.name}">${p.name}</option>`).join('');
  if (odcPoints.some(p => p.name === currentValue)) select.value = currentValue;
}

const mapFilter = document.getElementById('ftthMapFilter');
if (mapFilter) mapFilter.addEventListener('change', () => updateFtthMap(FTTH_POINTS));
document.querySelectorAll('.ftth-menu-item').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.ftth-menu-item').forEach(item => item.classList.remove('active'));
  document.querySelectorAll('.ftth-data-view').forEach(panel => panel.classList.toggle('active', panel.dataset.ftthPanel === button.dataset.ftthView));
  button.classList.add('active');
  if (button.dataset.ftthView === 'map' && ftthMap) requestAnimationFrame(() => ftthMap.invalidateSize(true));
  if (button.dataset.ftthView === 'status') renderFtthStatusPanel();
}));

// Filter status ODP / ODC — re-render table when dropdown changes
$('ftthStatusFilterOdp')?.addEventListener('change', () => renderFtthTables());
$('ftthStatusFilterOdc')?.addEventListener('change', () => renderFtthTables());

// Status panel: filter controls
$('ftthValidFilterType')?.addEventListener('change',   () => renderFtthStatusPanel());
$('ftthValidFilterStatus')?.addEventListener('change', () => renderFtthStatusPanel());
$('ftthValidSearch')?.addEventListener('input',        () => renderFtthStatusPanel());
$('btnRefreshValidasi')?.addEventListener('click',     () => renderFtthStatusPanel());

// Export rekap validasi ke Excel
$('btnExportValidasi')?.addEventListener('click', () => {
  if (!window.XLSX) { showToast('Library Excel belum termuat.'); return; }
  const list = FTTH_POINTS.filter(p => p.type === 'odp' || p.type === 'odc');
  if (!list.length) { showToast('Tidak ada data ODP/ODC.'); return; }
  const rows = list.map((p, i) => ({
    No:          i + 1,
    Tipe:        p.type.toUpperCase(),
    Nama:        p.name,
    Status:      p.status === 'valid' ? 'Valid' : 'Belum Valid',
    'OLT/Induk': p.type === 'odp' ? (p.odc || '-') : (p.olt || '-'),
    Pelanggan:   p.customers ?? '-',
    'Port Idle': p.idle ?? '-',
    Redaman:     p.attenuation || '-',
    Keterangan:  p.description || '-',
    Koordinat:   p.coordinates || '-',
  }));
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Rekap Validasi');
  XLSX.writeFile(wb, `Rekap_Validasi_FTTH_${new Date().toISOString().slice(0,10)}.xlsx`);
  showToast('Rekap validasi berhasil diexport.');
});
$('btnStartRoute')?.addEventListener('click', () => startRouteEdit());
$('btnSaveRoute')?.addEventListener('click', finishRouteEdit);
$('ftthRouteOdp')?.addEventListener('change', generateSelectedRoute);
$('ftthRouteOdc')?.addEventListener('change', generateSelectedRoute);
$('ftthRouteList')?.addEventListener('click', event => {
  const editButton = event.target.closest('[data-route-edit]');
  const deleteButton = event.target.closest('[data-route-delete]');
  if (editButton) { const index = Number(editButton.dataset.routeEdit); $('ftthRouteOdp').value = ftthRoutes[index].odp; $('ftthRouteOdc').value = ftthRoutes[index].odc; startRouteEdit(index); }
  if (deleteButton && confirm('Hapus jalur kabel ini?')) { ftthRoutes.splice(Number(deleteButton.dataset.routeDelete), 1); writeAppData('ftthRoutes', ftthRoutes); renderFtthRoutes(); }
});
function openFtthModal(type) {
  $('ftthForm').reset(); $('ftthEditType').value = type; $('ftthEditIndex').value = '';
  const titles = { odp: 'Tambah ODP', odc: 'Tambah ODC', otb: 'Tambah OTB' };
  $('ftthModalTitle').textContent = titles[type];
  document.querySelectorAll('#ftthForm > .ftth-form-grid').forEach(form => form.classList.add('hidden'));
  $(`ftth${type.charAt(0).toUpperCase() + type.slice(1)}Form`).classList.remove('hidden');
  if (type === 'odp') populateOdcOptions();
  $('ftthModal').classList.remove('hidden');
}
document.querySelectorAll('[data-ftth-panel] .btn-primary-small').forEach(button => button.addEventListener('click', () => openFtthModal(button.closest('[data-ftth-panel]').dataset.ftthPanel)));
function fillFtthModal(point, index) {
  openFtthModal(point.type);
  $('ftthEditIndex').value = index;
  const prefix = `ftth${point.type.charAt(0).toUpperCase() + point.type.slice(1)}`;
  $(`${prefix}Name`).value = point.name || '';
  $(`${prefix}Coordinates`).value = point.coordinates || '';
  if (point.type === 'odp') { populateOdcOptions(); $('ftthOdpOdc').value = point.odc || ''; $('ftthOdpSplitter').value = point.splitter || ''; $('ftthOdpAttenuation').value = point.attenuation || ''; $('ftthOdpDescription').value = point.description || ''; }
  if (point.type === 'odc') { $('ftthOdcOlt').value = point.olt || '--Pilih OLT--'; $('ftthOdcInterface').value = point.interface || ''; $('ftthOdcSplitter').value = point.splitter || ''; $('ftthOdcAttenuation').value = point.attenuation || ''; $('ftthOdcDescription').value = point.description || ''; }
  if (point.type === 'otb') { $('ftthOtbPort').value = point.port || ''; $('ftthOtbDescription').value = point.description || ''; }
  $('ftthModalTitle').textContent = `Edit ${point.type.toUpperCase()}`;
}
function closeFtthModal() { $('ftthModal').classList.add('hidden'); }

$('ftthModalClose').addEventListener('click', closeFtthModal);
$('ftthModalCancel').addEventListener('click', closeFtthModal);
$('ftthModal').addEventListener('click', event => { if (event.target === $('ftthModal')) closeFtthModal(); });

$('ftthSubmit').addEventListener('click', () => {
  const type        = $('ftthEditType').value;
  const prefix      = `ftth${type.charAt(0).toUpperCase() + type.slice(1)}`;
  const name        = $(`${prefix}Name`).value.trim();
  const coordinates = $(`${prefix}Coordinates`).value.trim();
  const position    = parseSearchCoordinates(coordinates);

  if (!name || !position) {
    showToast('Nama dan koordinat valid wajib diisi. Format koordinat: lat,lng');
    return;
  }
  if (type === 'odp' && !$('ftthOdpOdc').value) {
    showToast('Pilih ODC terlebih dahulu agar ODP tersambung.');
    return;
  }

  const point = {
    type, name, coordinates,
    lat: position.lat, lng: position.lng,
    capacity: type === 'odp' ? '16 port' : type === 'odc' ? '288 core' : '48 port',
    used: '-', status: 'valid',
  };

  if (type === 'odp') {
    const address = [$('ftthOdpProvince').value, $('ftthOdpRegency').value,
                     $('ftthOdpDistrict').value, $('ftthOdpVillage').value]
      .filter(v => !v.startsWith('Pilih') && !v.startsWith('Kabupaten') &&
                   !v.startsWith('Kecamatan') && !v.startsWith('Kelurahan') &&
                   v !== 'Provinsi')
      .join(', ');
    Object.assign(point, {
      odc:         $('ftthOdpOdc').value,
      splitter:    $('ftthOdpSplitter').value.trim(),
      attenuation: $('ftthOdpAttenuation').value.trim(),
      description: $('ftthOdpDescription').value.trim(),
      address, customers: '0', idle: '16',
    });
  }
  if (type === 'odc') {
    Object.assign(point, {
      olt:         $('ftthOdcOlt').value,
      interface:   $('ftthOdcInterface').value.trim(),
      splitter:    $('ftthOdcSplitter').value.trim(),
      attenuation: $('ftthOdcAttenuation').value.trim(),
      description: $('ftthOdcDescription').value.trim(),
      customers:   '0',
    });
  }
  if (type === 'otb') {
    Object.assign(point, {
      port:        $('ftthOtbPort').value.trim() || '48',
      pop:         document.querySelector('#ftthOtbForm select:nth-of-type(3)')?.value || '-',
      description: $('ftthOtbDescription').value.trim(),
    });
  }

  const editIndex    = $('ftthEditIndex').value;
  const previousPoint = editIndex === '' ? null : FTTH_POINTS[Number(editIndex)];
  if (type === 'odp' && previousPoint && previousPoint.name !== point.name) {
    ftthRoutes = ftthRoutes.filter(r => r.odp !== previousPoint.name);
    writeAppData('ftthRoutes', ftthRoutes);
  }

  if (editIndex === '') {
    FTTH_POINTS.unshift(point);
  } else {
    FTTH_POINTS[Number(editIndex)] = point;
  }

  writeAppData('ftthPoints', FTTH_POINTS);
  populateOdcOptions();
  populateRouteOptions();
  renderFtthTables();
  renderFtthValidation();
  closeFtthModal();
  showToast(`${type.toUpperCase()} berhasil ${editIndex === '' ? 'ditambahkan' : 'diperbarui'}.`);
  if (type === 'odp') generateNearestRoadRoute(point.name, point.odc);
});

document.querySelectorAll('.ftth-list-table').forEach(table => table.addEventListener('click', event => {
  const editBtn   = event.target.closest('[data-ftth-edit]');
  const deleteBtn = event.target.closest('[data-ftth-delete]');
  const validBtn  = event.target.closest('[data-ftth-valid]');
  if (editBtn) {
    fillFtthModal(FTTH_POINTS[Number(editBtn.dataset.ftthEdit)], Number(editBtn.dataset.ftthEdit));
    return;
  }
  if (validBtn) {
    // Toggle status between 'valid' and 'check'
    const point = FTTH_POINTS[Number(validBtn.dataset.ftthValid)];
    if (!point) return;
    point.status = point.status === 'valid' ? 'check' : 'valid';
    writeAppData('ftthPoints', FTTH_POINTS);
    renderFtthTables();
    // Jika panel Status Validasi sedang aktif, refresh juga
    if (document.querySelector('[data-ftth-panel="status"].active')) {
      renderFtthStatusPanel();
    }
    return;
  }
  if (!deleteBtn || !confirm('Hapus data ini?')) return;
  FTTH_POINTS.splice(Number(deleteBtn.dataset.ftthDelete), 1);
  writeAppData('ftthPoints', FTTH_POINTS);
  populateOdcOptions();
  populateRouteOptions();
  renderFtthTables();
  renderFtthValidation();
  showToast('Data berhasil dihapus.');
}));

/* ── FTTH BULK SELECT — helper to update bulk-bar state for one panel type ── */
function updateFtthBulkBar(type) {
  const checks   = document.querySelectorAll(`.ftth-bulk-check[data-ftth-type="${type}"]`);
  const selected = [...checks].filter(c => c.checked).length;
  const bar      = $(`ftthBulkBar${type.charAt(0).toUpperCase() + type.slice(1)}`);
  const counter  = $(`ftthBulkCount${type.charAt(0).toUpperCase() + type.slice(1)}`);
  if (bar)     bar.classList.toggle('active', selected > 0);
  if (counter) counter.textContent = `${selected} baris dipilih`;
  // Sync the select-all checkbox header state
  const selectAll = $(`ftthSelectAll${type.charAt(0).toUpperCase() + type.slice(1)}`);
  if (selectAll) {
    selectAll.checked       = selected > 0 && selected === checks.length;
    selectAll.indeterminate = selected > 0 && selected < checks.length;
  }
}

/* ── FTTH BULK SELECT — row checkbox change delegation ── */
document.addEventListener('change', event => {
  const check = event.target.closest('.ftth-bulk-check');
  if (check) {
    updateFtthBulkBar(check.dataset.ftthType);
    return;
  }
  // Select-all checkbox per panel header
  ['odp', 'odc', 'otb'].forEach(type => {
    const cap = type.charAt(0).toUpperCase() + type.slice(1);
    if (event.target === $(`ftthSelectAll${cap}`)) {
      const checked = event.target.checked;
      document.querySelectorAll(`.ftth-bulk-check[data-ftth-type="${type}"]`)
        .forEach(c => { c.checked = checked; });
      updateFtthBulkBar(type);
    }
  });
});

/* ── FTTH BULK DELETE — "Hapus Terpilih" button per panel ── */
document.addEventListener('click', event => {
  const bulkBtn = event.target.closest('[data-ftth-bulk-delete]');
  if (!bulkBtn) return;
  const type    = bulkBtn.dataset.ftthBulkDelete;
  const checks  = [...document.querySelectorAll(`.ftth-bulk-check[data-ftth-type="${type}"]:checked`)];
  if (checks.length === 0) return;
  if (!confirm(`Hapus ${checks.length} data ${type.toUpperCase()} yang dipilih?`)) return;
  // Collect indexes descending so splices don't shift positions
  const indexes = checks.map(c => Number(c.dataset.ftthIdx)).sort((a, b) => b - a);
  indexes.forEach(i => FTTH_POINTS.splice(i, 1));
  writeAppData('ftthPoints', FTTH_POINTS);
  populateOdcOptions();
  populateRouteOptions();
  renderFtthTables();
  renderFtthValidation();
  showToast(`${indexes.length} data ${type.toUpperCase()} berhasil dihapus.`);
});

$('btnFtthSearch')?.addEventListener('click', renderFtthValidation);
$('ftthSearch')?.addEventListener('input',   renderFtthValidation);
$('ftthSearch')?.addEventListener('keydown', event => { if (event.key === 'Enter') renderFtthValidation(); });
$('btnRunValidation')?.addEventListener('click', () => {
  renderFtthValidation();
  showToast('Validasi jaringan berhasil diperbarui.');
});
$('btnAddFtthPoint')?.addEventListener('click', () =>
  showToast('Form tambah titik akan menggunakan data teknis lapangan.')
);
$('ftthDataFile')?.addEventListener('change', event => importFtthFile(event.target.files[0]));
$('btnValidateData')?.addEventListener('click', () => {
  renderFtthValidation();
  showToast('Validasi data jaringan selesai.');
});

/* ── CLEAR ODP/ODC DATA ──────────────────────────────────── */
$('btnResetFtthData')?.addEventListener('click', async () => {
  if (!confirm('Kosongkan semua data ODP dan ODC?\n\nData ODP dan ODC akan dihapus dari tampilan. Data OTB tetap dipertahankan.')) return;
  for (let index = FTTH_POINTS.length - 1; index >= 0; index--) {
    if (FTTH_POINTS[index].type === 'odp' || FTTH_POINTS[index].type === 'odc') {
      FTTH_POINTS.splice(index, 1);
    }
  }
  ftthRoutes = [];
  await writeAppData('ftthPoints', FTTH_POINTS);
  await writeAppData('ftthRoutes', ftthRoutes);
  populateOdcOptions();
  populateRouteOptions();
  updateFtthMap(FTTH_POINTS);
  renderFtthRoutes();
  renderFtthTables();
  renderFtthValidation();
  showToast('Data ODP dan ODC berhasil dikosongkan.');
});

/* ── LOAD FTTH ODC DATABASE ──────────────────────────────── */
async function loadOdcDatabase() {
  if (EMPTY_DEFAULT_FTTH_NETWORK) return;
  // Only seed from JSON file on first run (storage key not yet set).
  // If the user has already interacted with data (even deleted everything),
  // the key exists as [] and we must not re-inject.
  try {
    const stored = DEFAULT_DATA_ONLY ? null : await readAppData('ftthPoints', null);
    if (stored !== null) return; // user's data takes priority
    const response = await fetch('ftth-odc-data.json');
    const data = await response.json();
    if (!data.odc || !Array.isArray(data.odc)) return;
    const odcPoints = data.odc.map(odc => ({
      type: 'odc',
      id: odc.id,
      name: odc.nama,
      olt: odc.olt,
      interface: odc.interface,
      splitter: odc.splitter,
      attenuation: odc.redaman,
      oop: odc.oop,
      customers: odc.pelanggan,
      description: odc.pelanggan,
      coordinates: odc.koordinat[0] + ', ' + odc.koordinat[1],
      lat: odc.koordinat[0],
      lng: odc.koordinat[1],
      status: 'valid'
    }));
    // Merge — don't overwrite ODC entries the user may have added manually
    const existingNames = new Set(FTTH_POINTS.filter(p => p.type === 'odc').map(p => p.name));
    odcPoints.filter(p => !existingNames.has(p.name)).forEach(p => FTTH_POINTS.push(p));
    console.log(`Seeded ${odcPoints.length} ODC points from JSON (first run).`);
  } catch (error) {
    console.warn('Could not load ODC database:', error);
  }
}

// Add search functionality for all FTTH tables
function initFtthSearchListeners() {
  const searchBoxes = document.querySelectorAll('.ftth-list-search');
  searchBoxes.forEach(searchBox => {
    searchBox.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      const panel = e.target.closest('.ftth-data-view');
      if (!panel) return;
      const tbody = panel.querySelector('table tbody');
      if (!tbody) return;
      
      const rows = tbody.querySelectorAll('tr');
      rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(query) ? '' : 'none';
      });
    });
  });
}

// Add auto-fill functionality for ODC table rows
function initOdcRowClickListeners() {
  const table = document.querySelector('[data-ftth-panel="odc"] .ftth-list-table');
  if (!table) return;
  
  table.addEventListener('click', (e) => {
    const row = e.target.closest('tr');
    if (!row || !row.querySelector('td')) return;
    
    // Skip if clicking on action buttons
    if (e.target.closest('.ftth-row-actions')) return;
    
    // Get the ODC name from the first column
    const odcName = row.querySelector('td:first-child')?.textContent.trim();
    if (!odcName) return;
    
    // Find the ODC in FTTH_POINTS
    const odc = FTTH_POINTS.find(p => p.type === 'odc' && p.name === odcName);
    if (!odc) return;
    
    // Auto-fill the main form
    $('interfaceOlt').value = odc.interface || '';
    showToast(`ODC ${odcName} dimuat ke form!`);
  });
}

// Initialize FTTH system
(async () => {
  await loadOdcDatabase();
  loadLeafletMap();
  renderFtthTables();
  renderFtthValidation();
  initFtthSearchListeners();
  initOdcRowClickListeners();
})();

document.querySelectorAll('.tab-bar .tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-bar .tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    const tab = btn.dataset.tab;
    // Tampilkan panel yang sesuai, sembunyikan yang lain
    Object.entries(TAB_PANELS).forEach(([key, el]) => {
      if (!el) return;
      if (key === 'unb') {
        el.style.display = tab === 'unb' ? 'grid' : 'none';
      } else {
        el.style.display = tab === key ? 'block' : 'none';
      }
    });
    if (tab === 'ftth' && ftthMap) {
      requestAnimationFrame(() => { ftthMap.invalidateSize(true); ftthTileLayer?.redraw(); });
    }
  });
});

/* ── MODAL: QUICK FILL ────────────────────────────────────── */
function openModal() {
  EL.pasteOnu.value     = '';
  EL.pasteKoneksi.value = '';
  $('pasteBebas').value = '';
  hideBebas();
  setTab('onu');
  EL.qfModal.classList.remove('hidden');
}
function closeModal() {
  EL.qfModal.classList.add('hidden');
}
function hideBebas() {
  $('qfFormatBadge').style.display = 'none';
  $('qfPreview').style.display     = 'none';
}
function setTab(tab) {
  const tabs = ['onu', 'koneksi', 'bebas'];
  tabs.forEach(t => {
    $('tab'  + t.charAt(0).toUpperCase() + t.slice(1)).classList.toggle('active', t === tab);
    $('panel'+ t.charAt(0).toUpperCase() + t.slice(1)).style.display = t === tab ? 'block' : 'none';
  });
}

$('btnQuickFill').addEventListener('click', openModal);
EL.qfClose.addEventListener('click',  closeModal);
EL.qfCancel.addEventListener('click', closeModal);
EL.qfModal.addEventListener('click', (e) => { if (e.target === EL.qfModal) closeModal(); });
EL.tabOnu.addEventListener('click',      () => setTab('onu'));
EL.tabKoneksi.addEventListener('click',  () => setTab('koneksi'));
$('tabBebas').addEventListener('click',  () => setTab('bebas'));

/* ── PARSER ───────────────────────────────────────────────── */
/**
 * Normalisasi teks ONU: pisah tab jadi newline sehingga
 * "Name:\t2010100005\tSerial number:\tHWTC..." jadi baris terpisah.
 */
function normalizeText(raw) {
  return raw.split(/\n/).map(line => line.split(/\t/).join('\n')).join('\n');
}

/**
 * Cari nilai pertama yang cocok dengan salah satu key.
 * Nilai diambil hanya sampai akhir baris (sudah dinormalisasi).
 */
function extractField(text, ...keys) {
  for (const key of keys) {
    const re = new RegExp(`(?:^|\\n)\\s*${key}\\s*:\\s*([^\\n]+)`, 'i');
    const m  = text.match(re);
    if (m) {
      const val = m[1].trim();
      if (val) return val;
    }
  }
  return '';
}

/**
 * Parser Detail ONU — hanya ambil:
 *   ONU interface → interfaceOlt + onuId
 *   Name          → idPelanggan
 *   Serial number → sn
 *   Description   → namaPelanggan (dan idPelanggan jika Name kosong)
 */
/* Peta VLAN → tipe konfigurasi (untuk auto-detect) */
const VLAN_CONFIG_MAP = {
  '100':  'v100',
  '1600': 'v1600',
  '1501': 'v1501',
  '602':  'v602',
  '903':  'v903',
  '511':  'ucd_v511',
  '105':  'bridge',
  '1500': 'bridge_bolo',
  '1601': 'bridge_1601',
  '514':  'ucd_bridge514',
};

function parseOnuText(rawInput) {
  const raw    = normalizeText(rawInput);
  const result = {};

  // 1. ONU interface
  const ifaceM = raw.match(/gpon[_-]onu[_-](\d+\/\d+\/\d+):(\d+)/i);
  if (ifaceM) {
    result.interfaceOlt = ifaceM[1];
    result.onuId        = ifaceM[2];
  }

  // 2. Name → ambil token pertama saja (ID pelanggan = angka)
  const nameRaw = extractField(raw, 'Name');
  if (nameRaw) result.idPelanggan = nameRaw.split(/\s/)[0];

  // 3. Serial number → token pertama, alfanumerik saja
  const snRaw = extractField(raw, 'Serial number', 'Serial Number');
  if (snRaw) result.sn = snRaw.split(/\s/)[0].replace(/[^A-Za-z0-9]/g, '').toUpperCase();

  // 4. Description: "ID - NAMA" → pisah di ' - '
  const descRaw = extractField(raw, 'Description');
  if (descRaw) {
    const sep = descRaw.indexOf(' - ');
    if (sep !== -1) {
      if (!result.idPelanggan) result.idPelanggan = descRaw.slice(0, sep).trim();
      result.namaPelanggan = descRaw.slice(sep + 3).trim().toUpperCase();
    }
  }

  // 5. Auto-detect configType dari VLAN (user-vlan XXXX atau vlan XXXX)
  const vlanM = raw.match(/user[- ]vlan\s+(\d+)/i) || raw.match(/\bvlan\s+(\d+)\b/i);
  if (vlanM && VLAN_CONFIG_MAP[vlanM[1]]) {
    result.configType = VLAN_CONFIG_MAP[vlanM[1]];
  }

  return result;
}

function parseUnconfiguredOnuText(rawInput) {
  const raw = rawInput.replace(/\r/g, '');
  const result = {};
  const interfaceMatches = [...raw.matchAll(/gpon-(?:olt|onu)_(\d+\/\d+\/\d+):\s*(\d+)/gi)];
  if (interfaceMatches.length) {
    result.interfaceOlt = interfaceMatches[0][1];
    result.onuId = interfaceMatches[0][2];
  }

  const serialPatterns = [
    /(?:serial(?:\s+number)?|sn)\s*[:=]\s*([A-Za-z0-9]{8,})/i,
    /\b([A-Z]{4}[A-Z0-9]{8,})\b/
  ];
  for (const pattern of serialPatterns) {
    const match = raw.match(pattern);
    if (match) {
      result.sn = match[1].replace(/[^A-Za-z0-9]/g, '').toUpperCase();
      break;
    }
  }

  if (!result.interfaceOlt) {
    const oltMatch = raw.match(/gpon-olt_(\d+\/\d+\/\d+)/i);
    if (oltMatch) result.interfaceOlt = oltMatch[1];
  }
  if (!result.onuId && result.interfaceOlt) {
    const sameLine = raw.match(new RegExp(`gpon-olt_${result.interfaceOlt.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*[:#-]?\\s*(\\d+)`, 'i'));
    if (sameLine) result.onuId = sameLine[1];
  }
  return result;
}

$('btnCopyUncfgCommand').addEventListener('click', function() {
  copyToClipboard('show gpon onu uncfg', this);
});

$('btnDetectOnu').addEventListener('click', () => {
  const raw = $('uncfgOutput').value.trim();
  if (!raw) {
    $('onuDetectStatus').textContent = 'Paste hasil command terlebih dahulu.';
    return;
  }
  const data = parseUnconfiguredOnuText(raw);
  let filled = 0;
  if (data.interfaceOlt) { EL.interfaceOlt.value = data.interfaceOlt; filled++; }
  if (data.onuId) { EL.onuId.value = data.onuId; filled++; }
  if (data.sn) { EL.sn.value = data.sn; filled++; }
  renderCmdHub();
  $('onuDetectStatus').textContent = filled === 3
    ? `ONU ditemukan: ${data.interfaceOlt}:${data.onuId} / ${data.sn}`
    : 'Data ONU belum lengkap. Pastikan output memuat slot dan SN.';
  if (filled) showToast(`${filled} data ONU berhasil diisi otomatis!`);
});

/**
 * Parser Detail Koneksi — hanya ambil:
 *   ID Pelanggan, Nama Pelanggan, PPPoE User, PPPoE Pass
 */
function parseKoneksiText(rawInput) {
  const raw    = normalizeText(rawInput);
  const result = {};

  const idRaw = extractField(raw, 'ID Pelanggan');
  if (idRaw) result.idPelanggan = idRaw.split(/\s/)[0].replace(/\D/g, '');

  const namaRaw = extractField(raw, 'Nama Pelanggan', 'Nama');
  if (namaRaw) result.namaPelanggan = namaRaw.replace(/[^A-Za-z0-9 .,']/g, '').trim().toUpperCase();

  const userRaw = extractField(raw, 'PPPoE User', 'Username');
  if (userRaw) result.pppoeUser = userRaw.split(/\s/)[0];

  const passRaw = extractField(raw, 'PPPoE Pass', 'Password');
  if (passRaw) result.pppoePass = passRaw.split(/\s/)[0];

  return result;
}

/* ═══════════════════════════════════════════════════════════
   MULTI-FORMAT PARSER ENGINE (Teks Bebas)
   Mendukung: CSV/Excel, Tabel HTML (tab-sep), Chat/WA, Key-Value
═══════════════════════════════════════════════════════════ */

/**
 * Daftar alias per field — kunci yang akan dicari dari teks bebas.
 * Urutan: paling spesifik dulu.
 */
const FIELD_ALIASES = {
  idPelanggan:   ['id pelanggan', 'id', 'customer id', 'no pelanggan', 'nomor pelanggan', 'cust id', 'custid', 'no_pelanggan', 'id_pelanggan', 'idpel', 'id_pel', 'nocust'],
  namaPelanggan: ['nama pelanggan', 'nama', 'name', 'customer name', 'pelanggan', 'nama_pelanggan', 'nama_cust', 'custname'],
  interfaceOlt:  ['interface olt', 'interface', 'port olt', 'olt port', 'olt interface', 'port', 'gpon port', 'port_olt', 'pon', 'pon_port', 'olt_port'],
  onuId:         ['onu id', 'onuid', 'onu', 'ont id', 'ont', 'onu_id', 'ont_id', 'ontid'],
  sn:            ['serial number', 'serial', 'sn', 's/n', 'serial no', 'no seri', 'sn_ont', 'sn_onu', 'serial_number'],
  pppoeUser:     ['pppoe user', 'pppoe username', 'username', 'user pppoe', 'user', 'login', 'pppoe_user', 'username_pppoe', 'user_pppoe'],
  pppoePass:     ['pppoe pass', 'pppoe password', 'password', 'pass', 'passwd', 'sandi', 'pppoe_pass', 'password_pppoe', 'pass_pppoe'],
  macAddr:       ['mac address', 'mac addr', 'mac', 'mac_address', 'mac_addr', 'alamat mac', 'mac_onu', 'mac ont'],
  paket:         ['paket layanan', 'paket', 'service', 'profile', 'layanan', 'bandwidth', 'paket_layanan', 'profile_layanan'],
};

/**
 * detectFormat(text) → 'csv' | 'table' | 'chat' | 'kv' | 'unknown'
 *
 * Heuristik:
 *  csv   — baris berisi ≥3 token yang dipisah koma atau titik koma (tanpa banyak ':')
 *  table — baris pertama berisi TAB dan ≥3 kolom (copy dari browser)
 *  chat  — ada pola *bold:* atau **bold:** (WhatsApp / Telegram markdown)
 *  kv    — ada pola key=value atau key: value berulang
 */
function detectFormat(text) {
  const lines = text.split(/\n/).map(l => l.trim()).filter(Boolean);
  if (!lines.length) return 'unknown';

  // Chat/WA: *Label:* atau **Label:**
  const chatScore = lines.filter(l => /\*{1,2}[^*]+\*{1,2}\s*:?/.test(l)).length;
  if (chatScore >= 1) return 'chat';

  // CSV: baris mengandung ≥3 koma atau ≥3 titik koma
  const csvComma = lines.filter(l => (l.match(/,/g) || []).length >= 2).length;
  const csvSemi  = lines.filter(l => (l.match(/;/g) || []).length >= 2).length;
  if (csvComma >= 1 || csvSemi >= 1) return 'csv';

  // Table (tab-separated): baris dengan ≥2 TAB
  const tabScore = lines.filter(l => (l.match(/\t/g) || []).length >= 2).length;
  if (tabScore >= 1) return 'table';

  // KV: key: value atau key = value atau key | value
  const kvScore = lines.filter(l => /^[^:=|]+[:=|]\s*.+/.test(l)).length;
  if (kvScore >= lines.length * 0.4) return 'kv';

  return 'unknown';
}

/**
 * Normalisasi header label ke slug untuk pencocokan alias.
 */
function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim();
}

/**
 * Cari nama field dari label mentah menggunakan FIELD_ALIASES.
 * Kembalikan nama field (key di FIELD_ALIASES) atau null.
 */
function matchAlias(label) {
  const slug = slugify(label);
  if (!slug) return null; // FIX: empty headers must not match anything
  for (const [field, aliases] of Object.entries(FIELD_ALIASES)) {
    // Require slug length >= 2 for substring matches to avoid single-char false matches
    if (aliases.some(a => slug === a || (slug.length >= 2 && slug.includes(a)) || (a.length >= 2 && a.includes(slug)))) {
      return field;
    }
  }
  return null;
}

/**
 * Sanitize nilai field berdasarkan jenis field yang diharapkan.
 */
function sanitizeValue(field, raw) {
  const v = raw.trim().replace(/^["']|["']$/g, ''); // strip kutip
  if (!v || v === '-' || v === 'null' || v === 'N/A') return '';
  switch (field) {
    case 'idPelanggan': {
      // Strip leading garbage chars (semicolons, commas, spaces) then take first token
      const raw = v.replace(/^[;,\s]+/, '').split(/\s/)[0];
      // Must be purely numeric and at least 6 digits to be a valid customer ID
      return /^\d{6,15}$/.test(raw) ? raw : '';
    }
    case 'pppoeUser':   return v.split(/\s/)[0];
    case 'pppoePass':   return v.split(/\s/)[0];
    case 'sn':          return v.split(/\s/)[0].replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    case 'namaPelanggan': {
      // Reject values containing semicolons, date patterns, or leading garbage
      if (/[;]/.test(v) || /\d{4}-\d{2}-\d{2}/.test(v)) return '';
      const cleaned = v.replace(/^[^A-Za-z]+/, '') // strip leading non-alpha
                       .replace(/[^A-Za-z0-9 .,'\/\-]/g, '').trim().toUpperCase();
      // Must have at least 2 letters to be a real name
      return /[A-Z]{2}/.test(cleaned) ? cleaned : '';
    }
    case 'interfaceOlt': {
      // Bisa berupa "gpon-olt_1/4/2" atau "1/4/2" atau "1-4-2"
      const m = v.match(/(\d+)[\/\-](\d+)[\/\-](\d+)/);
      return m ? `${m[1]}/${m[2]}/${m[3]}` : v;
    }
    case 'onuId':       return v.replace(/\D/g, '') || v;
    default:            return v;
  }
}

/* ── ROW VALIDATOR ─────────────────────────────────────────── */
/**
 * Validates that a parsed row represents a real customer record.
 * Rejects metadata rows, header artifacts, address fragments, etc.
 */
function isValidCustomerRow(item) {
  // Must have at least ID or name
  if (!item.idPelanggan && !item.namaPelanggan) return false;

  // idPelanggan, if present, must be purely numeric 6–15 digits
  if (item.idPelanggan && !/^\d{6,15}$/.test(item.idPelanggan)) return false;

  // namaPelanggan, if present, must contain at least 2 alphabetic characters
  if (item.namaPelanggan && !/[A-Za-z]{2}/.test(item.namaPelanggan)) return false;

  // Reject rows where ID looks like a metadata/header string
  const suspiciousId = item.idPelanggan || '';
  if (/^[;,]/.test(suspiciousId)) return false;

  // Reject rows that appear to be address/location fragments
  // (contain commas at end, or are short non-numeric city names)
  const suspiciousName = item.namaPelanggan || '';
  if (/[,;]$/.test(suspiciousName)) return false;

  return true;
}

/* ── CSV PARSER ────────────────────────────────────────────── */
/**
 * Mendukung:
 *  - Header baris pertama (nama kolom) + data rows
 *  - Delimiter: koma, titik koma
 *  - Nilai bisa dalam "kutip"
 *  - Jika tidak ada header yang cocok, coba deteksi posisi kolom dari urutan umum
 */
function parseCsvText(raw) {
  const result = {};
  const lines  = raw.split(/\n/).map(l => l.trim()).filter(Boolean);
  if (!lines.length) return result;

  const sep = (lines[0].match(/;/g) || []).length >= (lines[0].match(/,/g) || []).length ? ';' : ',';
  const splitCsv = (line) => {
    const cols = []; let cur = ''; let inQ = false;
    for (const ch of line) {
      if (ch === '"') { inQ = !inQ; }
      else if (ch === sep && !inQ) { cols.push(cur.trim()); cur = ''; }
      else cur += ch;
    }
    cols.push(cur.trim());
    return cols;
  };

  const headers = splitCsv(lines[0]).map(h => h.replace(/^["']|["']$/g, ''));

  // Cek apakah baris pertama adalah header (berisi teks, bukan angka murni)
  const isHeaderRow = headers.some(h => /[a-zA-Z]/.test(h));

  if (isHeaderRow && lines.length >= 2) {
    // Mode: header → data (ambil baris data pertama yang valid)
    // Skip rows that look like metadata until we find a real data row
    let dataLineIdx = 1;
    while (dataLineIdx < lines.length) {
      const candidate = splitCsv(lines[dataLineIdx]);
      const tmp = {};
      headers.forEach((h, i) => {
        const field = matchAlias(h);
        if (field && candidate[i] !== undefined) {
          const sv = sanitizeValue(field, candidate[i]);
          if (sv) tmp[field] = sv;
        }
      });
      if (isValidCustomerRow(tmp) || dataLineIdx === lines.length - 1) {
        Object.assign(result, tmp);
        break;
      }
      dataLineIdx++;
    }
  } else {
    // Mode: data saja, coba positional mapping (urutan umum)
    const POSITIONAL = ['idPelanggan', 'namaPelanggan', 'pppoeUser', 'pppoePass',
                        'interfaceOlt', 'onuId', 'sn'];
    const values = splitCsv(lines[0]);
    values.forEach((v, i) => {
      if (i < POSITIONAL.length) {
        const sv = sanitizeValue(POSITIONAL[i], v);
        if (sv) result[POSITIONAL[i]] = sv;
      }
    });
  }
  return result;
}

/* ── TABLE PARSER (tab-separated, copy dari browser) ──────── */
/**
 * Mendukung:
 *  - Baris pertama = header kolom (tab-separated)
 *  - Baris kedua dst = data
 *  - Jika header tidak cocok, pakai positional mapping
 */
function parseTableText(raw) {
  const result = {};
  const lines  = raw.split(/\n/).map(l => l.trim()).filter(Boolean);
  if (!lines.length) return result;

  const headers = lines[0].split(/\t/).map(h => h.trim());
  const isHeaderRow = headers.some(h => /[a-zA-Z]/.test(h));

  if (isHeaderRow && lines.length >= 2) {
    const values = lines[1].split(/\t/).map(v => v.trim());
    headers.forEach((h, i) => {
      const field = matchAlias(h);
      if (field && values[i] !== undefined) {
        const v = sanitizeValue(field, values[i]);
        if (v) result[field] = v;
      }
    });
  } else {
    // Satu baris saja, coba positional
    const POSITIONAL = ['idPelanggan', 'namaPelanggan', 'pppoeUser', 'pppoePass',
                        'interfaceOlt', 'onuId', 'sn'];
    const values = lines[0].split(/\t/).map(v => v.trim());
    values.forEach((v, i) => {
      if (i < POSITIONAL.length) {
        const sv = sanitizeValue(POSITIONAL[i], v);
        if (sv) result[POSITIONAL[i]] = sv;
      }
    });
  }
  return result;
}

/* ── CHAT / WHATSAPP PARSER ───────────────────────────────── */
/**
 * Mendukung pola:
 *  - *Label:* nilai           (WhatsApp bold)
 *  - **Label:** nilai         (Telegram/Markdown bold)
 *  - Label: nilai             (polos)
 *  - Label : nilai            (spasi sebelum titik dua)
 *  - Label = nilai            (sama saja)
 *  - Semua dalam satu baris atau multi-baris
 *  - Nilai bisa dilanjut sampai label berikutnya atau akhir baris
 */
function parseChatText(raw) {
  const result = {};

  // Normalisasi: strip markdown bold dari label (*label* atau **label**)
  // Ubah jadi format "Label: Nilai"
  const cleaned = raw
    .replace(/\*{1,2}([^*]+)\*{1,2}\s*:?\s*/g, '$1: ')  // *Label:* → Label:
    .replace(/\n{2,}/g, '\n')                              // double newline → single
    .trim();

  // Split per baris, lalu per pola key: value
  const lines = cleaned.split(/\n/);
  lines.forEach(line => {
    // Coba split pada ':' atau '=' atau '|'
    const m = line.match(/^(.+?)\s*[:=|]\s*(.+)$/);
    if (!m) return;
    const label = m[1].trim();
    const value = m[2].trim();
    const field = matchAlias(label);
    if (field) {
      const v = sanitizeValue(field, value);
      if (v) result[field] = v;
    }
  });

  // Fallback: cari SN dan interface dengan regex langsung di raw
  if (!result.sn) {
    const snM = raw.match(/\b([A-Z]{4}[A-Z0-9]{8,})\b/);
    if (snM) result.sn = snM[1].toUpperCase();
  }
  if (!result.interfaceOlt) {
    const ifM = raw.match(/\b(\d+\/\d+\/\d+)\b/);
    if (ifM) result.interfaceOlt = ifM[1];
  }
  if (!result.onuId && result.interfaceOlt) {
    const oidM = raw.match(/gpon[_-]onu[_-]\d+\/\d+\/\d+:(\d+)/i);
    if (oidM) result.onuId = oidM[1];
  }

  return result;
}

/* ── KEY-VALUE PARSER (format bebas / billing) ────────────── */
/**
 * Paling fleksibel — mendukung:
 *  - key: value
 *  - key = value
 *  - key | value
 *  - key - value  (hanya jika setelah spasi)
 *  - Multi-baris dan inline dalam satu baris
 */
function parseKvText(raw) {
  const result = {};
  const norm   = normalizeText(raw); // tab → newline

  // Kumpulkan semua pasangan key-value dari seluruh teks
  // Pattern: sesuatu diikuti pemisah : = | lalu nilai sampai newline atau pemisah berikutnya
  const re = /([A-Za-z][A-Za-z0-9 _\/]*?)\s*[:=|]\s*([^\n:=|]{1,80})/g;
  let m;
  while ((m = re.exec(norm)) !== null) {
    const label = m[1].trim();
    const value = m[2].trim();
    if (!label || !value) continue;
    const field = matchAlias(label);
    if (field && !result[field]) {
      const v = sanitizeValue(field, value);
      if (v) result[field] = v;
    }
  }

  // Regex fallback untuk pola spesifik
  if (!result.sn) {
    const snM = raw.match(/\b([A-Z]{4}[A-Z0-9]{8,12})\b/);
    if (snM) result.sn = snM[1].toUpperCase();
  }
  if (!result.interfaceOlt) {
    const ifM = raw.match(/\b(\d+\/\d+\/\d+)\b/);
    if (ifM) result.interfaceOlt = ifM[1];
  }
  if (!result.onuId) {
    const oidM = raw.match(/gpon[_-]onu[_-]\d+\/\d+\/\d+:(\d+)/i);
    if (oidM) result.onuId = oidM[1];
  }

  return result;
}

/**
 * Master parser — jalankan semua parser berdasarkan format terdeteksi
 * dan gabungkan hasilnya (format spesifik menang atas fallback).
 */
function parseBebasText(raw) {
  const fmt = detectFormat(raw);
  let result = {};

  switch (fmt) {
    case 'csv':   result = parseCsvText(raw);   break;
    case 'table': result = parseTableText(raw); break;
    case 'chat':  result = parseChatText(raw);  break;
    default:      result = parseKvText(raw);    break; // 'kv' dan 'unknown'
  }

  // Selalu jalankan KV sebagai fallback tambahan (isi field yang masih kosong)
  if (fmt !== 'kv') {
    const kv = parseKvText(raw);
    for (const [k, v] of Object.entries(kv)) {
      if (!result[k] && v) result[k] = v;
    }
  }

  // VLAN auto-detect (sama seperti parseOnuText)
  if (!result.configType) {
    const vlanM = raw.match(/user[- ]vlan\s+(\d+)/i) || raw.match(/\bvlan[_\s]+(\d+)\b/i);
    if (vlanM && VLAN_CONFIG_MAP[vlanM[1]]) result.configType = VLAN_CONFIG_MAP[vlanM[1]];
  }

  result._format = fmt;
  return result;
}

/* ── LIVE PREVIEW saat user mengetik di Teks Bebas ─────────── */
const FORMAT_META = {
  csv:     { label: 'CSV / Excel',       cls: 'fmt-csv',     icon: '📊' },
  table:   { label: 'Tabel (HTML/TSV)',  cls: 'fmt-table',   icon: '📋' },
  chat:    { label: 'Chat / WhatsApp',   cls: 'fmt-chat',    icon: '💬' },
  kv:      { label: 'Key-Value',         cls: 'fmt-kv',      icon: '🔑' },
  unknown: { label: 'Belum Terdeteksi',  cls: 'fmt-unknown', icon: '❓' },
};

const FIELD_LABELS = {
  idPelanggan:   'ID Pelanggan',
  namaPelanggan: 'Nama',
  interfaceOlt:  'Interface OLT',
  onuId:         'ONU ID',
  sn:            'Serial Number',
  pppoeUser:     'PPPoE User',
  pppoePass:     'PPPoE Pass',
  paket:         'Paket Layanan',
  configType:    'Config Type',
};

let _bebasDebounce = null;
$('pasteBebas').addEventListener('input', function () {
  clearTimeout(_bebasDebounce);
  _bebasDebounce = setTimeout(() => {
    const raw = this.value.trim();
    if (!raw) { hideBebas(); return; }

    const data   = parseBebasText(raw);
    const fmt    = data._format || 'unknown';
    const meta   = FORMAT_META[fmt] || FORMAT_META.unknown;
    const badge  = $('qfFormatBadge');
    const label  = $('qfFormatLabel');
    const icon   = $('qfFormatIcon');

    // Update badge
    badge.className    = 'qf-format-badge ' + meta.cls;
    badge.style.display= 'flex';
    label.textContent  = meta.label;
    icon.textContent   = meta.icon;

    // Build preview grid
    const grid = $('qfPreviewGrid');
    grid.innerHTML = '';
    Object.entries(FIELD_LABELS).forEach(([field, lbl]) => {
      const val = data[field];
      const row = document.createElement('div');
      row.className = 'qf-preview-row';
      row.innerHTML = `
        <span class="qf-preview-key">${lbl}</span>
        <span class="qf-preview-val${val ? ' detected' : ' empty'}">${val ? esc(val) : '—'}</span>`;
      grid.appendChild(row);
    });
    $('qfPreview').style.display = 'block';
  }, 280); // debounce 280ms
});

/* ── MODAL SUBMIT ─────────────────────────────────────────── */
EL.qfSubmit.addEventListener('click', () => {
  const activeTab = ['onu','koneksi','bebas'].find(t =>
    $('tab' + t.charAt(0).toUpperCase() + t.slice(1)).classList.contains('active')
  );
  const rawText = (
    activeTab === 'onu'     ? EL.pasteOnu.value     :
    activeTab === 'koneksi' ? EL.pasteKoneksi.value :
                              $('pasteBebas').value
  ).trim();

  if (!rawText) { showToast('Teks belum di-paste!'); return; }

  let data;
  if      (activeTab === 'onu')     data = parseOnuText(rawText);
  else if (activeTab === 'koneksi') data = parseKoneksiText(rawText);
  else                               data = parseBebasText(rawText);

  let filled = 0;
  const setField = (el, val) => { if (val) { el.value = val; filled++; } };

  setField(EL.interfaceOlt,  data.interfaceOlt);
  setField(EL.onuId,         data.onuId);
  setField(EL.sn,            data.sn);

  if (data.idPelanggan) {
    EL.idPelanggan.value = data.idPelanggan;
    EL.pppoeUser.value   = data.idPelanggan;
    filled++;
  }

  setField(EL.namaPelanggan, data.namaPelanggan);
  if (data.pppoeUser) { EL.pppoeUser.value = data.pppoeUser; filled++; }
  setField(EL.pppoePass, data.pppoePass);

  if (data.configType) { EL.configType.value = data.configType; filled++; }
  if (data.paket) {
    // Coba cocokkan dengan opsi paket yang ada
    const opts = [...EL.paketLayanan.options].map(o => o.value.toLowerCase());
    const match = opts.findIndex(o => o.includes(data.paket.toLowerCase()) ||
                                      data.paket.toLowerCase().includes(o));
    if (match >= 0) { EL.paketLayanan.selectedIndex = match; filled++; }
  }

  renderCmdHub();
  closeModal();

  const fmtInfo = activeTab === 'bebas' && data._format
    ? ` (${FORMAT_META[data._format]?.label || data._format})`
    : '';
  showToast(filled
    ? `${filled} field berhasil diisi otomatis!${fmtInfo}`
    : 'Data tidak dikenali — periksa format teks.');
});

/* ── TOOLS: KALKULATOR REDAMAN FO ────────────────────────── */
$('btnCalcFO').addEventListener('click', () => {
  const len      = parseFloat($('foLength').value)   || 0;
  const splice   = parseInt($('foSplice').value)     || 0;
  const konektor = parseInt($('foKonektor').value)   || 0;
  const splitter = parseFloat($('foSplitter').value) || 10.5;
  const txPower  = parseFloat($('foTxPower').value);

  if (isNaN(txPower)) { showToast('Isi Tx Power OLT terlebih dahulu!'); return; }

  const FIBER_LOSS     = 0.35; // dB/km (G.652D)
  const SPLICE_LOSS    = 0.10; // dB/splice
  const KONEKTOR_LOSS  = 0.50; // dB/konektor

  const fiberLoss    = len      * FIBER_LOSS;
  const spliceLoss   = splice   * SPLICE_LOSS;
  const konektorLoss = konektor * KONEKTOR_LOSS;
  const totalLoss    = fiberLoss + spliceLoss + konektorLoss + splitter;
  const rxPower      = txPower - totalLoss;

  // Threshold ZTE GPON ONT
  let statusClass, statusText;
  if      (rxPower >= -8)  { statusClass = 'fo-ok';   statusText = 'SANGAT BAIK'; }
  else if (rxPower >= -20) { statusClass = 'fo-ok';   statusText = 'BAIK'; }
  else if (rxPower >= -24) { statusClass = 'fo-warn'; statusText = 'PERINGATAN — Hampir Batas'; }
  else if (rxPower >= -27) { statusClass = 'fo-warn'; statusText = 'LEMAH — Perlu Cek Kabel'; }
  else                     { statusClass = 'fo-bad';  statusText = 'BURUK — Kemungkinan LOS'; }

  const res = $('foResult');
  res.style.display = 'block';
  res.innerHTML = `
    <div class="fo-row"><span class="fo-label">Redaman Kabel (${len} km × ${FIBER_LOSS})</span><span class="fo-val">- ${fiberLoss.toFixed(2)} dB</span></div>
    <div class="fo-row"><span class="fo-label">Redaman Splice (${splice} × ${SPLICE_LOSS})</span><span class="fo-val">- ${spliceLoss.toFixed(2)} dB</span></div>
    <div class="fo-row"><span class="fo-label">Redaman Konektor (${konektor} × ${KONEKTOR_LOSS})</span><span class="fo-val">- ${konektorLoss.toFixed(2)} dB</span></div>
    <div class="fo-row"><span class="fo-label">Redaman Splitter</span><span class="fo-val">- ${splitter.toFixed(1)} dB</span></div>
    <hr class="fo-sep"/>
    <div class="fo-row"><span class="fo-label">Total Redaman</span><span class="fo-total">- ${totalLoss.toFixed(2)} dB</span></div>
    <div class="fo-row"><span class="fo-label">Tx Power OLT</span><span class="fo-val">+ ${txPower.toFixed(1)} dBm</span></div>
    <hr class="fo-sep"/>
    <div class="fo-row"><span class="fo-label">Estimasi Rx Power ONT</span><span class="fo-val">${rxPower.toFixed(2)} dBm</span></div>
    <div class="fo-row"><span class="fo-label">Status Sinyal</span><span class="${statusClass}">${statusText}</span></div>`;
});

/* ── TOOLS: KONVERTER SUBNET ─────────────────────────────── */
$('btnCalcSubnet').addEventListener('click', () => {
  const raw = $('subnetInput').value.trim();
  const match = raw.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\/(\d{1,2})$/);
  if (!match) {
    showToast('Format tidak valid. Gunakan: 192.168.1.0/24');
    $('subnetInput').classList.add('invalid');
    return;
  }
  $('subnetInput').classList.remove('invalid');

  const [,a,b,c,d,prefix] = match.map(Number);
  if ([a,b,c,d].some(o => o > 255) || prefix > 32) {
    showToast('IP atau prefix tidak valid!');
    return;
  }

  const ipNum    = (a<<24) | (b<<16) | (c<<8) | d;
  const mask     = prefix === 0 ? 0 : (~0 << (32 - prefix)) >>> 0;
  const network  = (ipNum & mask) >>> 0;
  const bcast    = (network | ~mask) >>> 0;
  const firstIP  = prefix >= 31 ? network : network + 1;
  const lastIP   = prefix >= 31 ? bcast   : bcast - 1;
  const hosts    = prefix >= 32 ? 1 : prefix === 31 ? 2 : Math.pow(2, 32 - prefix) - 2;
  const subnetMask = [24,16,8,0].map(s => (mask >>> s) & 0xFF).join('.');

  const toIP = n => [24,16,8,0].map(s => (n >>> s) & 0xFF).join('.');

  const res = $('subnetResult');
  res.style.display = 'block';
  res.innerHTML = `
    <div class="sn-row"><span class="sn-label">IP Address</span><span class="sn-val">${raw.split('/')[0]}</span></div>
    <div class="sn-row"><span class="sn-label">Subnet Mask</span><span class="sn-val">${subnetMask}</span></div>
    <div class="sn-row"><span class="sn-label">Prefix</span><span class="sn-val">/${prefix}</span></div>
    <div class="sn-row"><span class="sn-label">Network Address</span><span class="sn-val">${toIP(network)}</span></div>
    <div class="sn-row"><span class="sn-label">Broadcast</span><span class="sn-val">${toIP(bcast)}</span></div>
    <div class="sn-row"><span class="sn-label">Range IP Host</span><span class="sn-val">${toIP(firstIP)} – ${toIP(lastIP)}</span></div>
    <div class="sn-row"><span class="sn-label">Jumlah Host</span><span class="sn-val">${hosts.toLocaleString('id-ID')} host</span></div>`;
});

/* ── KEYBOARD SHORTCUTS ───────────────────────────────────── */
document.addEventListener('keydown', (e) => {
  // Ctrl+Enter = Generate Script (di tab UNB)
  if (e.ctrlKey && e.key === 'Enter') { e.preventDefault(); generateScript(); }
  // Ctrl+K = Buka Quick Fill
  if (e.ctrlKey && e.key === 'k')     { e.preventDefault(); openModal(); }
  // Esc = Tutup modal
  if (e.key === 'Escape')             { closeModal(); }
  // Ctrl+Shift+R = Reset form
  if (e.ctrlKey && e.shiftKey && e.key === 'R') { e.preventDefault(); $('btnReset').click(); }
});

/* ── TOOLS: MIKROTIK SCRIPT GENERATOR ───────────────────── */
// Sub-tab switching
document.querySelectorAll('.mkt-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.mkt-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    const key = btn.dataset.mkt;
    document.querySelectorAll('.mkt-panel').forEach(p => p.style.display = 'none');
    document.getElementById('mktPanel' + key.charAt(0).toUpperCase() + key.slice(1)).style.display = 'block';
  });
});

function showMktScript(script) {
  const res = $('mktScriptResult');
  res.style.display = 'block';
  $('mktScriptOutput').textContent = script;
}

$('btnMktQueue').addEventListener('click', () => {
  const name    = $('mqName').value.trim()    || '{NAMA}';
  const target  = $('mqTarget').value.trim()  || '{TARGET}';
  const up      = $('mqUp').value.trim()      || '10M';
  const down    = $('mqDown').value.trim()    || '10M';
  const comment = $('mqComment').value.trim() || '';
  const script = `/queue simple add name="${name}" target=${target} max-limit=${up}/${down}` +
    (comment ? ` comment="${comment}"` : '');
  showMktScript(script);
});

$('btnMktPool').addEventListener('click', () => {
  const name  = $('mpName').value.trim()  || '{POOL_NAME}';
  const range = $('mpRange').value.trim() || '{RANGE}';
  showMktScript(`/ip pool add name="${name}" ranges=${range}`);
});

$('btnMktStatic').addEventListener('click', () => {
  const user    = $('msUser').value.trim()    || '{USER}';
  const ip      = $('msIp').value.trim()      || '{IP}';
  const profile = $('msProfile').value.trim() || 'default';
  const comment = $('msComment').value.trim() || '';
  const script = `/ppp secret set [find name="${user}"] remote-address=${ip} profile="${profile}"` +
    (comment ? ` comment="${comment}"` : '');
  showMktScript(script);
});

$('btnMktNat').addEventListener('click', () => {
  const chain   = $('mnChain').value;
  const outIf   = $('mnOutIface').value.trim()  || '{OUT_IFACE}';
  const srcAddr = $('mnSrcAddr').value.trim();
  const comment = $('mnComment').value.trim()   || '';
  let script = `/ip firewall nat add chain=${chain} out-interface="${outIf}" action=masquerade`;
  if (srcAddr) script += ` src-address=${srcAddr}`;
  if (comment) script += ` comment="${comment}"`;
  showMktScript(script);
});

$('copyMktTool').addEventListener('click', function () {
  const txt = $('mktScriptOutput').textContent.trim();
  if (!txt) { showToast('Generate script terlebih dahulu!'); return; }
  copyToClipboard(txt, this);
});

/* ── DATABASE CUSTOMER (IndexedDB) ─────────────────────────── */
const DB_KEY = 'gponCustomers';
let customerCache = [];

function loadCustomers() {
  return customerCache;
}

function saveCustomers(list) {
  customerCache = list;
  writeAppData(DB_KEY, list);
}

// Render customer database table
function renderCustomerTable(query = '') {
  const list = loadCustomers();
  const tbody = $('custTableBody');
  const empty = $('dbEmptyState');
  tbody.innerHTML = '';

  const q = query.toLowerCase().trim();
  const filtered = q
    ? list.filter(c =>
        (c.idPelanggan || '').toLowerCase().includes(q) ||
        (c.namaPelanggan || '').toLowerCase().includes(q) ||
        (c.sn || '').toLowerCase().includes(q) ||
        (c.pppoeUser || '').toLowerCase().includes(q)
      )
    : list;

  if (!filtered.length) {
    empty.style.display = 'block';
    empty.textContent = q
      ? `Tidak ada pelanggan yang cocok dengan pencarian "${q}".`
      : 'Belum ada data pelanggan. Silakan import CSV atau tambah manual.';
    return;
  }
  empty.style.display = 'none';

  filtered.forEach((c, idx) => {
    // Map to original index in the unfiltered list for correct CRUD operations
    const originalIndex = list.findIndex(orig =>
      orig.idPelanggan === c.idPelanggan && orig.namaPelanggan === c.namaPelanggan
    );
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><input type="checkbox" class="bulk-customer-check" data-index="${originalIndex}" aria-label="Pilih ${esc(c.idPelanggan || 'pelanggan')}"/></td>
      <td><b>${esc(c.idPelanggan || '—')}</b></td>
      <td>${esc(c.namaPelanggan || '—')}</td>
      <td>${esc(c.interfaceOlt || '—')}</td>
      <td>${esc(c.onuId || '—')}</td>
      <td><code>${esc(c.sn || '—')}</code></td>
      <td>${esc(c.pppoeUser || '—')}</td>
      <td><span class="badge-toggle" style="background:#1e3a5f;">${esc(c.paket || 'KUSUMA 1')}</span></td>
      <td>
        <div style="display:flex;gap:4px;">
          <button class="btn-db-action use" onclick="useCustomerData(${originalIndex})">Use</button>
          <button class="btn-db-action edit" onclick="editCustomerData(${originalIndex})">Edit</button>
          <button class="btn-db-action delete" onclick="deleteCustomerData(${originalIndex})">Del</button>
        </div>
      </td>
    `;
    tbody.appendChild(row);
  });
}

/* ── BULK CONFIGURATION ───────────────────────────────────── */
function getBulkSelectedIndexes() {
  return [...document.querySelectorAll('.bulk-customer-check:checked')]
    .map(check => Number(check.dataset.index))
    .filter(Number.isInteger);
}

function updateBulkSelection() {
  const selected = getBulkSelectedIndexes();
  $('bulkSelectedCount').textContent = `${selected.length} dipilih`;
  const checks = [...document.querySelectorAll('.bulk-customer-check')];
  const selectAll = $('bulkSelectAll');
  if (selectAll) {
    selectAll.checked = checks.length > 0 && checks.every(check => check.checked);
    selectAll.indeterminate = selected.length > 0 && !selectAll.checked;
  }
}

function parseAvailableOnuIds(raw, interfaceOlt) {
  const ids = [];
  const escapedInterface = interfaceOlt.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const interfacePattern = interfaceOlt
    ? new RegExp(`gpon-(?:olt|onu)_${escapedInterface}:(\\d+)`, 'gi')
    : /gpon-(?:olt|onu)_\d+\/\d+\/\d+:(\d+)/gi;
  let match;
  while ((match = interfacePattern.exec(raw)) !== null) ids.push(match[1]);

  if (!ids.length) {
    raw.split(/\r?\n/).forEach(line => {
      const lineMatch = line.match(/(?:onu|ont)\s*(?:id\s*)?(\d+)\b/i);
      if (lineMatch) ids.push(lineMatch[1]);
    });
  }
  return [...new Set(ids)].sort((a, b) => Number(a) - Number(b));
}

function setBulkStatus(message, isError = false) {
  const status = $('bulkStatus');
  status.textContent = message;
  status.className = `bulk-status${isError ? ' error' : ' success'}`;
}

$('bulkSelectAll').addEventListener('change', function() {
  document.querySelectorAll('.bulk-customer-check').forEach(check => {
    check.checked = this.checked;
  });
  updateBulkSelection();
});

$('custTableBody').addEventListener('change', event => {
  if (event.target.classList.contains('bulk-customer-check')) updateBulkSelection();
});

$('btnBulkAssign').addEventListener('click', () => {
  const indexes = getBulkSelectedIndexes();
  const interfaceOlt = $('bulkInterfaceOlt').value.trim();
  const availableIds = parseAvailableOnuIds($('bulkUncfgText').value, interfaceOlt);
  if (!indexes.length) { setBulkStatus('Pilih minimal satu pelanggan terlebih dahulu.', true); return; }
  if (!availableIds.length) { setBulkStatus('ONU kosong tidak ditemukan. Paste output show gpon onu uncfg.', true); return; }

  const customers = loadCustomers();
  const usedIds = new Set(customers
    .filter(c => (interfaceOlt && c.interfaceOlt === interfaceOlt) || !interfaceOlt)
    .map(c => String(c.onuId || '')));
  const targets = indexes.map(index => customers[index]).filter(Boolean);
  const pending = targets.filter(customer => !customer.onuId);
  const freeIds = availableIds.filter(id => !usedIds.has(id));
  if (freeIds.length < pending.length) {
    setBulkStatus(`ONU kosong tersedia ${freeIds.length}, sedangkan yang membutuhkan ONU ${pending.length}.`, true);
    return;
  }

  let assigned = 0;
  targets.forEach(customer => {
    if (!customer.onuId) {
      customer.onuId = freeIds[assigned++];
      if (interfaceOlt) customer.interfaceOlt = interfaceOlt;
    }
  });
  saveCustomers(customers);
  renderCustomerTable($('custSearch').value);
  indexes.forEach(index => {
    const check = document.querySelector(`.bulk-customer-check[data-index="${index}"]`);
    if (check) check.checked = true;
  });
  updateBulkSelection();
  setBulkStatus(`${assigned} ONU berhasil dialokasikan otomatis.`, false);
});

function generateBulkScript() {
  const indexes = getBulkSelectedIndexes();
  const defaultInterface = $('bulkInterfaceOlt').value.trim();
  const type = $('bulkConfigType').value;
  const customers = loadCustomers();
  const errors = [];
  const blocks = [];

  indexes.forEach(index => {
    const customer = customers[index];
    if (!customer) return;
    const values = {
      IF: customer.interfaceOlt || defaultInterface,
      OID: customer.onuId,
      SN: customer.sn,
      IDP: customer.idPelanggan,
      NMP: customer.namaPelanggan,
      PU: customer.pppoeUser || customer.idPelanggan,
      PP: customer.pppoePass,
      PL: customer.paket || 'KUSUMA 1',
    };
    const missing = ['IF', 'OID', 'SN', 'IDP', 'NMP', 'PU', 'PP'].filter(field => !values[field]);
    if (missing.length) {
      errors.push(`${customer.idPelanggan || `baris ${index + 1}`}: ${missing.join(', ')}`);
      return;
    }
    blocks.push(TEMPLATES[type](values));
  });

  if (!indexes.length) { setBulkStatus('Pilih minimal satu pelanggan terlebih dahulu.', true); return ''; }
  if (errors.length) {
    setBulkStatus(`Data belum lengkap: ${errors.join(' | ')}`, true);
    return '';
  }
  const script = blocks.join('\n\n');
  $('bulkOutput').textContent = script;
  $('bulkOutput').classList.remove('hidden');
  setBulkStatus(`${blocks.length} konfigurasi berhasil dibuat.`, false);
  return script;
}

$('btnBulkGenerate').addEventListener('click', generateBulkScript);
$('btnBulkExport').addEventListener('click', () => {
  const script = $('bulkOutput').textContent.trim() || generateBulkScript();
  if (!script) return;
  downloadTxt(script, `OLT_BULK_${new Date().toISOString().slice(0, 10)}.txt`);
  showToast('Script bulk berhasil diunduh!');
});

// Expose these CRUD actions to window scope since they are inline event listeners in innerHTML
window.useCustomerData = function(idx) {
  const list = loadCustomers();
  const c = list[idx];
  if (!c) return;

  EL.interfaceOlt.value = c.interfaceOlt || '';
  EL.onuId.value        = c.onuId || '';
  EL.sn.value           = c.sn || '';
  EL.macAddr.value      = c.macAddr || '';
  EL.idPelanggan.value  = c.idPelanggan || '';
  EL.namaPelanggan.value= c.namaPelanggan || '';
  EL.pppoeUser.value    = c.pppoeUser || '';
  EL.pppoePass.value    = c.pppoePass || '';
  EL.paketLayanan.value = c.paket || 'KUSUMA 1';

  renderCmdHub();
  // Switch back to UNB tab
  document.querySelector('.tab-bar .tab[data-tab="unb"]').click();
  showToast('Data pelanggan berhasil dimuat ke form!');
};

window.editCustomerData = function(idx) {
  const list = loadCustomers();
  const c = list[idx];
  if (!c) return;

  $('custTitle').textContent = 'Edit Pelanggan';
  $('custIndex').value       = idx;
  $('c_idPelanggan').value   = c.idPelanggan || '';
  $('c_namaPelanggan').value = c.namaPelanggan || '';
  $('c_interfaceOlt').value  = c.interfaceOlt || '';
  $('c_onuId').value         = c.onuId || '';
  $('c_sn').value            = c.sn || '';
  $('c_macAddr').value       = c.macAddr || '';
  $('c_pppoeUser').value     = c.pppoeUser || '';
  $('c_pppoePass').value     = c.pppoePass || '';
  $('c_paketLayanan').value  = c.paket || 'KUSUMA 1';

  $('custModal').classList.remove('hidden');
};

window.deleteCustomerData = function(idx) {
  if (!confirm('Apakah Anda yakin ingin menghapus pelanggan ini?')) return;
  const list = loadCustomers();
  list.splice(idx, 1);
  saveCustomers(list);
  renderCustomerTable($('custSearch').value);
  showToast('Data pelanggan berhasil dihapus!');
};

// Modal Operations
function closeCustModal() {
  $('custModal').classList.add('hidden');
}

$('custClose').addEventListener('click', closeCustModal);
$('custCancel').addEventListener('click', closeCustModal);
$('custModal').addEventListener('click', (e) => { if (e.target === $('custModal')) closeCustModal(); });

$('btnTambahCust').addEventListener('click', () => {
  $('custTitle').textContent = 'Tambah Pelanggan';
  $('custIndex').value       = '';
  $('custForm').reset();
  $('custModal').classList.remove('hidden');
});

$('custSubmit').addEventListener('click', () => {
  const idPel   = $('c_idPelanggan').value.trim();
  const namaPel = $('c_namaPelanggan').value.trim().toUpperCase();
  if (!idPel || !namaPel) {
    showToast('ID Pelanggan dan Nama Pelanggan wajib diisi!');
    return;
  }

  const list = loadCustomers();
  const idx = $('custIndex').value;

  const data = {
    idPelanggan:   idPel,
    namaPelanggan: namaPel,
    interfaceOlt:  $('c_interfaceOlt').value.trim(),
    onuId:         $('c_onuId').value.trim(),
    sn:            $('c_sn').value.trim().toUpperCase(),
    macAddr:       formatMac($('c_macAddr').value.trim()),
    pppoeUser:     $('c_pppoeUser').value.trim() || idPel,
    pppoePass:     $('c_pppoePass').value.trim(),
    paket:         $('c_paketLayanan').value,
  };

  if (idx !== '') {
    list[idx] = data;
    showToast('Data pelanggan berhasil diperbarui!');
  } else {
    list.unshift(data);
    showToast('Data pelanggan baru berhasil ditambahkan!');
  }

  saveCustomers(list);
  closeCustModal();
  renderCustomerTable($('custSearch').value);
});

// CSV / Excel Import Logic
$('btnImportCsv').addEventListener('click', () => $('csvFileInput').click());

$('csvFileInput').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (!file) return;

  const ext = file.name.split('.').pop().toLowerCase();
  const isExcel = ext === 'xlsx' || ext === 'xls';

  function processData(imported, label) {
    if (!imported.length) {
      showToast(`Tidak ada data pelanggan valid yang terdeteksi di ${label}.`);
      return;
    }
    const current = loadCustomers();
    let count = 0;
    imported.forEach(imp => {
      const exists = current.some(c =>
        (imp.idPelanggan && c.idPelanggan === imp.idPelanggan) ||
        (imp.namaPelanggan && c.namaPelanggan === imp.namaPelanggan)
      );
      if (!exists) { current.push(imp); count++; }
    });
    saveCustomers(current);
    renderCustomerTable();
    showToast(`Sukses mengimport ${count} data pelanggan baru dari ${label}!`);
  }

  if (isExcel) {
    if (typeof XLSX === 'undefined') {
      showToast('Library SheetJS belum dimuat. Coba refresh halaman.');
      return;
    }
    const reader = new FileReader();
    reader.onload = function(evt) {
      try {
        const data   = new Uint8Array(evt.target.result);
        const wb     = XLSX.read(data, { type: 'array' });
        // Ambil sheet pertama
        const sheet  = wb.Sheets[wb.SheetNames[0]];
        // Konversi ke CSV string dengan separator semicolon agar tetap konsisten
        const csv    = XLSX.utils.sheet_to_csv(sheet, { FS: ';' });
        const imported = parseCsvData(csv);
        processData(imported, 'Excel');
      } catch (err) {
        showToast('Gagal membaca file Excel: ' + err.message);
      }
    };
    reader.readAsArrayBuffer(file);
  } else {
    const reader = new FileReader();
    reader.onload = function(evt) {
      const imported = parseCsvData(evt.target.result);
      processData(imported, 'CSV');
    };
    reader.readAsText(file);
  }

  e.target.value = ''; // Reset file input
});

/* ── PAKET NORMALIZER ─────────────────────────────────────────── */
const VALID_PAKETS = ['KUSUMA 1', 'KUSUMA 2', 'KUSUMA 3', 'METRO 10'];

function normalizePaket(raw) {
  if (!raw) return 'KUSUMA 1';
  const up = raw.toUpperCase().trim();
  // Exact match
  if (VALID_PAKETS.includes(up)) return up;
  // Partial match: find first valid option that is contained in the raw value
  const found = VALID_PAKETS.find(p => up.includes(p));
  if (found) return found;
  // Fallback: if it starts with KUSUMA, use KUSUMA 1
  if (up.startsWith('KUSUMA')) return 'KUSUMA 1';
  if (up.includes('METRO') || up.includes('10')) return 'METRO 10';
  return 'KUSUMA 1';
}

function parseCsvData(text) {
  // Strip BOM
  text = text.replace(/^\uFEFF/, '');
  const lines = text.split(/\r\n|\r|\n/).map(l => l.trim()).filter(Boolean);
  if (lines.length === 0) return [];

  // Delimiter auto-detection using first few lines
  let commas = 0, semis = 0, tabs = 0;
  for (let i = 0; i < Math.min(lines.length, 3); i++) {
    commas += (lines[i].match(/,/g) || []).length;
    semis += (lines[i].match(/;/g) || []).length;
    tabs += (lines[i].match(/\t/g) || []).length;
  }
  let sep = ',';
  if (semis > commas && semis > tabs) sep = ';';
  else if (tabs > commas && tabs > semis) sep = '\t';

  const splitLine = (line) => {
    const cols = []; let cur = ''; let inQ = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') { inQ = !inQ; }
      else if (ch === sep && !inQ) { cols.push(cur.trim()); cur = ''; }
      else cur += ch;
    }
    cols.push(cur.trim());
    return cols.map(c => c.replace(/^["']|["']$/g, ''));
  };

  const parsedRows = lines.map(splitLine);
  if (parsedRows.length === 0) return [];

  const firstRow = parsedRows[0];
  const mappedHeaders = firstRow.map(h => matchAlias(h));
  const matchedHeaderCount = mappedHeaders.filter(Boolean).length;
  const isHeaderRow = matchedHeaderCount >= 2 || (matchedHeaderCount >= 1 && firstRow.some(h => /[a-zA-Z]/.test(h) && !/^[0-9a-fA-F]{12}$/.test(h)));

  let startIndex = 1;
  let colMapping = {};

  if (isHeaderRow) {
    // FIX: first matching column wins, don't let later empty cols override it
    mappedHeaders.forEach((field, idx) => {
      if (field && !(field in colMapping)) colMapping[field] = idx;
    });
    startIndex = 1;
  } else {
    startIndex = 0;
    const numCols = Math.max(...parsedRows.slice(0, 5).map(r => r.length));
    const scores = Array.from({ length: numCols }, () => ({
      idPelanggan: 0,
      namaPelanggan: 0,
      interfaceOlt: 0,
      onuId: 0,
      sn: 0,
      pppoeUser: 0,
      pppoePass: 0,
    }));

    const sampleRows = parsedRows.slice(0, 5);
    sampleRows.forEach(row => {
      row.forEach((val, idx) => {
        if (!val || idx >= numCols) return;
        if (/^\d+[\/\-]\d+[\/\-]\d+$/.test(val)) {
          scores[idx].interfaceOlt += 5;
        }
        if (/^[A-Za-z]{4}[A-Za-z0-9]{8,12}$/.test(val) || /^[0-9a-fA-F]{12}$/.test(val)) {
          scores[idx].sn += 5;
        }
        if (/^\d{8,15}$/.test(val)) {
          scores[idx].idPelanggan += 3;
        }
        if (/^\d{1,3}$/.test(val) && parseInt(val, 10) < 256) {
          scores[idx].onuId += 1;
        }
        if (/[A-Za-z]{4,}/.test(val) && !/^[A-Za-z0-9]{12}$/.test(val) && !val.includes('/') && !val.includes('@')) {
          scores[idx].namaPelanggan += 2;
        }
        if (val.includes('@') || /^[a-zA-Z0-9_\-\.]{5,20}$/.test(val)) {
          scores[idx].pppoeUser += 1;
        }
      });
    });

    const fieldPriority = ['interfaceOlt', 'sn', 'idPelanggan', 'namaPelanggan', 'onuId', 'pppoeUser', 'pppoePass'];
    const assignedCols = new Set();

    fieldPriority.forEach(field => {
      let bestCol = -1;
      let bestScore = 0;
      for (let c = 0; c < numCols; c++) {
        if (assignedCols.has(c)) continue;
        if (scores[c][field] > bestScore) {
          bestScore = scores[c][field];
          bestCol = c;
        }
      }
      if (bestCol !== -1 && bestScore > 0) {
        colMapping[field] = bestCol;
        assignedCols.add(bestCol);
      }
    });

    if (!('idPelanggan' in colMapping) && !('namaPelanggan' in colMapping)) {
      const POSITIONAL = ['idPelanggan', 'namaPelanggan', 'pppoeUser', 'pppoePass', 'interfaceOlt', 'onuId', 'sn'];
      POSITIONAL.forEach((field, idx) => {
        if (idx < numCols) colMapping[field] = idx;
      });
    }
  }

  const list = [];
  for (let i = startIndex; i < parsedRows.length; i++) {
    const row = parsedRows[i];
    if (row.length === 0 || row.join('').trim() === '') continue;

    const item = {};
    Object.entries(colMapping).forEach(([field, idx]) => {
      if (row[idx] !== undefined) {
        item[field] = sanitizeValue(field, row[idx]);
      }
    });

    if (isValidCustomerRow(item)) {
      list.push({
        idPelanggan:   item.idPelanggan || '',
        namaPelanggan: item.namaPelanggan || '',
        interfaceOlt:  item.interfaceOlt || '',
        onuId:         item.onuId || '',
        sn:            item.sn || '',
        macAddr:       item.macAddr || '',
        pppoeUser:     item.pppoeUser || item.idPelanggan || '',
        pppoePass:     item.pppoePass || '',
        paket:         normalizePaket(item.paket)
      });
    }
  }
  return list;
}

// Live Search in Database Tab
$('custSearch').addEventListener('input', function() {
  renderCustomerTable(this.value);
});

/* ── AUTOCOMPLETE SEARCH SUGGESTION ───────────────────────── */
function setupAutocomplete(inputEl, dropdownEl, filterField) {
  inputEl.addEventListener('input', function() {
    const q = this.value.trim().toLowerCase();
    dropdownEl.innerHTML = '';
    if (!q) {
      dropdownEl.style.display = 'none';
      return;
    }

    const list = loadCustomers();
    const matches = list.filter(c => (c[filterField] || '').toLowerCase().includes(q)).slice(0, 5);

    if (!matches.length) {
      dropdownEl.style.display = 'none';
      return;
    }

    dropdownEl.style.display = 'block';
    matches.forEach(c => {
      const item = document.createElement('div');
      item.className = 'autocomplete-item';
      item.innerHTML = `
        <div class="autocomplete-item-title">${esc(c.namaPelanggan)}</div>
        <div class="autocomplete-item-sub">ID: ${esc(c.idPelanggan)} &nbsp;·&nbsp; SN: ${esc(c.sn || '—')}</div>
      `;
      item.addEventListener('click', () => {
        EL.interfaceOlt.value = c.interfaceOlt || '';
        EL.onuId.value        = c.onuId || '';
        EL.sn.value           = c.sn || '';
        EL.macAddr.value      = c.macAddr || '';
        EL.idPelanggan.value  = c.idPelanggan || '';
        EL.namaPelanggan.value= c.namaPelanggan || '';
        EL.pppoeUser.value    = c.pppoeUser || '';
        EL.pppoePass.value    = c.pppoePass || '';
        EL.paketLayanan.value = c.paket || 'KUSUMA 1';

        dropdownEl.style.display = 'none';
        renderCmdHub();
        showToast('Data pelanggan terisi otomatis!');
      });
      dropdownEl.appendChild(item);
    });
  });

  // Close suggestions if clicking outside
  document.addEventListener('click', (e) => {
    if (!inputEl.contains(e.target) && !dropdownEl.contains(e.target)) {
      dropdownEl.style.display = 'none';
    }
  });
}

setupAutocomplete(EL.idPelanggan, $('idAcDropdown'), 'idPelanggan');
setupAutocomplete(EL.namaPelanggan, $('nameAcDropdown'), 'namaPelanggan');

async function initializeAppStorage() {
  await migrateStorageData();
  const [points, routes, history, customers] = DEFAULT_DATA_ONLY
    ? [null, [], [], []]
    : await Promise.all([
        readAppData('ftthPoints', null),
        readAppData('ftthRoutes', []),
        readAppData(HISTORY_KEY, []),
        readAppData(DB_KEY, []),
      ]);
  // `points === null` means the key was never saved (first run).
  // If the user cleared all data, `points` will be [] — respect that and do NOT re-inject.
  const isFirstRun = points === null;
  let loadedPoints = Array.isArray(points) ? points : [];

  if (!isFirstRun) {
    // User has managed their own data — skip all hardcoded injection.
    FTTH_POINTS.splice(0, FTTH_POINTS.length, ...loadedPoints);
    if (Array.isArray(routes)) ftthRoutes = routes;
    if (Array.isArray(history)) historyCache = history;
    if (Array.isArray(customers)) customerCache = customers;
    populateOdcOptions();
    populateRouteOptions();
    updateFtthMap(FTTH_POINTS);
    renderFtthRoutes();
    renderFtthTables();
    renderHistory();
    renderCustomerTable();
    await Promise.all([
      writeAppData('ftthPoints', FTTH_POINTS),
      writeAppData('ftthRoutes', ftthRoutes),
      writeAppData(HISTORY_KEY, historyCache),
      writeAppData(DB_KEY, customerCache),
    ]);
    return;
  }

  // ── FIRST RUN: inject default seed data ──────────────────────
  const jsonOdcPoints = [
  {
    "type": "odc",
    "id": "ODC_BJI-01_UAB_F1_1",
    "name": "ODC BJI-01 UAB F1 (1)",
    "olt": "OLT1-BJ_UNB",
    "interface": "1/3/12",
    "splitter": 8,
    "attenuation": -5.26,
    "odp": 9,
    "customers": "45 INDOMARET MASTRIP",
    "description": "",
    "coordinates": "-8.078622, 111.907298"
  },
  {
    "type": "odc",
    "id": "ODC_BJI-01_UAC_F1_6",
    "name": "ODC BJI-01 UAC F1 (6)",
    "olt": "OLT1-BJ_UNB",
    "interface": "1/3/13",
    "splitter": 8,
    "attenuation": -8.98,
    "odp": 7,
    "customers": "37 P4TAN SLTN BIS GOLING",
    "description": "",
    "coordinates": "-8.077084, 111.914103"
  },
  {
    "type": "odc",
    "id": "ODC_BJI-01_UAF_F1_7",
    "name": "ODC BJI-01 UAF F1 (7)",
    "olt": "OLT1-BJ_UNB",
    "interface": "1/3/16",
    "splitter": 8,
    "attenuation": -8.78,
    "odp": 9,
    "customers": "36 P4TAN BIS GOLING",
    "description": "",
    "coordinates": "-8.075564, 111.91424"
  },
  {
    "type": "odc",
    "id": "ODC_BJI-01_UBH_F212",
    "name": "ODC BJI-01 UBH F2(12)",
    "olt": "OLT1-BJ_UNB",
    "interface": "1/5/12",
    "splitter": 8,
    "attenuation": -10.3,
    "odp": 1,
    "customers": "11 odc perempatan 555",
    "description": "",
    "coordinates": "-8.065094, 111.898485"
  },
  {
    "type": "odc",
    "id": "ODC_BJI-01_UI_F3_1",
    "name": "ODC BJI-01 UI F3 (1)",
    "olt": "OLT1-BJ_UNB",
    "interface": "1/2/9",
    "splitter": 8,
    "attenuation": -5.3,
    "odp": 13,
    "customers": "74 P4TAN SD BJ 1",
    "description": "",
    "coordinates": "-8.078753, 111.902792"
  },
  {
    "type": "odc",
    "id": "ODC_BJI-01_UJ_F3_2",
    "name": "ODC BJI-01 UJ F3 (2)",
    "olt": "OLT1-BJ_UNB",
    "interface": "1/2/10",
    "splitter": 8,
    "attenuation": -2.2,
    "odp": 9,
    "customers": "36 GANG RUMAH ABU",
    "description": "",
    "coordinates": "-8.078463, 111.894932"
  },
  {
    "type": "odc",
    "id": "ODC_BJI-01_UK_F3_3",
    "name": "ODC BJI-01 UK F3 (3)",
    "olt": "OLT1-BJ_UNB",
    "interface": "1/2/11",
    "splitter": 8,
    "attenuation": -7.41,
    "odp": 11,
    "customers": "62 P4TAN PASAR BURUNG",
    "description": "",
    "coordinates": "-8.081742, 111.902789"
  },
  {
    "type": "odc",
    "id": "ODC_BJI-01_UL_F3_4",
    "name": "ODC BJI-01 UL F3 (4)",
    "olt": "OLT1-BJ_UNB",
    "interface": "1/2/12",
    "splitter": 8,
    "attenuation": -8.5,
    "odp": 9,
    "customers": "50 P4TAN VETERAN",
    "description": "",
    "coordinates": "-8.081521, 111.896295"
  },
  {
    "type": "odc",
    "id": "ODC_BJI-01_UM_F3_5",
    "name": "ODC BJI-01 UM F3 (5)",
    "olt": "OLT1-BJ_UNB",
    "interface": "1/2/13",
    "splitter": 8,
    "attenuation": -7.5,
    "odp": 4,
    "customers": "23 TIARA ASRI",
    "description": "",
    "coordinates": "-8.083323, 111.889026"
  },
  {
    "type": "odc",
    "id": "ODC_BJI-01_UN_F3_6",
    "name": "ODC BJI-01 UN F3 (6)",
    "olt": "OLT1-BJ_UNB",
    "interface": "1/2/14",
    "splitter": 8,
    "attenuation": -6.21,
    "odp": 7,
    "customers": "30 P4TAN PAJAK",
    "description": "",
    "coordinates": "-8.08855, 111.900806"
  },
  {
    "type": "odc",
    "id": "ODC_BJI-01_UO_F3_7",
    "name": "ODC BJI-01 UO F3 (7)",
    "olt": "OLT1-BJ_UNB",
    "interface": "1/2/15",
    "splitter": 4,
    "attenuation": -14.38,
    "odp": 7,
    "customers": "52 DEPAN POM BEJI",
    "description": "",
    "coordinates": "-8.091425, 111.899956"
  },
  {
    "type": "odc",
    "id": "ODC_BJI-01_UQ_F2_1",
    "name": "ODC BJI-01 UQ F2 (1)",
    "olt": "OLT1-BJ_UNB",
    "interface": "1/3/1",
    "splitter": 8,
    "attenuation": -5.17,
    "odp": 6,
    "customers": "54 P3AN SRI REJEKI",
    "description": "",
    "coordinates": "-8.07685, 111.902508"
  },
  {
    "type": "odc",
    "id": "ODC_BJI-01_UR_F2_2",
    "name": "ODC BJI-01 UR F2 (2)",
    "olt": "OLT1-BJ_UNB",
    "interface": "1/3/2",
    "splitter": 8,
    "attenuation": -6.33,
    "odp": 9,
    "customers": "74 P3AN SLTN TAMANAN",
    "description": "",
    "coordinates": "-8.074296, 111.902112"
  },
  {
    "type": "odc",
    "id": "ODC_BJI-01_US_F2_5",
    "name": "ODC BJI-01 US F2 (5)",
    "olt": "OLT1-BJ_UNB",
    "interface": "1/3/3",
    "splitter": 8,
    "attenuation": -5.5,
    "odp": 12,
    "customers": "111 DEPAN RUKO PIZZA",
    "description": "",
    "coordinates": "-8.071936, 111.901681"
  },
  {
    "type": "odc",
    "id": "ODC_BJI-01_UT_F2_6",
    "name": "ODC BJI-01 UT F2 (6)",
    "olt": "OLT1-BJ_UNB",
    "interface": "1/3/4",
    "splitter": 8,
    "attenuation": -4.6,
    "odp": 8,
    "customers": "47 P4TAN TOP CELL",
    "description": "",
    "coordinates": "-8.06393, 111.902828"
  },
  {
    "type": "odc",
    "id": "ODC_BJI-01_UU_F2_7",
    "name": "ODC BJI-01 UU F2 (7)",
    "olt": "OLT1-BJ_UNB",
    "interface": "1/3/5",
    "splitter": 8,
    "attenuation": -6.45,
    "odp": 1,
    "customers": "4 P4TAN SMP 1",
    "description": "",
    "coordinates": "-8.055979, 111.902258"
  },
  {
    "type": "odc",
    "id": "ODC_BJI-01_UV_F2_8",
    "name": "ODC BJI-01 UV F2 (8)",
    "olt": "OLT1-BJ_UNB",
    "interface": "1/3/6",
    "splitter": 8,
    "attenuation": -6.7,
    "odp": 9,
    "customers": "36 P4TAN KOMINFO",
    "description": "",
    "coordinates": "-8.049299, 111.905587"
  },
  {
    "type": "odc",
    "id": "ODC_BJI-01_UX_F2_10",
    "name": "ODC BJI-01 UX F2 (10)",
    "olt": "OLT1-BJ_UNB",
    "interface": "1/3/8",
    "splitter": 8,
    "attenuation": -9.74,
    "odp": 5,
    "customers": "32 PURI PERMATA",
    "description": "",
    "coordinates": "-8.051476, 111.892198"
  },
  {
    "type": "odc",
    "id": "ODC_BJI-02_UA_F3_1",
    "name": "ODC BJI-02 UA F3 (1)",
    "olt": "OLT1-BJ_UNB",
    "interface": "1/2/1",
    "splitter": 8,
    "attenuation": -6.5,
    "odp": 9,
    "customers": "70 WARKOP INDOPLAY",
    "description": "",
    "coordinates": "-8.07864, 111.90519"
  },
  {
    "type": "odc",
    "id": "ODC_BJI-02_UAA_F2_16_1",
    "name": "ODC BJI-02 UAA F2 (16.1)",
    "olt": "OLT1-BJ_UNB",
    "interface": "1/3/11",
    "splitter": 8,
    "attenuation": -8.8,
    "odp": 4,
    "customers": "5 LETER S WONOREJO",
    "description": "",
    "coordinates": "-8.08564, 111.937984"
  },
  {
    "type": "odc",
    "id": "ODC_BJI-02_UAS_F3_22_8_6",
    "name": "ODC BJI-02 UAS F3 (22.8.6)",
    "olt": "OLT1-BJ_UNB",
    "interface": "1/4/13",
    "splitter": 4,
    "attenuation": -10.44,
    "odp": 6,
    "customers": "24 BALDES JUNJUNG",
    "description": "",
    "coordinates": "-8.114562, 111.925415"
  },
  {
    "type": "odc",
    "id": "ODC_BJI-02_UAS_F3___",
    "name": "ODC BJI-02 UAS F3 //",
    "olt": "OLT1-BJ_UNB",
    "interface": "1/4/13",
    "splitter": 4,
    "attenuation": 0.0,
    "odp": 0,
    "customers": "0 PECAHAN ODC UAS , PEREMPATAN TIMUR SDN JUNJUNG 2",
    "description": "",
    "coordinates": "-8.120969, 111.934425"
  },
  {
    "type": "odc",
    "id": "ODC_BJI-02_UAW_F2_23_5",
    "name": "ODC BJI-02 UAW F2 (23.5)",
    "olt": "OLT1-BJ_UNB",
    "interface": "1/5/1",
    "splitter": 4,
    "attenuation": -7.17,
    "odp": 4,
    "customers": "29 PEREMPATAN PASAR PAGI PASIR",
    "description": "",
    "coordinates": "-8.115468, 111.94192"
  },
  {
    "type": "odc",
    "id": "ODC_BJI-02_UAW_F2___",
    "name": "ODC BJI-02 UAW F2 //",
    "olt": "OLT1-BJ_UNB",
    "interface": "1/5/1",
    "splitter": 4,
    "attenuation": 0.0,
    "odp": 1,
    "customers": "7 PECAHAN ODC UAW , JL. RAYA SAMBIDOPLANG",
    "description": "",
    "coordinates": "-8.144445, 111.962932"
  },
  {
    "type": "odc",
    "id": "ODC_BJI-02_UAX_F2_19_6",
    "name": "ODC BJI-02 UAX F2 (19.6)",
    "olt": "OLT1-BJ_UNB",
    "interface": "1/5/2",
    "splitter": 4,
    "attenuation": -6.62,
    "odp": 6,
    "customers": "9 PERTIGAAN WAJAK KIDUL",
    "description": "",
    "coordinates": "-8.110591, 111.913588"
  },
  {
    "type": "odc",
    "id": "ODC_BJI-02_UB_F3_6_1",
    "name": "ODC BJI-02 UB F3 (6.1)",
    "olt": "OLT1-BJ_UNB",
    "interface": "1/2/2",
    "splitter": 8,
    "attenuation": -5.0,
    "odp": 9,
    "customers": "56 KUBURAN KRAPYAK",
    "description": "",
    "coordinates": "-8.083471, 111.907304"
  },
  {
    "type": "odc",
    "id": "ODC_BJI-02_UBJ_F2_4",
    "name": "ODC BJI-02 UBJ F2 (4)",
    "olt": "OLT1-BJ_UNB",
    "interface": "1/5/14",
    "splitter": 4,
    "attenuation": -10.6,
    "odp": 1,
    "customers": "4 ODC DEPAN PONDOK AL-KHOIRIYAH",
    "description": "",
    "coordinates": "-8.122261, 111.950517"
  },
  {
    "type": "odc",
    "id": "ODC_BJI-02_UBK_F2_2",
    "name": "ODC BJI-02 UBK F2 (2)",
    "olt": "OLT1-BJ_UNB",
    "interface": "1/5/15",
    "splitter": 4,
    "attenuation": -13.1,
    "odp": 5,
    "customers": "9 ODC UTARA TIKUNGAN BETAK",
    "description": "",
    "coordinates": "-8.121722, 111.948376"
  },
  {
    "type": "odc",
    "id": "ODC_BJI-02_UC_F3_8_1",
    "name": "ODC BJI-02 UC F3 (8.1)",
    "olt": "OLT1-BJ_UNB",
    "interface": "1/2/3",
    "splitter": 8,
    "attenuation": -5.0,
    "odp": 7,
    "customers": "21 TOKO COKRO",
    "description": "",
    "coordinates": "-8.085909, 111.907329"
  },
  {
    "type": "odc",
    "id": "ODC_BJI-02_UD_F2_9_4",
    "name": "ODC BJI-02 UD F2 (9.4)",
    "olt": "OLT1-BJ_UNB",
    "interface": "1/2/4",
    "splitter": 4,
    "attenuation": -9.6,
    "odp": 9,
    "customers": "35 GAPURO KEPUH",
    "description": "",
    "coordinates": "-8.090839, 111.907731"
  },
  {
    "type": "odc",
    "id": "ODC_BJI-02_UE_F3_10_5",
    "name": "ODC BJI-02 UE F3 (10.5)",
    "olt": "OLT1-BJ_UNB",
    "interface": "1/2/5",
    "splitter": 8,
    "attenuation": -6.25,
    "odp": 11,
    "customers": "45 SORUM MOBIL",
    "description": "",
    "coordinates": "-8.09322, 111.908089"
  },
  {
    "type": "odc",
    "id": "ODC_BJI-02_UF_F2_11_6",
    "name": "ODC BJI-02 UF F2 (11.6)",
    "olt": "OLT1-BJ_UNB",
    "interface": "1/2/6",
    "splitter": 8,
    "attenuation": -7.75,
    "odp": 9,
    "customers": "60 PASAR WAJAK",
    "description": "",
    "coordinates": "-8.095625, 111.908789"
  },
  {
    "type": "odc",
    "id": "ODC_BJI-02_UG_F2_12_7",
    "name": "ODC BJI-02 UG F2 (12.7)",
    "olt": "OLT1-BJ_UNB",
    "interface": "1/2/7",
    "splitter": 8,
    "attenuation": -8.14,
    "odp": 4,
    "customers": "13 BALDES WAJAK",
    "description": "",
    "coordinates": "-8.102706, 111.912232"
  },
  {
    "type": "odc",
    "id": "ODC_BJI-02_UH_F2_13_8",
    "name": "ODC BJI-02 UH F2 (13.8)",
    "olt": "OLT1-BJ_UNB",
    "interface": "1/2/8",
    "splitter": 8,
    "attenuation": -7.25,
    "odp": 8,
    "customers": "40 TOKO PERTANIAN WJK",
    "description": "",
    "coordinates": "-8.10721, 111.912217"
  },
  {
    "type": "odc",
    "id": "ODC_BJI-02_UY_F2_14_8",
    "name": "ODC BJI-02 UY F2 (14.8)",
    "olt": "OLT1-BJ_UNB",
    "interface": "1/3/9",
    "splitter": 8,
    "attenuation": -5.7,
    "odp": 5,
    "customers": "11 BARAT BALDES TJS",
    "description": "",
    "coordinates": "-8.084983, 111.925994"
  },
  {
    "type": "odc",
    "id": "ODC_BJI-02_UZ_F2_15_9_1",
    "name": "ODC BJI-02 UZ F2 (15.9.1)",
    "olt": "OLT1-BJ_UNB",
    "interface": "1/3/10",
    "splitter": 8,
    "attenuation": -6.7,
    "odp": 8,
    "customers": "28 P3AN MSJID PLK",
    "description": "",
    "coordinates": "-8.083318, 111.925983"
  },
  {
    "type": "odc",
    "id": "ODC_BJI-03_UAD_F1_16_4",
    "name": "ODC BJI-03 UAD F1 (16.4)",
    "olt": "OLT1-BJ_UNB",
    "interface": "1/3/14",
    "splitter": 8,
    "attenuation": -8.87,
    "odp": 11,
    "customers": "32 P4TAN PENGADILAN AGAMA",
    "description": "",
    "coordinates": "-8.063875, 111.872128"
  },
  {
    "type": "odc",
    "id": "ODC_BJI-03_UAE_F2_12",
    "name": "ODC BJI-03 UAE F2 (12)",
    "olt": "OLT1-BJ_UNB",
    "interface": "1/3/15",
    "splitter": 8,
    "attenuation": -7.88,
    "odp": 7,
    "customers": "58 P4TAN SD TINGKAT",
    "description": "",
    "coordinates": "-8.071094, 111.914439"
  },
  {
    "type": "odc",
    "id": "ODC_BJI-03_UAG_F1_24_12",
    "name": "ODC BJI-03 UAG F1 (24.12)",
    "olt": "OLT1-BJ_UNB",
    "interface": "1/4/1",
    "splitter": 8,
    "attenuation": -8.8,
    "odp": 8,
    "customers": "25 PASAR KLIWON",
    "description": "",
    "coordinates": "-8.054903, 111.865892"
  },
  {
    "type": "odc",
    "id": "ODC_BJI-03_UAH_F1_19_7_1",
    "name": "ODC BJI-03 UAH F1 (19.7.1)",
    "olt": "OLT1-BJ_UNB",
    "interface": "1/4/2",
    "splitter": 8,
    "attenuation": -10.4,
    "odp": 8,
    "customers": "59 PEREMPATAN MENCLE BOLO REJO",
    "description": "",
    "coordinates": "-8.049655, 111.857842"
  },
  {
    "type": "odc",
    "id": "ODC_BJI-03_UAI_F1_7_1",
    "name": "ODC BJI-03 UAI F1 (7.1)",
    "olt": "OLT1-BJ_UNB",
    "interface": "1/4/3",
    "splitter": 8,
    "attenuation": -10.53,
    "odp": 5,
    "customers": "16 P4TAN BATANGSAREN",
    "description": "",
    "coordinates": "-8.052835, 111.884691"
  },
  {
    "type": "odc",
    "id": "ODC_BJI-03_UAJ_F2_6_6",
    "name": "ODC BJI-03 UAJ F2 (6.6)",
    "olt": "OLT1-BJ_UNB",
    "interface": "1/4/4",
    "splitter": 8,
    "attenuation": -10.14,
    "odp": 5,
    "customers": "32 P4TAN RADIO JOSS",
    "description": "",
    "coordinates": "-8.058702, 111.916621"
  },
  {
    "type": "odc",
    "id": "ODC_BJI-03_UAK_F2_11",
    "name": "ODC BJI-03 UAK F2 (11)",
    "olt": "OLT1-BJ_UNB",
    "interface": "1/4/5",
    "splitter": 8,
    "attenuation": -8.5,
    "odp": 6,
    "customers": "47 P4TAN KEPATIHAN",
    "description": "",
    "coordinates": "-8.063817, 111.915813"
  },
  {
    "type": "odc",
    "id": "ODC_BJI-03_UAL_F1_6",
    "name": "ODC BJI-03 UAL F1 (6)",
    "olt": "OLT1-BJ_UNB",
    "interface": "1/4/6",
    "splitter": 8,
    "attenuation": -7.13,
    "odp": 5,
    "customers": "27 PURI MAS",
    "description": "",
    "coordinates": "-8.058066, 111.89005"
  },
  {
    "type": "odc",
    "id": "ODC_BJI-03_UAM_F2_1",
    "name": "ODC BJI-03 UAM F2 (1)",
    "olt": "OLT1-BJ_UNB",
    "interface": "1/4/7",
    "splitter": 8,
    "attenuation": -5.5,
    "odp": 2,
    "customers": "6 LDII NOTOK",
    "description": "",
    "coordinates": "-8.081478, 111.918053"
  },
  {
    "type": "odc",
    "id": "ODC_BJI-03_UAN_F2_9",
    "name": "ODC BJI-03 UAN F2 (9)",
    "olt": "OLT1-BJ_UNB",
    "interface": "1/4/8",
    "splitter": 8,
    "attenuation": -9.85,
    "odp": 7,
    "customers": "24 PATUNG POLISI",
    "description": "",
    "coordinates": "-8.051972, 111.913472"
  },
  {
    "type": "odc",
    "id": "ODC_BJI-03_UAO_F2_5",
    "name": "ODC BJI-03 UAO F2 (5)",
    "olt": "OLT1-BJ_UNB",
    "interface": "1/4/9",
    "splitter": 4,
    "attenuation": -5.15,
    "odp": 4,
    "customers": "12 DEPAN IAIN",
    "description": "",
    "coordinates": "-8.079167, 111.928944"
  },
  {
    "type": "odc",
    "id": "ODC_BJI-03_UAP_F2_13_1",
    "name": "ODC BJI-03 UAP F2 (13.1)",
    "olt": "OLT1-BJ_UNB",
    "interface": "1/4/10",
    "splitter": 8,
    "attenuation": -11.4,
    "odp": 3,
    "customers": "4 TIMUR SIROJUT",
    "description": "",
    "coordinates": "-8.077917, 111.937639"
  },
  {
    "type": "odc",
    "id": "ODC_BJI-03_UAQ_F2_15_3",
    "name": "ODC BJI-03 UAQ F2 (15.3)",
    "olt": "OLT1-BJ_UNB",
    "interface": "1/4/11",
    "splitter": 8,
    "attenuation": -7.7,
    "odp": 2,
    "customers": "4 P4TAN LOR SIROJUT",
    "description": "",
    "coordinates": "-8.075117, 111.931608"
  },
  {
    "type": "odc",
    "id": "ODC_BJI-03_UAR_F1_5",
    "name": "ODC BJI-03 UAR F1 (5)",
    "olt": "OLT1-BJ_UNB",
    "interface": "1/4/12",
    "splitter": 8,
    "attenuation": -6.33,
    "odp": 3,
    "customers": "12 TIMUR HSP / SLT MUGIONO",
    "description": "",
    "coordinates": "-8.062937, 111.889621"
  },
  {
    "type": "odc",
    "id": "ODC_BJI-03_UAT_F1_8_11_1",
    "name": "ODC BJI-03 UAT F1 (8.11.1)",
    "olt": "OLT1-BJ_UNB",
    "interface": "1/4/14",
    "splitter": 8,
    "attenuation": -9.0,
    "odp": 4,
    "customers": "10 JEMBATAN GANTUNG",
    "description": "",
    "coordinates": "-8.067192, 111.887249"
  },
  {
    "type": "odc",
    "id": "ODC_BJI-03_UAU_F2_16_4",
    "name": "ODC BJI-03 UAU F2 (16.4)",
    "olt": "OLT1-BJ_UNB",
    "interface": "1/4/15",
    "splitter": 8,
    "attenuation": -8.26,
    "odp": 7,
    "customers": "27 WARKOP BROMBONG",
    "description": "",
    "coordinates": "-8.072248, 111.925749"
  },
  {
    "type": "odc",
    "id": "ODC_BJI-03_UAZ",
    "name": "ODC BJI-03 UAZ",
    "olt": "OLT1-BJ_UNB",
    "interface": "1/5/4",
    "splitter": 8,
    "attenuation": -10.6,
    "odp": 6,
    "customers": "41 PEREMPATAN WARKOP MARKAS BOLO",
    "description": "",
    "coordinates": "-8.053284, 111.863229"
  },
  {
    "type": "odc",
    "id": "ODC_BJI-03_UBA_F1_7_6",
    "name": "ODC BJI-03 UBA F1 (7.6)",
    "olt": "OLT1-BJ_UNB",
    "interface": "1/5/5",
    "splitter": 4,
    "attenuation": -7.7,
    "odp": 2,
    "customers": "14 ODC SRABAH",
    "description": "",
    "coordinates": "-8.04595, 111.8573"
  },
  {
    "type": "odc",
    "id": "ODC_BJI-03_UBB_F1_20_3_8",
    "name": "ODC BJI-03 UBB F1 (20.3.8)",
    "olt": "OLT1-BJ_UNB",
    "interface": "1/5/6",
    "splitter": 8,
    "attenuation": -14.5,
    "odp": 2,
    "customers": "5 BALDES JATIMULYO",
    "description": "",
    "coordinates": "-8.038743, 111.875308"
  },
  {
    "type": "odc",
    "id": "ODC_BJI-03_UBC_F1_4_9_5",
    "name": "ODC BJI-03 UBC F1 (4.9.5)",
    "olt": "OLT1-BJ_UNB",
    "interface": "1/5/7",
    "splitter": 4,
    "attenuation": -11.3,
    "odp": 5,
    "customers": "17 JALUR KATES",
    "description": "",
    "coordinates": "-8.029775, 111.863156"
  },
  {
    "type": "odc",
    "id": "ODC_BJI-03_UBD_F1_10_1_10_6",
    "name": "ODC BJI-03 UBD F1 (10.1.10.6)",
    "olt": "OLT1-BJ_UNB",
    "interface": "1/5/8",
    "splitter": 4,
    "attenuation": -11.9,
    "odp": 4,
    "customers": "3 ODC PERTIGAAN ATAS ANGIN",
    "description": "",
    "coordinates": "-8.026481, 111.870347"
  },
  {
    "type": "odc",
    "id": "ODC_BJI-03_UBE_F1_11_5",
    "name": "ODC BJI-03 UBE F1 (11.5)",
    "olt": "OLT1-BJ_UNB",
    "interface": "1/5/9",
    "splitter": 8,
    "attenuation": -7.2,
    "odp": 1,
    "customers": "2 ODC PERTIGAAN ARAH PERUM MUTIARA ALAM",
    "description": "",
    "coordinates": "-8.075167, 111.880758"
  },
  {
    "type": "odc",
    "id": "ODC_BJI-03_UBF_F1_12_6",
    "name": "ODC BJI-03 UBF F1 (12.6)",
    "olt": "OLT1-BJ_UNB",
    "interface": "1/5/10",
    "splitter": 4,
    "attenuation": -7.21,
    "odp": 1,
    "customers": "4 depan perum permata kota 2",
    "description": "",
    "coordinates": "-8.082911, 111.875747"
  },
  {
    "type": "odc",
    "id": "ODC_BJI-03_UBG_F1_6",
    "name": "ODC BJI-03 UBG F1 (6)",
    "olt": "OLT1-BJ_UNB",
    "interface": "1/5/11",
    "splitter": 4,
    "attenuation": -7.7,
    "odp": 2,
    "customers": "1 ODC GONDANG DEPAN MAKAN",
    "description": "",
    "coordinates": "-8.062897, 111.851358"
  },
  {
    "type": "odc",
    "id": "ODC_BJI-03_UBL_F2_8_2_1_8_",
    "name": "ODC BJI-03 UBL F2 (8.2.1.8 )",
    "olt": "OLT1-BJ_UNB",
    "interface": "1/5/16",
    "splitter": 8,
    "attenuation": -9.09,
    "odp": 1,
    "customers": "9 PERTIGAAN SELATAN GUDANG CEMPAKA",
    "description": "",
    "coordinates": "-8.058957, 111.904565"
  },
  {
    "type": "odc",
    "id": "ODC_BJI-03_UP_F1_17_5",
    "name": "ODC BJI-03 UP F1 (17.5)",
    "olt": "OLT1-BJ_UNB",
    "interface": "1/2/16",
    "splitter": 8,
    "attenuation": -9.16,
    "odp": 4,
    "customers": "14 PERTIGAAN JETAAN",
    "description": "",
    "coordinates": "-8.059997, 111.863972"
  },
  {
    "type": "odc",
    "id": "ODC_BJI-03_UW_F1_13_2",
    "name": "ODC BJI-03 UW F1 (13.2)",
    "olt": "OLT1-BJ_UNB",
    "interface": "1/3/7",
    "splitter": 8,
    "attenuation": -20.6,
    "odp": 5,
    "customers": "28 ODC BARAT JEMBATAN GOR LEMBU PETENG",
    "description": "",
    "coordinates": "-8.070982, 111.884521"
  }
];
  const jsonOdcNames = new Set(jsonOdcPoints.map(p => p.name));
  loadedPoints = loadedPoints.filter(p => p.type !== 'odc' || !jsonOdcNames.has(p.name));
  loadedPoints.push(...jsonOdcPoints);
  FTTH_POINTS.splice(0, FTTH_POINTS.length, ...loadedPoints);

  const staticOdpPoints = [
  {
    "type": "odp",
    "name": "ODP BJI-01 UA 1",
    "odc": "ODC BJI-02 UA F3 (1)",
    "capacity": 8,
    "idle": 4,
    "splitter": "1:8",
    "attenuation": -16.4,
    "coordinates": "-8.077227, 111.905664",
    "customers": 4
  },
  {
    "type": "odp",
    "name": "ODP BJI-01 UA 2",
    "odc": "ODC BJI-02 UA F3 (1)",
    "capacity": 8,
    "idle": 1,
    "splitter": "1:8",
    "attenuation": -16.5,
    "coordinates": "-8.077395, 111.906059",
    "customers": 7
  },
  {
    "type": "odp",
    "name": "ODP BJI-01 UA 3",
    "odc": "ODC BJI-02 UA F3 (1)",
    "capacity": 8,
    "idle": 0,
    "splitter": "1:8",
    "attenuation": -15.6,
    "coordinates": "-8.077884, 111.905587",
    "customers": 8
  },
  {
    "type": "odp",
    "name": "ODP BJI-01 UA 4",
    "odc": "ODC BJI-02 UA F3 (1)",
    "capacity": 8,
    "idle": 3,
    "splitter": "1:8",
    "attenuation": -16.3,
    "coordinates": "-8.078330, 111.905470",
    "customers": 5
  },
  {
    "type": "odp",
    "name": "ODP BJI-01 UA 5",
    "odc": "ODC BJI-02 UA F3 (1)",
    "capacity": 8,
    "idle": 3,
    "splitter": "1:8",
    "attenuation": -16.1,
    "coordinates": "-8.078496, 111.905459",
    "customers": 5
  },
  {
    "type": "odp",
    "name": "ODP BJI-01 UA 6",
    "odc": "ODC BJI-02 UA F3 (1)",
    "capacity": 8,
    "idle": 4,
    "splitter": "1:8",
    "attenuation": -16.8,
    "coordinates": "-8.078516, 111.905665",
    "customers": 4
  },
  {
    "type": "odp",
    "name": "ODP BJI-01 UA 7",
    "odc": "ODC BJI-02 UA F3 (1)",
    "capacity": 8,
    "idle": 5,
    "splitter": "1:8",
    "attenuation": -16.2,
    "coordinates": "-8.078500, 111.905901",
    "customers": 3
  },
  {
    "type": "odp",
    "name": "ODP BJI-01 UB 1",
    "odc": "ODC BJI-02 UA F3 (1)",
    "capacity": 8,
    "idle": 2,
    "splitter": "1:8",
    "attenuation": -15.2,
    "coordinates": "-8.077595, 111.914285",
    "customers": 6
  },
  {
    "type": "odp",
    "name": "ODP BJI-01 UB 2",
    "odc": "ODC BJI-02 UA F3 (1)",
    "capacity": 8,
    "idle": 1,
    "splitter": "1:8",
    "attenuation": -16.0,
    "coordinates": "-8.077353, 111.914275",
    "customers": 7
  },
  {
    "type": "odp",
    "name": "ODP BJI-01 UB 3",
    "odc": "ODC BJI-02 UA F3 (1)",
    "capacity": 8,
    "idle": 3,
    "splitter": "1:8",
    "attenuation": -16.4,
    "coordinates": "-8.077054, 111.914270",
    "customers": 5
  },
  {
    "type": "odp",
    "name": "ODP BJI-01 UB 4",
    "odc": "ODC BJI-02 UA F3 (1)",
    "capacity": 8,
    "idle": 4,
    "splitter": "1:8",
    "attenuation": -16.1,
    "coordinates": "-8.076823, 111.914264",
    "customers": 4
  },
  {
    "type": "odp",
    "name": "ODP BJI-01 UB 5",
    "odc": "ODC BJI-02 UA F3 (1)",
    "capacity": 8,
    "idle": 2,
    "splitter": "1:8",
    "attenuation": -16.9,
    "coordinates": "-8.076596, 111.914259",
    "customers": 6
  }
,
  {
    "type": "odp",
    "name": "ODP BJI-01 UC 1",
    "odc": "ODC BJI-02 UA F3 (1)",
    "capacity": 8,
    "idle": 4,
    "splitter": "1:8",
    "attenuation": -15.9,
    "coordinates": "-8.082006, 111.905470",
    "customers": 4
  },
  {
    "type": "odp",
    "name": "ODP BJI-01 UC 2",
    "odc": "ODC BJI-02 UA F3 (1)",
    "capacity": 8,
    "idle": 3,
    "splitter": "1:8",
    "attenuation": -16.4,
    "coordinates": "-8.082335, 111.905664",
    "customers": 5
  },
  {
    "type": "odp",
    "name": "ODP BJI-01 UC 3",
    "odc": "ODC BJI-02 UA F3 (1)",
    "capacity": 8,
    "idle": 0,
    "splitter": "1:8",
    "attenuation": -17.0,
    "coordinates": "-8.082695, 111.906059",
    "customers": 8
  },
  {
    "type": "odp",
    "name": "ODP BJI-01 UC 4",
    "odc": "ODC BJI-02 UA F3 (1)",
    "capacity": 8,
    "idle": 3,
    "splitter": "1:8",
    "attenuation": -15.8,
    "coordinates": "-8.083050, 111.905587",
    "customers": 5
  },
  {
    "type": "odp",
    "name": "ODP BJI-01 UC 5",
    "odc": "ODC BJI-02 UA F3 (1)",
    "capacity": 8,
    "idle": 2,
    "splitter": "1:8",
    "attenuation": -16.5,
    "coordinates": "-8.083420, 111.905470",
    "customers": 6
  },
  {
    "type": "odp",
    "name": "ODP BJI-01 UC 6",
    "odc": "ODC BJI-02 UA F3 (1)",
    "capacity": 8,
    "idle": 1,
    "splitter": "1:8",
    "attenuation": -16.1,
    "coordinates": "-8.083816, 111.905459",
    "customers": 7
  },
  {
    "type": "odp",
    "name": "ODP BJI-01 UC 7",
    "odc": "ODC BJI-02 UA F3 (1)",
    "capacity": 8,
    "idle": 4,
    "splitter": "1:8",
    "attenuation": -16.7,
    "coordinates": "-8.084155, 111.905665",
    "customers": 4
  },
  {
    "type": "odp",
    "name": "ODP BJI-01 UD 1",
    "odc": "ODC BJI-02 UA F3 (1)",
    "capacity": 8,
    "idle": 2,
    "splitter": "1:8",
    "attenuation": -16.2,
    "coordinates": "-8.077227, 111.905664",
    "customers": 6
  },
  {
    "type": "odp",
    "name": "ODP BJI-01 UD 2",
    "odc": "ODC BJI-02 UA F3 (1)",
    "capacity": 8,
    "idle": 1,
    "splitter": "1:8",
    "attenuation": -16.0,
    "coordinates": "-8.077395, 111.906059",
    "customers": 7
  },
  {
    "type": "odp",
    "name": "ODP BJI-01 UD 3",
    "odc": "ODC BJI-02 UA F3 (1)",
    "capacity": 8,
    "idle": 0,
    "splitter": "1:8",
    "attenuation": -15.6,
    "coordinates": "-8.077884, 111.905587",
    "customers": 8
  },
  {
    "type": "odp",
    "name": "ODP BJI-01 UD 4",
    "odc": "ODC BJI-02 UA F3 (1)",
    "capacity": 8,
    "idle": 2,
    "splitter": "1:8",
    "attenuation": -16.4,
    "coordinates": "-8.078330, 111.905470",
    "customers": 6
  },
  {
    "type": "odp",
    "name": "ODP BJI-01 UD 5",
    "odc": "ODC BJI-02 UA F3 (1)",
    "capacity": 8,
    "idle": 1,
    "splitter": "1:8",
    "attenuation": -15.9,
    "coordinates": "-8.078496, 111.905459",
    "customers": 7
  },
  {
    "type": "odp",
    "name": "ODP BJI-01 UD 6",
    "odc": "ODC BJI-02 UA F3 (1)",
    "capacity": 8,
    "idle": 0,
    "splitter": "1:8",
    "attenuation": -16.1,
    "coordinates": "-8.078516, 111.905665",
    "customers": 8
  },
  {
    "type": "odp",
    "name": "ODP BJI-01 UD 7",
    "odc": "ODC BJI-02 UA F3 (1)",
    "capacity": 8,
    "idle": 3,
    "splitter": "1:8",
    "attenuation": -16.8,
    "coordinates": "-8.078500, 111.905901",
    "customers": 5
  },
  {
    "type": "odp",
    "name": "ODP BJI-01 UE 1",
    "odc": "ODC BJI-02 UA F3 (1)",
    "capacity": 8,
    "idle": 1,
    "splitter": "1:8",
    "attenuation": -15.2,
    "coordinates": "-8.077595, 111.914285",
    "customers": 7
  },
  {
    "type": "odp",
    "name": "ODP BJI-01 UE 2",
    "odc": "ODC BJI-02 UA F3 (1)",
    "capacity": 8,
    "idle": 4,
    "splitter": "1:8",
    "attenuation": -16.0,
    "coordinates": "-8.077353, 111.914275",
    "customers": 4
  },
  {
    "type": "odp",
    "name": "ODP BJI-01 UE 3",
    "odc": "ODC BJI-02 UA F3 (1)",
    "capacity": 8,
    "idle": 2,
    "splitter": "1:8",
    "attenuation": -16.4,
    "coordinates": "-8.077054, 111.914270",
    "customers": 6
  },
  {
    "type": "odp",
    "name": "ODP BJI-01 UE 4",
    "odc": "ODC BJI-02 UA F3 (1)",
    "capacity": 8,
    "idle": 1,
    "splitter": "1:8",
    "attenuation": -16.1,
    "coordinates": "-8.076823, 111.914264",
    "customers": 7
  },
  {
    "type": "odp",
    "name": "ODP BJI-01 UE 5",
    "odc": "ODC BJI-02 UA F3 (1)",
    "capacity": 8,
    "idle": 3,
    "splitter": "1:8",
    "attenuation": -16.9,
    "coordinates": "-8.076596, 111.914259",
    "customers": 5
  },
  {
    "type": "odp",
    "name": "ODP BJI-01 UF 1",
    "odc": "ODC BJI-02 UA F3 (1)",
    "capacity": 8,
    "idle": 2,
    "splitter": "1:8",
    "attenuation": -16.2,
    "coordinates": "-8.076595, 111.914285",
    "customers": 6
  },
  {
    "type": "odp",
    "name": "ODP BJI-01 UF 2",
    "odc": "ODC BJI-02 UA F3 (1)",
    "capacity": 8,
    "idle": 1,
    "splitter": "1:8",
    "attenuation": -16.5,
    "coordinates": "-8.076353, 111.914275",
    "customers": 7
  },
  {
    "type": "odp",
    "name": "ODP BJI-01 UF 3",
    "odc": "ODC BJI-02 UA F3 (1)",
    "capacity": 8,
    "idle": 4,
    "splitter": "1:8",
    "attenuation": -16.1,
    "coordinates": "-8.076054, 111.914270",
    "customers": 4
  },
  {
    "type": "odp",
    "name": "ODP BJI-01 UF 4",
    "odc": "ODC BJI-02 UA F3 (1)",
    "capacity": 8,
    "idle": 2,
    "splitter": "1:8",
    "attenuation": -15.8,
    "coordinates": "-8.075823, 111.914264",
    "customers": 6
  },
  {
    "type": "odp",
    "name": "ODP BJI-01 UF 5",
    "odc": "ODC BJI-02 UA F3 (1)",
    "capacity": 8,
    "idle": 0,
    "splitter": "1:8",
    "attenuation": -16.7,
    "coordinates": "-8.075596, 111.914259",
    "customers": 8
  }
  ];
  staticOdpPoints.forEach(pt => {
    const idx = FTTH_POINTS.findIndex(p => p && p.type === 'odp' && p.name === pt.name);
    if (idx !== -1) FTTH_POINTS[idx] = pt;
    else FTTH_POINTS.push(pt);
  });

  if (EMPTY_DEFAULT_FTTH_NETWORK) {
    for (let index = FTTH_POINTS.length - 1; index >= 0; index--) {
      if (FTTH_POINTS[index].type === 'odp' || FTTH_POINTS[index].type === 'odc') {
        FTTH_POINTS.splice(index, 1);
      }
    }
    ftthRoutes = [];
  }

  // Default network points are trusted reference data and start as valid.
  FTTH_POINTS.forEach(point => {
    if ((point.type === 'odp' || point.type === 'odc') && !point.status) point.status = 'valid';
  });

  // Persist seed data immediately so next load detects storage is set (not first run)
  await writeAppData('ftthPoints', FTTH_POINTS);

  if (Array.isArray(routes)) ftthRoutes = routes;
  if (Array.isArray(history)) historyCache = history;
  if (Array.isArray(customers)) customerCache = customers;
  populateOdcOptions();
  populateRouteOptions();
  updateFtthMap(FTTH_POINTS);
  renderFtthRoutes();
  renderFtthTables();
  renderHistory();
  renderCustomerTable();
}


/* ── INIT ─────────────────────────────────────────────────── */
// Initialize branch view (default UNB)
setBranch('unb');
setWorkflowProgress(1, 0);
renderCmdHub();
renderHistory();
renderCustomerTable();
initializeAppStorage();

