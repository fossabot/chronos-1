export interface Tab {
  /** The ID of the tab. Tab IDs are unique within a browser session. */
  id?: number;
  /** The zero-based index of the tab within its window. */
  index: number;
  /** The ID of the window the tab is contained within. */
  windowId?: number;
  /**
   * The ID of the tab that opened this tab, if any. This property is only
   * present if the opener tab still exists.
   */
  openerTabId?: number;
  /** Whether the tab is highlighted. Works as an alias of active */
  highlighted: boolean;
  /**
   * Whether the tab is active in its window. (Does not necessarily mean the
   * window is focused.)
   */
  active: boolean;
  /** Whether the tab is pinned. */
  pinned: boolean;
  /**
   * The last time the tab was accessed as the number of milliseconds since
   * epoch.
   */
  lastAccessed?: number;
  /**
   * The URL the tab is displaying. This property is only present if the
   * extension's manifest includes the `"tabs"` permission.
   */
  url?: string;
  /**
   * The title of the tab. This property is only present if the extension's
   * manifest includes the `"tabs"` permission.
   */
  title?: string;
  /**
   * The URL of the tab's favicon. This property is only present if the
   * extension's manifest includes the `"tabs"` permission. It may also be an
   * empty string if the tab is loading.
   */
  favIconUrl?: string;
  /** Either _loading_ or _complete_. */
  status?: string;
  /** The ID of this tab's successor, if any; `TAB_ID_NONE` otherwise. */
  successorTabId?: number;
}

export interface TabActiveInfo {
  /** The ID of the tab that has become active. */
  tabId: number;
  /** The ID of the window the active tab changed inside of. */
  windowId: number;
}

export interface TabRemoveInfo {
  /** The window whose tab is closed. */
  windowId: number;
  /** True when the tab is being closed because its window is being closed. */
  isWindowClosing: boolean;
}

export interface TabChangeInfo {
  /** Optional. The status of the tab. Can be either loading or complete. */
  status?: string;
  /** Optional. The tab's URL if it has changed. */
  url?: string;
  /** The tab's new discarded state. */
  discarded?: boolean;
  /** The tab's new favicon URL. */
  favIconUrl?: string;
  /** The tab's new title. */
  title?: string;
}

/**
 * An object which allows the addition and removal of listeners for a tab event.
 */
export interface TabEvent<T extends Function> {
  /**
   * Registers an event listener callback to an event.
   * @param callback Called when an event occurs. The parameters of this
   * function depend on the type of event. The callback parameter should be a
   * function that looks like this: `function() {...};`
   */
  addListener(callback: T): void;
  /**
   * Deregisters an event listener callback from an event.
   * @param callback Listener that shall be unregistered. The callback parameter
   * should be a function that looks like this: `function() {...};`
   */
  removeListener(callback: T): void;
}

export type TabActivatedEventCallback = (activeInfo: TabActiveInfo) => void;

export type TabActivatedEvent = TabEvent<TabActivatedEventCallback>;

export type TabRemovedEventCallback = (
  tabId: number,
  removeInfo: TabRemoveInfo
) => void;

export type TabRemovedEvent = TabEvent<TabRemovedEventCallback>;

export type TabUpdatedEventCallback = (
  tabId: number,
  changeInfo: TabChangeInfo,
  tab: Tab
) => void;

export type TabUpdatedEvent = TabEvent<TabUpdatedEventCallback>;

/** Service for interacting with browser tabs */
export interface TabsService {
  /** Retrieves details about the specified browser tab. */
  get(tabId: number): Promise<Tab>;

  /**
   * Fires when the active tab in a window changes. Note that the tab's URL may
   * not be set at the time this event fired, but you can listen to onUpdated
   * events to be notified when a URL is set.
   */
  onActivated: TabActivatedEvent;
  /** Fired when a tab is closed. */
  onRemoved: TabRemovedEvent;
  /** Fired when a tab is updated. */
  onUpdated: TabUpdatedEvent;
}

/** An object implementing a subset of Chrome Extension Tabs API */
export interface ChromeTabsAPI {
  /** Retrieves details about the specified tab. */
  get(tabId: number, callback: (tab: chrome.tabs.Tab) => void): void;

  /**
   * Fires when the active tab in a window changes. Note that the tab's URL may
   * not be set at the time this event fired, but you can listen to onUpdated
   * events to be notified when a URL is set.
   * @since Chrome 18.
   */
  onActivated: chrome.tabs.TabActivatedEvent;
  /** Fired when a tab is closed. */
  onRemoved: chrome.tabs.TabRemovedEvent;
  /** Fired when a tab is updated. */
  onUpdated: chrome.tabs.TabUpdatedEvent;
}

/** An object implementing a subset of Web Extensions Tabs API (Firefox) */
export interface FirefoxTabsAPI {
  /** Retrieves details about the specified tab. */
  get(tabId: number): Promise<browser.tabs.Tab>;

  /**
   * Fires when the active tab in a window changes. Note that the tab's URL may
   * not be set at the time this event fired, but you can listen to onUpdated
   * events to be notified when a URL is set.
   */
  onActivated: WebExtEvent<
    (activeInfo: {
      /** The ID of the tab that has become active. */
      tabId: number;
      /**
       * The ID of the tab that was previously active, if that tab is still
       * open.
       */
      previousTabId?: number;
      /** The ID of the window the active tab changed inside of. */
      windowId: number;
    }) => void
  >;
  /** Fired when a tab is closed. */
  onRemoved: WebExtEvent<
    (
      tabId: number,
      removeInfo: {
        /** The window whose tab is closed. */
        windowId: number;
        /**
         * True when the tab is being closed because its window is being
         * closed.
         */
        isWindowClosing: boolean;
      }
    ) => void
  >;
  /**
   * Fired when a tab is updated.
   * @param changeInfo Lists the changes to the state of the tab that was
   * updated.
   * @param tab Gives the state of the tab that was updated.
   */
  onUpdated: browser.tabs._TabsOnUpdatedEvent;
}
