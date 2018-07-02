import { AccountHandler } from './account.handler';
import { PluginState } from './plugin.state';
import { TabHandler } from './tab.handler';

let state = new  PluginState();
let accountHandler = new AccountHandler(state);
let tabHandler = new TabHandler(state);

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (sender.tab)
    return tabHandler.handleMessage(sender.tab, msg, sendResponse);
  else
    return accountHandler.handleMessage(msg, sendResponse);
});

chrome.tabs.onUpdated.addListener((tabId) => {
  chrome.pageAction.show(tabId);
});