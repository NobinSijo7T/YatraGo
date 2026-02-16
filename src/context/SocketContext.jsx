"use client";
import { createContext, useContext, useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => {
    const context = useContext(SocketContext);
    // Return safe defaults instead of throwing
    if (!context) {
        return { socket: null, isConnected: false, isConnecting: false };
    }
    return context;
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const connectionTimeoutRef = useRef(null);
    const hasLoggedError = useRef(false);

    useEffect(() => {
        // Only attempt connection if NEXT_PUBLIC_SOCKET_URL is set
        const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL;
        if (!socketUrl) {
            // Silently skip socket connection if not configured
            return;
        }

        setIsConnecting(true);

        // Set a connection timeout (5 seconds - reduced from 10)
        connectionTimeoutRef.current = setTimeout(() => {
            if (!isConnected && !hasLoggedError.current) {
                hasLoggedError.current = true;
                setIsConnecting(false);
            }
        }, 5000);

        // Initialize socket connection
        const socketInstance = io(socketUrl, {
            path: "/api/socket",
            transports: ["websocket", "polling"],
            reconnection: false, // Disable reconnection to prevent spam
            timeout: 5000,
        });

        socketInstance.on("connect", () => {
            setIsConnected(true);
            setIsConnecting(false);
            hasLoggedError.current = false;
            if (connectionTimeoutRef.current) {
                clearTimeout(connectionTimeoutRef.current);
            }
        });

        socketInstance.on("disconnect", () => {
            setIsConnected(false);
        });

        socketInstance.on("connect_error", () => {
            // Silently handle connection errors
            setIsConnecting(false);
        });

        setSocket(socketInstance);

        return () => {
            if (connectionTimeoutRef.current) {
                clearTimeout(connectionTimeoutRef.current);
            }
            if (socketInstance) {
                socketInstance.disconnect();
            }
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket, isConnected, isConnecting }}>
            {children}
        </SocketContext.Provider>
    );
};
