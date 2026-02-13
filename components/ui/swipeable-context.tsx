"use client";

/**
 * SwipeableContext - Global state management for swipeable items
 *
 * Ensures only one swipeable item can be open at a time across the entire app.
 * When item B is opened, item A automatically closes.
 */

import * as React from "react";

interface SwipeableContextType {
  /** ID of the currently open swipeable item, or null if none */
  openItemId: string | null;
  /** Function to register an item as open (closes any previously open item) */
  setOpenItem: (id: string | null) => void;
}

const SwipeableContext = React.createContext<SwipeableContextType | null>(null);

interface SwipeableProviderProps {
  children: React.ReactNode;
}

/**
 * Provider component that wraps the app to manage swipeable item state.
 * Place this in your root layout to enable single-open behavior across all pages.
 */
export function SwipeableProvider({ children }: SwipeableProviderProps) {
  const [openItemId, setOpenItemId] = React.useState<string | null>(null);

  const setOpenItem = React.useCallback((id: string | null) => {
    setOpenItemId(id);
  }, []);

  const value = React.useMemo(
    () => ({ openItemId, setOpenItem }),
    [openItemId, setOpenItem]
  );

  return (
    <SwipeableContext.Provider value={value}>
      {children}
    </SwipeableContext.Provider>
  );
}

/**
 * Hook to access the swipeable context.
 * Must be used within a SwipeableProvider.
 */
export function useSwipeableContext() {
  const context = React.useContext(SwipeableContext);
  if (!context) {
    throw new Error(
      "useSwipeableContext must be used within a SwipeableProvider"
    );
  }
  return context;
}
