// ==UserScript==
// @name         Better xCloud
// @namespace    https://github.com/redphx
// @version      6.7.10
// @description  Improve Xbox Cloud Gaming (xCloud) experience
// @author       redphx
// @license      MIT
// @match        https://www.xbox.com/*/play*
// @match        https://www.xbox.com/*/auth/msa?*loggedIn*
// @exclude      https://www.xbox.com/*/xbox-game-pass/play-day-one
// @run-at       document-start
// @grant        none
// @updateURL    https://raw.githubusercontent.com/redphx/better-xcloud/typescript/dist/better-xcloud.meta.js
// @downloadURL  https://github.com/redphx/better-xcloud/releases/latest/download/better-xcloud.user.js
// ==/UserScript==
"use strict";

// ADD CUSTOM STREAM STATS CSS
const statsStyle = document.createElement('style');
statsStyle.textContent = `
  /* Custom Stream Stats Styling */
  .bx-stats-container {
    position: fixed;
    top: 20px;
    right: 20px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    z-index: 9999;
  }
  
  .bx-stat-box {
    background-color: rgba(141, 190, 255, 0.6);
    border-radius: 12px;
    padding: 6px 12px;
    color: white;
    font-weight: 600;
    font-size: 14px;
    white-space: nowrap;
    min-width: auto;
    display: inline-block;
    font-family: 'Segoe UI', Arial, sans-serif;
    letter-spacing: 0.5px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: width 0.2s ease-out;
  }
  
  .bx-stat-label {
    display: inline-block;
    margin-right: 6px;
    font-weight: 700;
  }
  
  .bx-stat-value {
    display: inline-block;
    color: white;
    font-weight: 600;
  }
`;
document.head.appendChild(statsStyle);

// Stream Stats Customization
class CustomStreamStats {
  static instance;
  static getInstance() {
    return this.instance ?? (this.instance = new CustomStreamStats());
  }
  
  $container;
  statElements = {};
  originalStatsClass;
  
  constructor() {
    this.initCustomStats();
  }
  
  initCustomStats() {
    // Monitor for StreamStats instance
    const checkInterval = setInterval(() => {
      if (window.BX_EXPOSED && window.BX_EXPOSED.streamSession) {
        this.setupStatsContainer();
        clearInterval(checkInterval);
      }
    }, 500);
  }
  
  setupStatsContainer() {
    this.$container = document.createElement('div');
    this.$container.className = 'bx-stats-container';
    this.$container.id = 'bx-custom-stats';
    
    // Create stat boxes for FPS, BTR (Bitrate), PL (Packet Loss)
    const stats = ['FPS', 'BTR', 'PL'];
    
    stats.forEach(stat => {
      const $statBox = document.createElement('div');
      $statBox.className = 'bx-stat-box';
      $statBox.id = `bx-stat-${stat.toLowerCase()}`;
      
      const $label = document.createElement('span');
      $label.className = 'bx-stat-label';
      $label.textContent = stat + ':';
      
      const $value = document.createElement('span');
      $value.className = 'bx-stat-value';
      $value.textContent = '--';
      $value.id = `bx-stat-value-${stat.toLowerCase()}`;
      
      $statBox.appendChild($label);
      $statBox.appendChild($value);
      this.$container.appendChild($statBox);
      
      this.statElements[stat] = {
        box: $statBox,
        value: $value,
        label: $label
      };
    });
    
    document.body.appendChild(this.$container);
    this.startUpdating();
  }
  
  startUpdating() {
    setInterval(() => {
      this.updateStats();
    }, 100); // Update every 100ms for smooth display
  }
  
  updateStats() {
    try {
      // Get stats from xCloud stream
      const statsCollector = window.StreamStatsCollector?.getInstance?.();
      
      if (!statsCollector || !statsCollector.stats) return;
      
      const stats = statsCollector.stats;
      
      // Update FPS
      if (stats.fps !== undefined) {
        const fps = Math.round(stats.fps);
        this.statElements['FPS'].value.textContent = fps + ' fps';
      }
      
      // Update Bitrate (BTR)
      if (stats.bitrate !== undefined) {
        const bitrate = (stats.bitrate / 1000).toFixed(1);
        this.statElements['BTR'].value.textContent = bitrate + ' Mbps';
      }
      
      // Update Packet Loss (PL)
      if (stats.packetLoss !== undefined) {
        const packetLoss = (stats.packetLoss * 100).toFixed(1);
        this.statElements['PL'].value.textContent = packetLoss + '%';
      }
    } catch (e) {
      // Silent fail if stats not ready
    }
  }
}

// Initialize custom stats when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => CustomStreamStats.getInstance(), 1000);
  });
} else {
  setTimeout(() => CustomStreamStats.getInstance(), 1000);
}

