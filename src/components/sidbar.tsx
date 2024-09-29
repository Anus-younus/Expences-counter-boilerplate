"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import './style.css';
import { Button, Drawer, IconButton, ThemeProvider, createTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { auth, signOutExpencConverterUser } from '@/firebase/firebase.auth';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useRouter, usePathname } from 'next/navigation'; // Import usePathname
import { onAuthStateChanged, User } from 'firebase/auth';
// import { useAuth } from '@/firebase/firebase.auth'; // Assuming you have a hook for authentication

export default function Sidebar() {
    const useAuth = () => {
        const [user, setUser] = useState<User | null>(null);
        const [loading, setLoading] = useState(true);
    
        useEffect(() => {
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                setUser(user); // Set the user state to the authenticated user
                setLoading(false); // Loading is done
            });
    
            // Cleanup subscription on unmount
            return () => unsubscribe();
        }, []);
    
        return { user, loading };
    };
    const [mobileOpen, setMobileOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const router = useRouter();
    const pathname = usePathname(); // Get current pathname

    // Get user authentication state (assuming you have a custom hook)
    const { user } = useAuth(); // Replace with your actual auth hook

    // Custom dark theme
    const darkTheme = createTheme({
        palette: {
            mode: 'dark',
            background: {
                paper: '#121212',
            },
            primary: {
                main: '#bb86fc',
            },
            secondary: {
                main: '#03dac6',
            },
            warning: {
                main: '#ff9800',
            },
            error: {
                main: '#cf6679',
            },
            text: {
                primary: '#ffffff',
                secondary: '#aaaaaa',
            },
        },
    });

    // Toggle drawer for mobile
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    // Handle Logout
    const handleLogout = async () => {
        try {
            await signOutExpencConverterUser(); // Call the sign-out function
            router.push('/login'); // Redirect to the login page after logout
        } catch (error) {
            console.error("Logout error:", error); // Log any errors
        }
    };

    // Sidebar content
    const sidebarContent = (
        <nav className={"sidebar"}>
            <h2 className={"title"}>All Expenses</h2>
            <ul className={"navList"}>
                {user ? ( // Only show links if user is authenticated
                    <>
                        <li>
                            <Button 
                                component={Link} 
                                href="/home/expences"
                                className={pathname === "/home/expences" ? "active" : ""}
                            >
                                Expenses
                            </Button>
                        </li>
                        <li>
                            <Button 
                                component={Link} 
                                href="/home/expencestrack"
                                className={pathname === "/home/expencestrack" ? "active" : ""}
                            >
                                Expenses track
                            </Button>
                        </li>
                        <li>
                            <Button 
                                component={Link} 
                                href="/home/addexpence"
                                className={pathname === "/home/addexpence" ? "active" : ""}
                            >
                                Add New +
                            </Button>
                        </li>
                    </>
                ) : (
                    <p className="no-data-message">You are logged out. Please log in!</p> // Message when user is not authenticated
                )}
                <li>
                    <Button
                        onClick={handleLogout}
                        className={"navLink"}
                        disabled={!user} // Disable logout if user is not authenticated
                    >
                        Logout
                    </Button>
                </li>
            </ul>
        </nav>
    );

    return (
        <ThemeProvider theme={darkTheme}>
            {isMobile ? (
                <>
                    <IconButton
                        color="inherit"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ position: 'absolute', top: '1rem', left: '1rem', color: '#fff' }}
                    >
                        <MenuIcon sx={{ color: "#000" }} />
                    </IconButton>
                    <Drawer
                        variant="temporary"
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        sx={{
                            '& .MuiDrawer-paper': {
                                width: '240px',
                                backgroundColor: darkTheme.palette.background.paper,
                            },
                        }}
                    >
                        {sidebarContent}
                    </Drawer>
                </>
            ) : (
                <Drawer
                    variant="permanent"
                    sx={{
                        '& .MuiDrawer-paper': {
                            width: '240px',
                            backgroundColor: darkTheme.palette.background.paper,
                            boxSizing: 'border-box',
                        },
                    }}
                    open
                >
                    {sidebarContent}
                </Drawer>
            )}
        </ThemeProvider>
    );
}
