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
 sn-bind enable sn
 tcont 1 name PPPOE profile kusuma
 gemport 1 name PPPOE tcont 1
 service-port 1 vport 1 user-vlan 100 vlan 100
exit
pon-onu-mng gpon-onu_${v.IF}:${v.OID}
 service ServiceName gemport 1 vlan 100
 wan-ip 1 mode pppoe username ${v.PU} password ${v.PP} vlan-profile pppoe host 1
 wan-ip 1 ping-response enable traceroute-response enable
 security-mgmt 212 state enable mode forward protocol web
exit
exit
write`,

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

  v511: (v) =>
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
 wan-ip 1 mode pppoe username ${v.PU} password ${v.PP} vlan-profile vlan511 host 1
 wan-ip 1 ping-response enable traceroute-response enable
 security-mgmt 212 state enable mode forward protocol web
exit
exit
write`,

  bridge: (v) =>
`conf t
interface gpon_olt-${v.IF}
 onu ${v.OID} type ALL sn ${v.SN}
exit
interface gpon_onu-${v.IF}:${v.OID}
 name ${v.IDP}
 description ${v.IDP} - ${v.NMP}
 sn-bind enable sn
 tcont 1 profile kusuma
 gemport 1 tcont 1
 gemport 2 tcont 1
 service-port 1 vport 1 user-vlan 105 vlan 105
 service-port 2 vport 2 user-vlan 102 vlan 102
exit
pon-onu-mng gpon_onu-${v.IF}:${v.OID}
 service 105 gemport 1 vlan 105
 service pppoe gemport 2 vlan 102
 vlan port eth_0/1 mode tag vlan 105
 vlan port eth_0/2 mode tag vlan 105
 vlan port eth_0/3 mode tag vlan 105
 vlan port eth_0/4 mode tag vlan 105
 wan-ip mode pppoe username ${v.PU} password ${v.PP} vlan-profile pppoe_vlan102 host 1
 security-mgmt 1 state enable mode forward protocol web
exit
exit
write`,

  bridge_bolo: (v) =>
