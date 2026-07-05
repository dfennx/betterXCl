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

// CUSTOM STREAM STATS - JS ONLY (Safari Compatible, No CSS)
(function() {
  function customizeStreamStats() {
    const checkInterval = setInterval(() => {
      // Find stats display containers
      const allElements = document.querySelectorAll('*');
      let modified = false;
      
      allElements.forEach(el => {
        if (!el.textContent) return;
        
        const text = el.textContent.toLowerCase();
        const children = el.children;
        
        // Check if this looks like a stats container
        if ((text.includes('fps') || text.includes('mbps') || text.includes('packet')) && children.length > 0) {
          Array.from(children).forEach(child => {
            const childText = (child.textContent || '').toLowerCase();
            
            // Keep FPS, BTR/Bitrate, PL/Packet Loss - Style them
            if (childText.includes('fps') || childText.includes('mbps') || childText.includes('bitrate') || childText.includes('packet') || childText.includes('loss')) {
              applyStyle(child);
              modified = true;
            }
            // Delete everything else
            else if (childText.length > 0 && child.offsetHeight > 0) {
              try {
                child.style.display = 'none';
              } catch (e) {}
            }
          });
        }
      });
      
      if (modified) {
        clearInterval(checkInterval);
      }
    }, 300);
    
    setTimeout(() => clearInterval(checkInterval), 15000);
  }
  
  function applyStyle(el) {
    // Background: #8dbeff with 60% opacity
    el.style.backgroundColor = 'rgba(141, 190, 255, 0.6)';
    
    // Text: White, opaque
    el.style.color = 'white';
    el.style.opacity = '1';
    
    // Rounded corners
    el.style.borderRadius = '12px';
    
    // Padding
    el.style.padding = '6px 12px';
    el.style.margin = '4px';
    
    // Font
    el.style.fontWeight = '600';
    el.style.fontSize = '14px';
    
    // Display
    el.style.display = 'inline-block';
    el.style.whiteSpace = 'nowrap';
    
    // Shadow
    el.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
    
    // Position parent if needed
    const parent = el.parentElement;
    if (parent && parent.style.position !== 'fixed') {
      parent.style.position = 'fixed';
      parent.style.top = '20px';
      parent.style.right = '20px';
      parent.style.zIndex = '9999';
      parent.style.display = 'flex';
      parent.style.flexDirection = 'column';
      parent.style.gap = '8px';
    }
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(customizeStreamStats, 500);
    });
  } else {
    setTimeout(customizeStreamStats, 500);
  }
  
  setTimeout(customizeStreamStats, 2000);
})();

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
class BxEventBus {listeners = new Map;group;appJsInterfaces;static Script = new BxEventBus("script", {"dialog.shown": "onDialogShown","dialog.dismissed": "onDialogDismissed"});static Stream = new BxEventBus("stream", {});on(event, callback) {this.listeners.has(event) || this.listeners.set(event, []), this.listeners.get(event).push(callback);}emit(event, payload) {this.listeners.has(event) && this.listeners.get(event).forEach(cb => cb(payload));}off(event, callback) {this.listeners.has(event) && this.listeners.set(event, this.listeners.get(event).filter(cb => cb !== callback));}}
window.BxEventBus = BxEventBus;
