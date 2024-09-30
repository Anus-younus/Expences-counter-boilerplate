"use client";

import { useState, useEffect } from 'react';
import LogoutIcon from '@mui/icons-material/Logout';
import Link from 'next/link';
import './style.css';
import { Button, Drawer, IconButton, ThemeProvider, createTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { auth, signOutExpencConverterUser } from '@/firebase/firebase.auth';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useRouter, usePathname } from 'next/navigation';
import { onAuthStateChanged, User } from 'firebase/auth';

export default function Sidebar() {
    const useAuth = () => {
        const [user, setUser] = useState<User | null>(null);
        const [loading, setLoading] = useState(true);

        useEffect(() => {
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                setUser(user); 
                setLoading(false); 
            });

            return () => unsubscribe();
        }, []);

        return { user, loading };
    };

    const [mobileOpen, setMobileOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const router = useRouter();
    const pathname = usePathname();

    const { user } = useAuth();

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

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleLogout = async () => {
        try {
            await signOutExpencConverterUser();
            router.push('/login');
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const sidebarContent = (
        <nav className={"sidebar"}>
            <h2 className={"title"}>All Expenses</h2>
            <ul className={"navList"}>
                {user ? (
                    <>
                        <li>
                            <Link href="/home/expences" passHref>
                                <Button className={pathname === "/home/expences" ? "active" : ""}>
                                    Expenses
                                </Button>
                            </Link>
                        </li>
                        <li>
                            <Link href="/home/expencestrack" passHref>
                                <Button className={pathname === "/home/expencestrack" ? "active" : ""}>
                                    Expenses track
                                </Button>
                            </Link>
                        </li>
                        <li>
                            <Link href="/home/addexpence" passHref>
                                <Button className={pathname === "/home/addexpence" ? "active" : ""}>
                                    Add New +
                                </Button>
                            </Link>
                        </li>
                    </>
                ) : (
                    <p className="no-data-message">You are logged out. Please log in!</p>
                )}
                <li>
                    <Button
                        onClick={handleLogout}
                        startIcon={<LogoutIcon />}
                        color='error'
                        variant="contained"
                        disabled={!user}
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
                        sx={{ position: 'absolute', top: '1rem', left: '1rem', color: '#000' }}
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
