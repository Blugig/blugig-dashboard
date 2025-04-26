"use client"

import React, { createContext, useState, useContext } from 'react';

// Create a context with a default value
const SidebarContext = createContext({
    isOpen: false,
    toggleSidebar: () => { },
});

export const SidebarProvider = ({ children }) => {
    const [isOpen, setIsOpen] = useState(true);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <SidebarContext.Provider value={{ isOpen, toggleSidebar }}>
            {children}
        </SidebarContext.Provider>
    );
};

// Custom hook to use the sidebar context
export const useSidebar = () => {
    return useContext(SidebarContext);
};
