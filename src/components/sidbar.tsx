"use client";

import { useState } from 'react';
import Link from 'next/link';
import './style.css';
import { Button, Drawer, IconButton, ThemeProvider, createTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { signOutExpencConverterUser } from '@/firebase/firebase.auth';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

export default function Sidebar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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

    // Sidebar content
    const sidebarContent = (
        <nav className={"sidebar"}>
            <h2 className={"title"}>All Expenses</h2>
            <ul className={"navList"}>
                <li>
                    <Button color='warning' className={"navLink"}>
                        <Link href="/home/expences">Expenses</Link>
                    </Button>
                </li>
                <li>
                    <Button className={"navLink"} color="primary">
                        <Link href="/home/addexpence">Add New +</Link>
                    </Button>
                </li>
                <li>
                    <Button className={"navLink"} color='error' onClick={() => { signOutExpencConverterUser() }}>Logout</Button>
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
                        <MenuIcon sx={{ color: '#fff' }} /> {/* Ensure icon is white or contrasting color */}
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