`conf t
interface gpon_olt-${v.IF}
 onu ${v.OID} type ALL sn ${v.SN}
exit
interface gpon_onu-${v.IF}:${v.OID}
 name ${v.IDP}
 description ${v.IDP} - ${v.NMP}
 sn-bind enable sn
 tcont 1 profile kusuma
 gemport 1 tcont 1
 gemport 2 tcont 1
 service-port 1 vport 1 user-vlan 1500 vlan 1500
 service-port 2 vport 2 user-vlan 1501 vlan 1501
exit
pon-onu-mng gpon_onu-${v.IF}:${v.OID}
 service 1500 gemport 1 vlan 1500
 service pppoe gemport 2 vlan 1501
 vlan port eth_0/1 mode hybrid def-vlan 1500
 vlan port eth_0/2 mode hybrid def-vlan 1500
 vlan port eth_0/3 mode hybrid def-vlan 1500
 wan-ip mode pppoe username ${v.PU} password ${v.PP} vlan-profile bolo host 1
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
    { label: 'CEK STATUS / KEADAAN ONT',
      fn: v => `show gpon onu state gpon-olt_${v.IF}` },
    { label: 'CEK DETAIL STATUS PELANGGAN',
      fn: v => `show gpon onu detail-info gpon-onu_${v.IF}:${v.OID}` },
    { label: 'CEK INTERFACE PELANGGAN',
      fn: v => `show run interface gpon-onu_${v.IF}:${v.OID}` },
    { label: 'CEK WAN / RUNNING CONFIG ONU',
      fn: v => `show onu running config gpon-onu_${v.IF}:${v.OID}` },
    { label: 'CEK IP WAN ONU',
      fn: v => `show gpon remote-onu wan-ip gpon-onu_${v.IF}:${v.OID}` },
    { label: 'CEK TIPE & VERSI FIRMWARE ONT',
      fn: v => `show gpon onu version gpon-onu_${v.IF}:${v.OID}` },
  ]},

  /* ── 2. KUALITAS SINYAL OPTIK ──────────────────────────── */
  { group: '2 · KUALITAS SINYAL OPTIK', items: [
    { label: 'CEK REDAMAN SELURUH ONU 1 PORT',
      fn: v => `show pon power onu-rx gpon-olt_${v.IF}` },
    { label: 'CEK REDAMAN PELANGGAN (Rx & Tx)',
      fn: v => `show pon power attenuation gpon-onu_${v.IF}:${v.OID}` },
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
    { label: 'CEK MAC ADDRESS DI PORT ONU',
      fn: v => `show mac gpon-onu_${v.IF}:${v.OID}` },
    { label: 'CEK TRAFFIC REALTIME & STATISTIK ERROR',
      fn: v => `show interface gpon-onu_${v.IF}:${v.OID}` },
    { label: 'CARI SESSION AKTIF DI MIKROTIK (WINBOX)',
      fn: v => `/ppp active print detail where name="${v.PU}"` },
  ]},

  /* ── 4. PROVISIONING & MIGRASI ─────────────────────────── */
  { group: '4 · PROVISIONING & MIGRASI', items: [
    { label: 'GANTI / SWAP SN ONT',
      fn: v => `configure terminal\ninterface gpon-onu_${v.IF}:${v.OID}\nregistration-method sn ${v.SN}\nexit` },
    { label: 'HAPUS ONU DARI OLT',
      fn: v => `configure terminal\ninterface gpon-olt_${v.IF}\nno onu ${v.OID}\nexit` },
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
};

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

/* ── HISTORY (localStorage, max 10) ──────────────────────── */
const HISTORY_KEY = 'unbScriptHistory';

function loadHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY)) || []; }
  catch { return []; }
}

function saveHistory(list) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(list));
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

  renderCmdHub();
  showToast('Script berhasil di-generate!');
}

/* ── COPY BUTTON HANDLERS ─────────────────────────────────── */
$('copyOlt').addEventListener('click', function () {
  const txt = EL.outputOlt.textContent;
  if (txt.startsWith('//')) { showToast('Generate script terlebih dahulu!'); return; }
  copyToClipboard(txt, this);
});

$('copyMkt').addEventListener('click', function () {
  const txt = EL.outputMkt.textContent;
  if (txt.startsWith('//')) { showToast('Generate script terlebih dahulu!'); return; }
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
  const txt = EL.outputOlt.textContent;
  if (txt.startsWith('//')) { showToast('Generate script terlebih dahulu!'); return; }
  const v = getVars();
  downloadTxt(txt, `OLT_${v.IDP || 'script'}_${v.IF || 'port'}.txt`);
  showToast('Script OLT berhasil diunduh!');
});

$('exportMkt').addEventListener('click', () => {
  const txt = EL.outputMkt.textContent;
  if (txt.startsWith('//')) { showToast('Generate script terlebih dahulu!'); return; }
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

/* ── RESET FORM ───────────────────────────────────────────── */
$('btnReset').addEventListener('click', () => {
  ['interfaceOlt','onuId','sn','macAddr','idPelanggan',
   'namaPelanggan','pppoeUser','pppoePass'].forEach(id => $(id).value = '');
  EL.configType.value    = 'v100';
  EL.paketLayanan.value  = 'KUSUMA 1';
  EL.outputOlt.innerHTML = '<span class="script-placeholder">// Isi form dan klik "Generate Script" untuk menampilkan script OLT ZTE...</span>';
  EL.outputMkt.innerHTML = '<span class="script-placeholder">// Script Mikrotik PPPoE Secret akan muncul di sini...</span>';
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
  unb:   $('panelUnb'),
  ftth:  $('panelFtth'),
  tools: $('panelTools'),
};

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
  });
});

/* ── MODAL: QUICK FILL ────────────────────────────────────── */
function openModal() {
  EL.pasteOnu.value     = '';
  EL.pasteKoneksi.value = '';
  setTab('onu');
  EL.qfModal.style.display = 'flex';
}
function closeModal() {
  EL.qfModal.style.display = 'none';
}
function setTab(tab) {
  const isOnu = tab === 'onu';
  EL.tabOnu.classList.toggle('active', isOnu);
  EL.tabKoneksi.classList.toggle('active', !isOnu);
  EL.panelOnu.style.display      = isOnu ? 'block' : 'none';
  EL.panelKoneksi.style.display  = isOnu ? 'none'  : 'block';
}

$('btnQuickFill').addEventListener('click', openModal);
EL.qfClose.addEventListener('click',  closeModal);
EL.qfCancel.addEventListener('click', closeModal);
EL.qfModal.addEventListener('click', (e) => { if (e.target === EL.qfModal) closeModal(); });
EL.tabOnu.addEventListener('click',      () => setTab('onu'));
EL.tabKoneksi.addEventListener('click',  () => setTab('koneksi'));

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
  '511':  'v511',
  '105':  'bridge',
  '1500': 'bridge_bolo',
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

/* ── MODAL SUBMIT ─────────────────────────────────────────── */
EL.qfSubmit.addEventListener('click', () => {
  const isOnu   = EL.tabOnu.classList.contains('active');
  const rawText = (isOnu ? EL.pasteOnu.value : EL.pasteKoneksi.value).trim();

  if (!rawText) { showToast('Teks belum di-paste!'); return; }

  const data   = isOnu ? parseOnuText(rawText) : parseKoneksiText(rawText);
  let   filled = 0;

  const setField = (el, val) => { if (val) { el.value = val; filled++; } };

  setField(EL.interfaceOlt,  data.interfaceOlt);
  setField(EL.onuId,         data.onuId);
  setField(EL.sn,            data.sn);

  if (data.idPelanggan) {
    EL.idPelanggan.value = data.idPelanggan;
    EL.pppoeUser.value   = data.idPelanggan; // sync PPPoE User
    filled++;
  }

  setField(EL.namaPelanggan, data.namaPelanggan);
  // jika koneksi tab punya pppoeUser sendiri, pakai itu
  if (data.pppoeUser) { EL.pppoeUser.value = data.pppoeUser; filled++; }
  setField(EL.pppoePass, data.pppoePass);

  // Auto-set tipe konfigurasi jika terdeteksi dari VLAN
  if (data.configType) {
    EL.configType.value = data.configType;
    filled++;
  }

  renderCmdHub();
  closeModal();

  showToast(filled ? `${filled} field berhasil diisi otomatis!` : 'Data tidak dikenali — periksa format teks.');
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
  const txt = $('mktScriptOutput').textContent;
  if (!txt) { showToast('Generate script terlebih dahulu!'); return; }
  copyToClipboard(txt, this);
});

/* ── INIT ─────────────────────────────────────────────────── */
renderCmdHub();
renderHistory();