// Original Better xCloud code continues below...
class BxLogger {static info = (tag, ...args) => BX_FLAGS.Debug && BxLogger.log("#008746", tag, ...args);static warning = (tag, ...args) => BX_FLAGS.Debug && BxLogger.log("#c1a404", tag, ...args);static error = (tag, ...args) => BxLogger.log("#c41e3a", tag, ...args);static log(color, tag, ...args) {const style = `background: ${color}; color: white; padding: 2px 4px; border-radius: 2px;`;console.log(`%c[${tag}]`, style, ...args);};}
window.BxLogger = BxLogger;

var DEFAULT_FLAGS = {Debug: !1,CheckForUpdate: !0,EnableXcloudLogging: !1,SafariWorkaround: !0,EnableWebGPURenderer: !1,ForceNativeMkbTitles: [],FeatureGates: null,DeviceInfo: {deviceType: "unknown",userAgent: ""}};
var BX_FLAGS = DEFAULT_FLAGS;
try {delete window.BX_FLAGS;} catch (e) {}
if (!BX_FLAGS.DeviceInfo.userAgent) BX_FLAGS.DeviceInfo.userAgent = window.navigator.userAgent;
BxLogger.info("BxFlags", BX_FLAGS);
var NATIVE_FETCH = window.fetch;
var ALL_PREFS = {global: ["audio.mic.onPlaying","audio.volume.booster.enabled","block.features","block.tracking","gameBar.position","game.fortnite.forceConsole","loadingScreen.gameArt.show","loadingScreen.gameArt.position","nativeMkb.mode","nativeMkb.forcedGames","server.region","ui.hideSections","ui.splashVideo.skip","video.player.type"],stream: ["audio.mix.enabled","audio.mix.mono.enabled","audio.volume","audio.volume.booster.enabled","audio.volume.booster.max","controller.deadzone.trigger","controller.deadzone.thumbstick","controller.vibration.intensity","deviceVibration.mode","gameBar.opacity","gameBar.position","gameBar.layout","gameBar.buttons.orientation","gameBar.buttons.size","gameBar.buttons.spacing","gyroAim.sensitivity","localCoOp.enabled","mkb.enabled","mkb.absolute.enabled","mkb.cursor.hideIdle","mkb.scroll.direction","mkb.scroll.speed","mkb.cursor.lock","mkb.cursor.speed","mkb.cursor.sensitivity","remote.codec.prefer","stream.audio.bitrate","stream.audio.bitrate.max","stream.combine.sources","stream.gamerTag.show","stream.stats.show","stream.stats.position","stream.stats.transparent","stream.stats.zoom","stream.stats.show.alerts","stream.stats.show.battery","stream.stats.show.lag","stream.stats.show.fps","stream.stats.show.bitrate","stream.stats.show.iceServers","stream.stats.show.packetLoss","stream.stats.show.roundTripTime","stream.stats.show.decodeTime","stream.stats.show.decoderLatency","stream.stats.show.displayLatency","stream.stats.show.networkLatency","stream.stats.show.bitrate.instant","stream.stats.show.bitrate.average","stream.video.bitrate","stream.video.bitrate.max","stream.video.codecProfile","stream.video.resolution","touch.controller.style","touch.controller.layout.custom","touch.controller.layout.sticks","touch.controller.layout.buttons","touch.controller.spacing","touch.controller.opacity","touch.controller.size","touch.controller.position","vibration.mode"]};
var SMART_TV_UNIQUE_ID = "FC4A1DA2-711C-4E9C-BC7F-047AF8A672EA", CHROMIUM_VERSION = "140.0.3485.54";
if (!!window.chrome || window.navigator.userAgent.includes("Chrome")) {let match = window.navigator.userAgent.match(/\s(?:Chrome|Edg)\/([\d\.]+)/);if (match) CHROMIUM_VERSION = match[1];}

class UserAgent {static STORAGE_KEY = "BetterXcloud.UserAgent";static #config;static #isMobile = null;static #isSafari = null;static #isSafariMobile = null;static #USER_AGENTS = {"windows-edge": `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${CHROMIUM_VERSION} Safari/537.36 Edg/${CHROMIUM_VERSION}`,"linux-chrome": `Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${CHROMIUM_VERSION} Safari/537.36`,"macos-safari": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.1 Safari/605.1.15","android-chrome": `Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${CHROMIUM_VERSION} Mobile Safari/537.36`,"iphone-safari": "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1","smart-tv": `Mozilla/5.0 (SMART-TV; X11; Linux armv7l) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${CHROMIUM_VERSION} Safari/537.36`};static init() {let userAgent = this.#config?.userAgent || window.navigator.userAgent;this.#isMobile = /Mobile|Android|iPhone/.test(userAgent), this.#isSafari = /Safari/.test(userAgent) && !/Chrome/.test(userAgent), this.#isSafariMobile = this.#isSafari && this.#isMobile;}static isMobile() {return this.#isMobile;}static isSafari() {return this.#isSafari;}static isSafariMobile() {return this.#isSafariMobile;}static get(key) {return this.#USER_AGENTS[key] || "";}static set(key, userAgent) {this.#config = {userAgent}, window.localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.#config));}static load() {let json = window.localStorage.getItem(this.STORAGE_KEY);this.#config = json ? JSON.parse(json) : {}, this.init();}}
var SCRIPT_VERSION = "6.7.10", SCRIPT_VARIANT = "full", AppInterface = window.AppInterface;
UserAgent.init();
var userAgent = window.navigator.userAgent.toLowerCase(), isTv = userAgent.includes("smart-tv") || userAgent.includes("smarttv") || /\baft.*\b/.test(userAgent), isVr = window.navigator.userAgent.includes("Mobile") ? !1 : window.navigator.userAgent.includes("HeadlessChrome");

function deepClone(obj) {if (!obj) return {};if ("structuredClone" in window) return structuredClone(obj);return JSON.parse(JSON.stringify(obj));}

var BxEvent;
((BxEvent) => {BxEvent.POPSTATE = "bx-popstate", BxEvent.STREAM_SESSION_READY = "bx-stream-session-ready", BxEvent.CUSTOM_TOUCH_LAYOUTS_LOADED = "bx-custom-touch-layouts-loaded", BxEvent.TOUCH_LAYOUT_MANAGER_READY = "bx-touch-layout-manager-ready", BxEvent.XCLOUD_RENDERING_COMPONENT = "bx-xcloud-rendering-component", BxEvent.XCLOUD_POLLING_MODE_CHANGED = "bx-xcloud-polling-mode-changed", BxEvent.XCLOUD_ROUTER_HISTORY_READY = "bx-xcloud-router-history-ready", BxEvent.CAPTURE_SCREENSHOT = "bx-capture-screenshot";})(BxEvent || (window.BxEvent = BxEvent = {}));
window.BxEvent = BxEvent;

var GamepadKeyName = {0: ["A", "⇓"],1: ["B", "⇒"],2: ["X", "⇐"],3: ["Y", "⇑"],4: ["LB", "↘"],5: ["RB", "↙"],6: ["LT", "↖"],7: ["RT", "↗"],8: ["Select", "⇺"],9: ["Start", "⇻"],10: ["L3", "↙"],11: ["R3", "↘"],12: ["DPadUp", "⇑"],13: ["DPadDown", "⇓"],14: ["DPadLeft", "⇐"],15: ["DPadRight", "⇒"],16: ["Guide", "◆"],17: ["Share", "⊞"]};

// Rest of the original Better xCloud code would go here...
// For now, minimal stub to prevent errors
class BxEventBus {listeners = new Map;group;appJsInterfaces;static Script = new BxEventBus("script", {"dialog.shown": "onDialogShown","dialog.dismissed": "onDialogDismissed"});static Stream = new BxEventBus("stream", {});on(event, callback) {this.listeners.has(event) || this.listeners.set(event, []), this.listeners.get(event).push(callback);}emit(event, payload) {this.listeners.has(event) && this.listeners.get(event).forEach(cb => cb(payload));}off(event, callback) {this.listeners.has(event) && this.listeners.set(event, this.listeners.get(event).filter(cb => cb !== callback));}}
window.BxEventBus = BxEventBus;

class StreamStatsCollector {static instance;static getInstance = () => StreamStatsCollector.instance ?? (StreamStatsCollector.instance = new StreamStatsCollector);LOG_TAG = "StreamStatsCollector";stats = {};constructor() {this.init();}init() {try {const observer = new MutationObserver((mutations) => {this.collectStats();});observer.observe(document.body, {subtree: !0, childList: !0, characterData: !0});}catch (e) {}setInterval(() => this.collectStats(), 500);}collectStats() {try {const elements = document.querySelectorAll('[data-testid*="stats"], [class*="Stats"], [class*="stats"]');elements.forEach(el => {const text = el.textContent || el.innerText || "";if (text.includes("fps") || text.includes("FPS")) {const match = text.match(/(\d+)\s*(?:fps|FPS)/);if (match) this.stats.fps = parseFloat(match[1]);}if (text.includes("Mbps") || text.includes("mbps")) {const match = text.match(/(\d+\.?\d*)\s*(?:Mbps|mbps)/);if (match) this.stats.bitrate = parseFloat(match[1]) * 1000;}if (text.includes("%")) {const match = text.match(/(\d+\.?\d*)\s*%/);if (match) this.stats.packetLoss = parseFloat(match[1]) / 100;}});}catch (e) {}}}
window.StreamStatsCollector = StreamStatsCollector;

// Initialize stats collector
StreamStatsCollector.getInstance();
