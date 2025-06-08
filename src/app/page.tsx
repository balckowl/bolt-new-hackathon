"use client";

import { useState, useRef, useEffect } from 'react';
import { 
  Settings, 
  Mail, 
  Calendar, 
  Camera, 
  Music, 
  VideoIcon as Video,
  FileText,
  Calculator,
  MapPin,
  MessageCircle,
  Chrome,
  Folder,
  Image,
  Download,
  Trash2,
  Terminal,
  Monitor,
  Wifi,
  Battery,
  Phone,
  Clock,
  X,
  Minus,
  Square,
  StickyNote,
  Search,
  Plus,
  Globe,
  Edit3,
  FolderIcon
} from 'lucide-react';
import { BackgroundSelector } from '@/src/components/BackgroundSelector';

interface AppIcon {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  type?: 'app' | 'memo' | 'website' | 'folder';
  content?: string;
  url?: string;
  favicon?: string;
}

interface GridPosition {
  row: number;
  col: number;
}

interface MemoWindow {
  id: string;
  title: string;
  content: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  isMinimized: boolean;
  zIndex: number;
}

interface BrowserWindow {
  id: string;
  title: string;
  url: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  isMinimized: boolean;
  zIndex: number;
}

interface FolderWindow {
  id: string;
  title: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  isMinimized: boolean;
  zIndex: number;
}

interface ContextMenu {
  visible: boolean;
  x: number;
  y: number;
  position: GridPosition | null;
  existingApp?: AppIcon | null;
}

interface MemoNameDialog {
  visible: boolean;
  position: GridPosition | null;
}

interface AppUrlDialog {
  visible: boolean;
  position: GridPosition | null;
}

interface FolderNameDialog {
  visible: boolean;
  position: GridPosition | null;
}

interface EditDialog {
  visible: boolean;
  app: AppIcon | null;
  newName: string;
  newUrl?: string;
}

const GRID_COLS = 6;
const GRID_ROWS = 10;

export default function MacOSDesktop() {
  const [apps, setApps] = useState<AppIcon[]>([
    { 
      id: 'memo-default', 
      name: 'My Notes', 
      icon: StickyNote, 
      color: 'bg-yellow-300', 
      type: 'memo', 
      content: 'Welcome to your memo app!\n\nClick on this memo to start writing notes.' 
    }
  ]);
  const [appPositions, setAppPositions] = useState<Map<string, GridPosition>>(new Map());
  const [draggedApp, setDraggedApp] = useState<string | null>(null);
  const [draggedOver, setDraggedOver] = useState<GridPosition | null>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenu>({ visible: false, x: 0, y: 0, position: null });
  const [memoWindows, setMemoWindows] = useState<MemoWindow[]>([]);
  const [browserWindows, setBrowserWindows] = useState<BrowserWindow[]>([]);
  const [folderWindows, setFolderWindows] = useState<FolderWindow[]>([]);
  const [nextZIndex, setNextZIndex] = useState(1000);
  const [memoCounter, setMemoCounter] = useState(2);
  const [folderCounter, setFolderCounter] = useState(1);
  const [positionsInitialized, setPositionsInitialized] = useState(false);
  const [memoNameDialog, setMemoNameDialog] = useState<MemoNameDialog>({ visible: false, position: null });
  const [appUrlDialog, setAppUrlDialog] = useState<AppUrlDialog>({ visible: false, position: null });
  const [folderNameDialog, setFolderNameDialog] = useState<FolderNameDialog>({ visible: false, position: null });
  const [editDialog, setEditDialog] = useState<EditDialog>({ visible: false, app: null, newName: '', newUrl: '' });
  const [memoNameInput, setMemoNameInput] = useState('');
  const [appUrlInput, setAppUrlInput] = useState('');
  const [folderNameInput, setFolderNameInput] = useState('');
  const [isLoadingApp, setIsLoadingApp] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [background, setBackground] = useState('linear-gradient(135deg, #667eea 0%, #764ba2 100%)');
  const [folderContents, setFolderContents] = useState<Map<string, string[]>>(new Map());
  const [draggedOverFolder, setDraggedOverFolder] = useState<string | null>(null);
  
  const dragSourceRef = useRef<GridPosition | null>(null);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Initialize app positions only once
  useEffect(() => {
    if (!positionsInitialized && apps.length > 0) {
      const initialPositions = new Map<string, GridPosition>();
      // Only set position for the default memo at (0, 0)
      if (apps[0]) {
        initialPositions.set(apps[0].id, { row: 0, col: 0 });
      }
      setAppPositions(initialPositions);
      setPositionsInitialized(true);
    }
  }, [apps, positionsInitialized]);

  // Close context menu and dialogs when clicking elsewhere
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Don't close if clicking inside the dialog or context menu
      const target = e.target as HTMLElement;
      if (target.closest('.memo-dialog') || 
          target.closest('.app-dialog') || 
          target.closest('.folder-dialog') || 
          target.closest('.edit-dialog') || 
          target.closest('.context-menu')) {
        return;
      }
      
      setContextMenu({ visible: false, x: 0, y: 0, position: null });
      setMemoNameDialog({ visible: false, position: null });
      setAppUrlDialog({ visible: false, position: null });
      setFolderNameDialog({ visible: false, position: null });
      setEditDialog({ visible: false, app: null, newName: '', newUrl: '' });
    };
    
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const getAppAtPosition = (row: number, col: number): AppIcon | null => {
    for (const [appId, position] of appPositions.entries()) {
      if (position.row === row && position.col === col) {
        return apps.find(app => app.id === appId) || null;
      }
    }
    return null;
  };

  const handleDragStart = (e: React.DragEvent, appId: string) => {
    setDraggedApp(appId);
    const position = appPositions.get(appId);
    if (position) {
      dragSourceRef.current = position;
    }
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedApp(null);
    setDraggedOver(null);
    setDraggedOverFolder(null);
    dragSourceRef.current = null;
  };

  const handleDragOver = (e: React.DragEvent, row: number, col: number) => {
    e.preventDefault();
    setDraggedOver({ row, col });
    
    // Check if we're dragging over a folder
    const targetApp = getAppAtPosition(row, col);
    if (targetApp && targetApp.type === 'folder') {
      setDraggedOverFolder(targetApp.id);
    } else {
      setDraggedOverFolder(null);
    }
    
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragLeave = () => {
    setDraggedOver(null);
    setDraggedOverFolder(null);
  };

  const handleDrop = (e: React.DragEvent, targetRow: number, targetCol: number) => {
    e.preventDefault();
    
    if (!draggedApp || !dragSourceRef.current) return;

    const newPositions = new Map(appPositions);
    const targetApp = getAppAtPosition(targetRow, targetCol);

    // If dropping on a folder, add the app to the folder
    if (targetApp && targetApp.type === 'folder') {
      const newFolderContents = new Map(folderContents);
      const currentContents = newFolderContents.get(targetApp.id) || [];
      
      // Add the dragged app to the folder
      newFolderContents.set(targetApp.id, [...currentContents, draggedApp]);
      setFolderContents(newFolderContents);
      
      // Remove the app from its current position
      newPositions.delete(draggedApp);
      setAppPositions(newPositions);
    } else if (targetApp) {
      // Swap positions
      newPositions.set(draggedApp, { row: targetRow, col: targetCol });
      newPositions.set(targetApp.id, dragSourceRef.current);
      setAppPositions(newPositions);
    } else {
      // Move to empty cell
      newPositions.set(draggedApp, { row: targetRow, col: targetCol });
      setAppPositions(newPositions);
    }

    setDraggedOver(null);
    setDraggedOverFolder(null);
  };

  const handleRightClick = (e: React.MouseEvent, row: number, col: number) => {
    e.preventDefault();
    e.stopPropagation();
    const existingApp = getAppAtPosition(row, col);
    
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      position: { row, col },
      existingApp
    });
  };

  const showMemoNameDialog = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setMemoNameDialog({
      visible: true,
      position: contextMenu.position
    });
    setMemoNameInput(`Memo ${memoCounter}`);
    setContextMenu({ visible: false, x: 0, y: 0, position: null });
  };

  const showAppUrlDialog = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setAppUrlDialog({
      visible: true,
      position: contextMenu.position
    });
    setAppUrlInput('');
    setContextMenu({ visible: false, x: 0, y: 0, position: null });
  };

  const showFolderNameDialog = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setFolderNameDialog({
      visible: true,
      position: contextMenu.position
    });
    setFolderNameInput(`Folder ${folderCounter}`);
    setContextMenu({ visible: false, x: 0, y: 0, position: null });
  };

  const showEditDialog = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!contextMenu.existingApp) return;
    
    setEditDialog({
      visible: true,
      app: contextMenu.existingApp,
      newName: contextMenu.existingApp.name,
      newUrl: contextMenu.existingApp.url || ''
    });
    setContextMenu({ visible: false, x: 0, y: 0, position: null });
  };

  const deleteApp = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!contextMenu.existingApp) return;
    
    const appToDelete = contextMenu.existingApp;
    
    // Remove from apps array
    setApps(prev => prev.filter(app => app.id !== appToDelete.id));
    
    // Remove from positions
    setAppPositions(prev => {
      const newPositions = new Map(prev);
      newPositions.delete(appToDelete.id);
      return newPositions;
    });
    
    // Remove from folder contents if it's in any folder
    setFolderContents(prev => {
      const newContents = new Map(prev);
      for (const [folderId, contents] of newContents.entries()) {
        const filteredContents = contents.filter(id => id !== appToDelete.id);
        newContents.set(folderId, filteredContents);
      }
      return newContents;
    });
    
    // Close any open windows for this app
    if (appToDelete.type === 'memo') {
      setMemoWindows(prev => prev.filter(w => w.id !== appToDelete.id));
    } else if (appToDelete.type === 'website') {
      setBrowserWindows(prev => prev.filter(w => w.id !== appToDelete.id));
    } else if (appToDelete.type === 'folder') {
      setFolderWindows(prev => prev.filter(w => w.id !== appToDelete.id));
      // Move folder contents back to desktop
      const contents = folderContents.get(appToDelete.id) || [];
      if (contents.length > 0) {
        const newPositions = new Map(appPositions);
        contents.forEach(appId => {
          const emptyPosition = findNextEmptyPosition();
          if (emptyPosition) {
            newPositions.set(appId, emptyPosition);
          }
        });
        setAppPositions(newPositions);
      }
      // Remove folder from folderContents
      setFolderContents(prev => {
        const newContents = new Map(prev);
        newContents.delete(appToDelete.id);
        return newContents;
      });
    }
    
    setContextMenu({ visible: false, x: 0, y: 0, position: null });
  };

  const saveEdit = () => {
    if (!editDialog.app || !editDialog.newName.trim()) return;
    
    // Update the app
    setApps(prev => prev.map(app => 
      app.id === editDialog.app!.id 
        ? { 
            ...app, 
            name: editDialog.newName.trim(),
            ...(app.type === 'website' && editDialog.newUrl ? { url: editDialog.newUrl } : {})
          }
        : app
    ));
    
    // Update any open windows
    if (editDialog.app.type === 'memo') {
      setMemoWindows(prev => prev.map(w => 
        w.id === editDialog.app!.id ? { ...w, title: editDialog.newName.trim() } : w
      ));
    } else if (editDialog.app.type === 'website') {
      setBrowserWindows(prev => prev.map(w => 
        w.id === editDialog.app!.id ? { 
          ...w, 
          title: editDialog.newName.trim(),
          ...(editDialog.newUrl ? { url: editDialog.newUrl } : {})
        } : w
      ));
    } else if (editDialog.app.type === 'folder') {
      setFolderWindows(prev => prev.map(w => 
        w.id === editDialog.app!.id ? { ...w, title: editDialog.newName.trim() } : w
      ));
    }
    
    setEditDialog({ visible: false, app: null, newName: '', newUrl: '' });
  };

  const cancelEdit = () => {
    setEditDialog({ visible: false, app: null, newName: '', newUrl: '' });
  };

  const findNextEmptyPosition = (): GridPosition | null => {
    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        if (!getAppAtPosition(row, col)) {
          return { row, col };
        }
      }
    }
    return null;
  };

  const createMemoWithName = () => {
    if (!memoNameDialog.position || !memoNameInput.trim()) return;

    const memoId = `memo-${Date.now()}`;
    const memoApp: AppIcon = {
      id: memoId,
      name: memoNameInput.trim(),
      icon: StickyNote,
      color: 'bg-yellow-300',
      type: 'memo',
      content: ''
    };

    // Add the new app to the apps array
    setApps(prev => [...prev, memoApp]);
    
    // Set the position for the new memo in the clicked cell
    setAppPositions(prev => {
      const newPositions = new Map(prev);
      newPositions.set(memoId, memoNameDialog.position!);
      return newPositions;
    });

    setMemoCounter(prev => prev + 1);
    setMemoNameDialog({ visible: false, position: null });
    setMemoNameInput('');
  };

  const createAppWithUrl = async () => {
    if (!appUrlDialog.position || !appUrlInput.trim()) return;

    setIsLoadingApp(true);
    
    try {
      let url = appUrlInput.trim();
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }

      // Try to fetch site metadata
      let siteName = '';
      let favicon = '';
      
      try {
        const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
        const data = await response.json();
        const html = data.contents;
        
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // Get site title
        const titleElement = doc.querySelector('title');
        siteName = titleElement ? titleElement.textContent?.trim() || '' : '';
        
        // Get favicon
        const iconLink = doc.querySelector('link[rel*="icon"]') as HTMLLinkElement;
        if (iconLink) {
          const iconUrl = iconLink.href;
          if (iconUrl.startsWith('http')) {
            favicon = iconUrl;
          } else {
            const baseUrl = new URL(url).origin;
            favicon = new URL(iconUrl, baseUrl).href;
          }
        } else {
          const baseUrl = new URL(url).origin;
          favicon = `${baseUrl}/favicon.ico`;
        }
      } catch (error) {
        console.error('Error fetching site metadata:', error);
        // Fallback to domain name
        siteName = new URL(url).hostname;
      }

      // If no site name found, use domain
      if (!siteName) {
        siteName = new URL(url).hostname;
      }

      const appId = `app-${Date.now()}`;
      const newApp: AppIcon = {
        id: appId,
        name: siteName,
        icon: Globe,
        color: 'bg-blue-500',
        type: 'website',
        url: url,
        favicon: favicon
      };

      // Add the new app to the apps array
      setApps(prev => [...prev, newApp]);
      
      // Set the position for the new app in the clicked cell
      setAppPositions(prev => {
        const newPositions = new Map(prev);
        newPositions.set(appId, appUrlDialog.position!);
        return newPositions;
      });

      setAppUrlDialog({ visible: false, position: null });
      setAppUrlInput('');
    } catch (error) {
      console.error('Error creating app:', error);
      // Still create the app with basic info
      const appId = `app-${Date.now()}`;
      const newApp: AppIcon = {
        id: appId,
        name: appUrlInput.trim(),
        icon: Globe,
        color: 'bg-blue-500',
        type: 'website',
        url: appUrlInput.startsWith('http') ? appUrlInput : 'https://' + appUrlInput
      };

      setApps(prev => [...prev, newApp]);
      setAppPositions(prev => {
        const newPositions = new Map(prev);
        newPositions.set(appId, appUrlDialog.position!);
        return newPositions;
      });

      setAppUrlDialog({ visible: false, position: null });
      setAppUrlInput('');
    } finally {
      setIsLoadingApp(false);
    }
  };

  const createFolderWithName = () => {
    if (!folderNameDialog.position || !folderNameInput.trim()) return;

    const folderId = `folder-${Date.now()}`;
    const folderApp: AppIcon = {
      id: folderId,
      name: folderNameInput.trim(),
      icon: FolderIcon,
      color: 'bg-blue-600',
      type: 'folder'
    };

    // Add the new folder to the apps array
    setApps(prev => [...prev, folderApp]);
    
    // Set the position for the new folder in the clicked cell
    setAppPositions(prev => {
      const newPositions = new Map(prev);
      newPositions.set(folderId, folderNameDialog.position!);
      return newPositions;
    });

    // Initialize empty folder contents
    setFolderContents(prev => {
      const newContents = new Map(prev);
      newContents.set(folderId, []);
      return newContents;
    });

    setFolderCounter(prev => prev + 1);
    setFolderNameDialog({ visible: false, position: null });
    setFolderNameInput('');
  };

  const cancelMemoCreation = () => {
    setMemoNameDialog({ visible: false, position: null });
    setMemoNameInput('');
  };

  const cancelAppCreation = () => {
    setAppUrlDialog({ visible: false, position: null });
    setAppUrlInput('');
  };

  const cancelFolderCreation = () => {
    setFolderNameDialog({ visible: false, position: null });
    setFolderNameInput('');
  };

  const openMemo = (memoApp: AppIcon) => {
    const existingWindow = memoWindows.find(w => w.id === memoApp.id);
    
    if (existingWindow) {
      // Bring to front
      setMemoWindows(prev => prev.map(w => 
        w.id === memoApp.id 
          ? { ...w, isMinimized: false, zIndex: nextZIndex }
          : w
      ));
      setNextZIndex(prev => prev + 1);
    } else {
      // Create new window
      const newWindow: MemoWindow = {
        id: memoApp.id,
        title: memoApp.name,
        content: memoApp.content || '',
        position: { x: 100 + memoWindows.length * 30, y: 100 + memoWindows.length * 30 },
        size: { width: 600, height: 400 },
        isMinimized: false,
        zIndex: nextZIndex
      };
      
      setMemoWindows(prev => [...prev, newWindow]);
      setNextZIndex(prev => prev + 1);
    }
  };

  const openBrowser = (app: AppIcon) => {
    if (!app.url) return;

    const existingWindow = browserWindows.find(w => w.id === app.id);
    
    if (existingWindow) {
      // Bring to front
      setBrowserWindows(prev => prev.map(w => 
        w.id === app.id 
          ? { ...w, isMinimized: false, zIndex: nextZIndex }
          : w
      ));
      setNextZIndex(prev => prev + 1);
    } else {
      // Create new window
      const newWindow: BrowserWindow = {
        id: app.id,
        title: app.name,
        url: app.url,
        position: { x: 150 + browserWindows.length * 30, y: 80 + browserWindows.length * 30 },
        size: { width: 1000, height: 700 },
        isMinimized: false,
        zIndex: nextZIndex
      };
      
      setBrowserWindows(prev => [...prev, newWindow]);
      setNextZIndex(prev => prev + 1);
    }
  };

  const openFolder = (folderApp: AppIcon) => {
    const existingWindow = folderWindows.find(w => w.id === folderApp.id);
    
    if (existingWindow) {
      // Bring to front
      setFolderWindows(prev => prev.map(w => 
        w.id === folderApp.id 
          ? { ...w, isMinimized: false, zIndex: nextZIndex }
          : w
      ));
      setNextZIndex(prev => prev + 1);
    } else {
      // Create new window
      const newWindow: FolderWindow = {
        id: folderApp.id,
        title: folderApp.name,
        position: { x: 200 + folderWindows.length * 30, y: 120 + folderWindows.length * 30 },
        size: { width: 800, height: 600 },
        isMinimized: false,
        zIndex: nextZIndex
      };
      
      setFolderWindows(prev => [...prev, newWindow]);
      setNextZIndex(prev => prev + 1);
    }
  };

  const updateMemoContent = (windowId: string, content: string) => {
    // Update memo window content
    setMemoWindows(prev => prev.map(w => 
      w.id === windowId ? { ...w, content } : w
    ));
    
    // Update app content without triggering position recalculation
    setApps(prev => prev.map(app => 
      app.id === windowId ? { ...app, content } : app
    ));
  };

  const closeMemoWindow = (windowId: string) => {
    setMemoWindows(prev => prev.filter(w => w.id !== windowId));
  };

  const closeBrowserWindow = (windowId: string) => {
    setBrowserWindows(prev => prev.filter(w => w.id !== windowId));
  };

  const closeFolderWindow = (windowId: string) => {
    setFolderWindows(prev => prev.filter(w => w.id !== windowId));
  };

  const minimizeMemoWindow = (windowId: string) => {
    setMemoWindows(prev => prev.map(w => 
      w.id === windowId ? { ...w, isMinimized: true } : w
    ));
  };

  const minimizeBrowserWindow = (windowId: string) => {
    setBrowserWindows(prev => prev.map(w => 
      w.id === windowId ? { ...w, isMinimized: true } : w
    ));
  };

  const minimizeFolderWindow = (windowId: string) => {
    setFolderWindows(prev => prev.map(w => 
      w.id === windowId ? { ...w, isMinimized: true } : w
    ));
  };

  const bringMemoToFront = (windowId: string) => {
    setMemoWindows(prev => prev.map(w => 
      w.id === windowId ? { ...w, zIndex: nextZIndex } : w
    ));
    setNextZIndex(prev => prev + 1);
  };

  const bringBrowserToFront = (windowId: string) => {
    setBrowserWindows(prev => prev.map(w => 
      w.id === windowId ? { ...w, zIndex: nextZIndex } : w
    ));
    setNextZIndex(prev => prev + 1);
  };

  const bringFolderToFront = (windowId: string) => {
    setFolderWindows(prev => prev.map(w => 
      w.id === windowId ? { ...w, zIndex: nextZIndex } : w
    ));
    setNextZIndex(prev => prev + 1);
  };

  const removeFromFolder = (folderId: string, appId: string) => {
    // Remove app from folder
    setFolderContents(prev => {
      const newContents = new Map(prev);
      const currentContents = newContents.get(folderId) || [];
      newContents.set(folderId, currentContents.filter(id => id !== appId));
      return newContents;
    });

    // Find next empty position and place the app there
    const emptyPosition = findNextEmptyPosition();
    if (emptyPosition) {
      setAppPositions(prev => {
        const newPositions = new Map(prev);
        newPositions.set(appId, emptyPosition);
        return newPositions;
      });
    }
  };

  const handleAppClick = (app: AppIcon) => {
    if (app.type === 'memo') {
      openMemo(app);
    } else if (app.type === 'website') {
      openBrowser(app);
    } else if (app.type === 'folder') {
      openFolder(app);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleBackgroundChange = (newBackground: string) => {
    setBackground(newBackground);
  };

  const getBackgroundStyle = () => {
    if (background.startsWith('http')) {
      return {
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      };
    } else {
      return {
        background: background
      };
    }
  };

  const renderAppIcon = (app: AppIcon) => {
    if (app.type === 'website' && app.favicon) {
      return (
        <img
          src={app.favicon}
          alt={app.name}
          className="w-7 h-7 rounded-sm"
          onError={(e) => {
            // Fallback to Globe icon if favicon fails to load
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            target.nextElementSibling?.classList.remove('hidden');
          }}
        />
      );
    }
    return <app.icon size={28} className="text-white drop-shadow-sm" />;
  };

  const getFolderAppCount = (folderId: string): number => {
    return folderContents.get(folderId)?.length || 0;
  };

  const renderGrid = () => {
    const grid = [];
    
    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        const app = getAppAtPosition(row, col);
        const isDropTarget = draggedOver?.row === row && draggedOver?.col === col;
        const isFolderDropTarget = app?.type === 'folder' && draggedOverFolder === app.id;
        
        grid.push(
          <div
            key={`${row}-${col}`}
            className={`
              relative flex items-center justify-center
              transition-all duration-200 ease-in-out
              border border-white/10
              ${isDropTarget ? 'bg-white/10 rounded-2xl scale-105' : ''}
              ${isFolderDropTarget ? 'bg-blue-500/20 rounded-2xl scale-105 ring-2 ring-blue-400' : ''}
            `}
            onDragOver={(e) => handleDragOver(e, row, col)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, row, col)}
            onContextMenu={(e) => handleRightClick(e, row, col)}
          >
            {app && (
              <div
                draggable
                onDragStart={(e) => handleDragStart(e, app.id)}
                onDragEnd={handleDragEnd}
                onClick={() => handleAppClick(app)}
                className="group cursor-grab active:cursor-grabbing transform transition-all duration-200 ease-out hover:scale-110 hover:-translate-y-1"
              >
                <div className={`
                  relative w-14 h-14 rounded-2xl ${app.color}
                  shadow-lg hover:shadow-xl
                  flex items-center justify-center
                  border border-white/20
                  backdrop-blur-sm
                  transition-all duration-200
                  group-hover:shadow-2xl
                  group-hover:border-white/30
                `}>
                  {renderAppIcon(app)}
                  {app.type === 'website' && app.favicon && (
                    <Globe size={28} className="text-white drop-shadow-sm hidden" />
                  )}
                  {app.type === 'folder' && getFolderAppCount(app.id) > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold border-2 border-white">
                      {getFolderAppCount(app.id)}
                    </div>
                  )}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-white/10" />
                </div>
                <div className="mt-1 text-xs text-white text-center font-medium drop-shadow-sm">
                  {app.name}
                </div>
              </div>
            )}
          </div>
        );
      }
    }
    
    return grid;
  };

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={getBackgroundStyle()}
    >
      {/* Background overlay for better contrast */}
      <div className="absolute inset-0 bg-black/20" />
      
      {/* Menu bar */}
      <div className="relative z-10 h-8 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center space-x-4">
            {/* Apple Logo */}
            <div className="text-white font-bold text-lg leading-none" style={{ fontFamily: 'system-ui' }}>
              🍎
            </div>
            {/* Finder */}
            <div className="flex items-center space-x-1">
              <Search size={14} className="text-white" />
              <span className="text-white text-sm font-medium">Finder</span>
            </div>
            {/* Background Selector */}
            <BackgroundSelector 
              onBackgroundChange={handleBackgroundChange}
              currentBackground={background}
            />
          </div>
          <div className="flex items-center space-x-3 text-white text-sm">
            {/* Wi-Fi Icon */}
            <div className="flex items-center">
              <Wifi size={14} className="text-white" />
            </div>
            {/* Battery Icon */}
            <div className="flex items-center">
              <Battery size={14} className="text-white" />
            </div>
            {/* Time */}
            <div className="flex items-center space-x-1">
              <Clock size={14} className="text-white" />
              <span className="font-medium">{formatTime(currentTime)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop grid */}
      <div className="relative z-10 p-8 h-[calc(100vh-2rem)]">
        <div 
          className="grid gap-0 h-full max-w-6xl mx-auto"
          style={{
            gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
            gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)`,
          }}
        >
          {renderGrid()}
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu.visible && (
        <div
          className="context-menu fixed z-50 bg-white/90 backdrop-blur-md rounded-lg shadow-xl border border-white/20 py-2 min-w-[150px]"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={(e) => e.stopPropagation()}
        >
          {contextMenu.existingApp ? (
            // Menu for existing apps
            <>
              <button
                onClick={showEditDialog}
                className="w-full px-4 py-2 text-left text-sm text-gray-800 hover:bg-blue-500/20 transition-colors flex items-center space-x-2"
              >
                <Edit3 size={16} />
                <span>Edit</span>
              </button>
              <button
                onClick={deleteApp}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-500/20 transition-colors flex items-center space-x-2"
              >
                <Trash2 size={16} />
                <span>Delete</span>
              </button>
            </>
          ) : (
            // Menu for empty cells
            <>
              <button
                onClick={showAppUrlDialog}
                className="w-full px-4 py-2 text-left text-sm text-gray-800 hover:bg-blue-500/20 transition-colors flex items-center space-x-2"
              >
                <Plus size={16} />
                <span>Create App</span>
              </button>
              <button
                onClick={showMemoNameDialog}
                className="w-full px-4 py-2 text-left text-sm text-gray-800 hover:bg-blue-500/20 transition-colors flex items-center space-x-2"
              >
                <StickyNote size={16} />
                <span>Create Memo</span>
              </button>
              <button
                onClick={showFolderNameDialog}
                className="w-full px-4 py-2 text-left text-sm text-gray-800 hover:bg-blue-500/20 transition-colors flex items-center space-x-2"
              >
                <FolderIcon size={16} />
                <span>Create Folder</span>
              </button>
            </>
          )}
        </div>
      )}

      {/* Edit Dialog */}
      {editDialog.visible && editDialog.app && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="edit-dialog bg-white rounded-xl shadow-2xl border border-gray-200 p-6 min-w-[400px]">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Edit {editDialog.app.type === 'memo' ? 'Memo' : editDialog.app.type === 'folder' ? 'Folder' : 'App'}
            </h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  id="edit-name"
                  type="text"
                  value={editDialog.newName}
                  onChange={(e) => setEditDialog(prev => ({ ...prev, newName: e.target.value }))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      saveEdit();
                    } else if (e.key === 'Escape') {
                      cancelEdit();
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Enter name..."
                  autoFocus
                />
              </div>
              {editDialog.app.type === 'website' && (
                <div>
                  <label htmlFor="edit-url" className="block text-sm font-medium text-gray-700 mb-2">
                    URL
                  </label>
                  <input
                    id="edit-url"
                    type="url"
                    value={editDialog.newUrl}
                    onChange={(e) => setEditDialog(prev => ({ ...prev, newUrl: e.target.value }))}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        saveEdit();
                      } else if (e.key === 'Escape') {
                        cancelEdit();
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="https://example.com"
                  />
                </div>
              )}
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={cancelEdit}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                disabled={!editDialog.newName.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* App URL Dialog */}
      {appUrlDialog.visible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="app-dialog bg-white rounded-xl shadow-2xl border border-gray-200 p-6 min-w-[400px]">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Create New App</h3>
            <div className="mb-4">
              <label htmlFor="app-url" className="block text-sm font-medium text-gray-700 mb-2">
                Website URL
              </label>
              <input
                id="app-url"
                type="url"
                value={appUrlInput}
                onChange={(e) => setAppUrlInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    createAppWithUrl();
                  } else if (e.key === 'Escape') {
                    cancelAppCreation();
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="https://example.com"
                autoFocus
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelAppCreation}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createAppWithUrl}
                disabled={!appUrlInput.trim() || isLoadingApp}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg transition-colors"
              >
                {isLoadingApp ? 'Creating...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Memo Name Dialog */}
      {memoNameDialog.visible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="memo-dialog bg-white rounded-xl shadow-2xl border border-gray-200 p-6 min-w-[400px]">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Create New Memo</h3>
            <div className="mb-4">
              <label htmlFor="memo-name" className="block text-sm font-medium text-gray-700 mb-2">
                Memo Name
              </label>
              <input
                id="memo-name"
                type="text"
                value={memoNameInput}
                onChange={(e) => setMemoNameInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    createMemoWithName();
                  } else if (e.key === 'Escape') {
                    cancelMemoCreation();
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Enter memo name..."
                autoFocus
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelMemoCreation}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createMemoWithName}
                disabled={!memoNameInput.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Folder Name Dialog */}
      {folderNameDialog.visible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="folder-dialog bg-white rounded-xl shadow-2xl border border-gray-200 p-6 min-w-[400px]">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Create New Folder</h3>
            <div className="mb-4">
              <label htmlFor="folder-name" className="block text-sm font-medium text-gray-700 mb-2">
                Folder Name
              </label>
              <input
                id="folder-name"
                type="text"
                value={folderNameInput}
                onChange={(e) => setFolderNameInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    createFolderWithName();
                  } else if (e.key === 'Escape') {
                    cancelFolderCreation();
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Enter folder name..."
                autoFocus
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelFolderCreation}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createFolderWithName}
                disabled={!folderNameInput.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Memo Windows */}
      {memoWindows.map((window) => (
        !window.isMinimized && (
          <MemoWindow
            key={window.id}
            window={window}
            onClose={() => closeMemoWindow(window.id)}
            onMinimize={() => minimizeMemoWindow(window.id)}
            onContentChange={(content) => updateMemoContent(window.id, content)}
            onBringToFront={() => bringMemoToFront(window.id)}
            onPositionChange={(position) => {
              setMemoWindows(prev => prev.map(w => 
                w.id === window.id ? { ...w, position } : w
              ));
            }}
            onSizeChange={(size) => {
              setMemoWindows(prev => prev.map(w => 
                w.id === window.id ? { ...w, size } : w
              ));
            }}
          />
        )
      ))}

      {/* Browser Windows */}
      {browserWindows.map((window) => (
        !window.isMinimized && (
          <BrowserWindow
            key={window.id}
            window={window}
            onClose={() => closeBrowserWindow(window.id)}
            onMinimize={() => minimizeBrowserWindow(window.id)}
            onBringToFront={() => bringBrowserToFront(window.id)}
            onPositionChange={(position) => {
              setBrowserWindows(prev => prev.map(w => 
                w.id === window.id ? { ...w, position } : w
              ));
            }}
            onSizeChange={(size) => {
              setBrowserWindows(prev => prev.map(w => 
                w.id === window.id ? { ...w, size } : w
              ));
            }}
          />
        )
      ))}

      {/* Folder Windows */}
      {folderWindows.map((window) => (
        !window.isMinimized && (
          <FolderWindow
            key={window.id}
            window={window}
            folderContents={folderContents.get(window.id) || []}
            apps={apps}
            onClose={() => closeFolderWindow(window.id)}
            onMinimize={() => minimizeFolderWindow(window.id)}
            onBringToFront={() => bringFolderToFront(window.id)}
            onRemoveApp={(appId) => removeFromFolder(window.id, appId)}
            onAppClick={handleAppClick}
            onPositionChange={(position) => {
              setFolderWindows(prev => prev.map(w => 
                w.id === window.id ? { ...w, position } : w
              ));
            }}
            onSizeChange={(size) => {
              setFolderWindows(prev => prev.map(w => 
                w.id === window.id ? { ...w, size } : w
              ));
            }}
          />
        )
      ))}

      {/* Dock */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20">
          {/* Minimized memo windows in dock */}
          {memoWindows.filter(w => w.isMinimized).map((window) => (
            <div
              key={`dock-memo-${window.id}`}
              className="group cursor-pointer transform transition-all duration-200 hover:scale-125 hover:-translate-y-2"
              onClick={() => {
                setMemoWindows(prev => prev.map(w => 
                  w.id === window.id ? { ...w, isMinimized: false, zIndex: nextZIndex } : w
                ));
                setNextZIndex(prev => prev + 1);
              }}
            >
              <div className="relative w-12 h-12 rounded-xl bg-yellow-300 shadow-lg group-hover:shadow-xl flex items-center justify-center border border-white/20 transition-all duration-200">
                <StickyNote size={24} className="text-white" />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/20 to-white/10" />
              </div>
            </div>
          ))}
          
          {/* Minimized browser windows in dock */}
          {browserWindows.filter(w => w.isMinimized).map((window) => (
            <div
              key={`dock-browser-${window.id}`}
              className="group cursor-pointer transform transition-all duration-200 hover:scale-125 hover:-translate-y-2"
              onClick={() => {
                setBrowserWindows(prev => prev.map(w => 
                  w.id === window.id ? { ...w, isMinimized: false, zIndex: nextZIndex } : w
                ));
                setNextZIndex(prev => prev + 1);
              }}
            >
              <div className="relative w-12 h-12 rounded-xl bg-blue-500 shadow-lg group-hover:shadow-xl flex items-center justify-center border border-white/20 transition-all duration-200">
                <Globe size={24} className="text-white" />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/20 to-white/10" />
              </div>
            </div>
          ))}

          {/* Minimized folder windows in dock */}
          {folderWindows.filter(w => w.isMinimized).map((window) => (
            <div
              key={`dock-folder-${window.id}`}
              className="group cursor-pointer transform transition-all duration-200 hover:scale-125 hover:-translate-y-2"
              onClick={() => {
                setFolderWindows(prev => prev.map(w => 
                  w.id === window.id ? { ...w, isMinimized: false, zIndex: nextZIndex } : w
                ));
                setNextZIndex(prev => prev + 1);
              }}
            >
              <div className="relative w-12 h-12 rounded-xl bg-blue-600 shadow-lg group-hover:shadow-xl flex items-center justify-center border border-white/20 transition-all duration-200">
                <FolderIcon size={24} className="text-white" />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/20 to-white/10" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Memo Window Component
function MemoWindow({ 
  window, 
  onClose, 
  onMinimize, 
  onContentChange, 
  onBringToFront,
  onPositionChange,
  onSizeChange
}: {
  window: MemoWindow;
  onClose: () => void;
  onMinimize: () => void;
  onContentChange: (content: string) => void;
  onBringToFront: () => void;
  onPositionChange: (position: { x: number; y: number }) => void;
  onSizeChange: (size: { width: number; height: number }) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains('window-header')) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - window.position.x,
        y: e.clientY - window.position.y
      });
      onBringToFront();
    }
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: window.size.width,
      height: window.size.height
    });
    onBringToFront();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        onPositionChange({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y
        });
      } else if (isResizing) {
        const newWidth = Math.max(300, resizeStart.width + (e.clientX - resizeStart.x));
        const newHeight = Math.max(200, resizeStart.height + (e.clientY - resizeStart.y));
        onSizeChange({ width: newWidth, height: newHeight });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragStart, resizeStart, onPositionChange, onSizeChange]);

  return (
    <div
      className="fixed bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden"
      style={{
        left: window.position.x,
        top: window.position.y,
        width: window.size.width,
        height: window.size.height,
        zIndex: window.zIndex,
        cursor: isDragging ? 'grabbing' : 'default'
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Window Header */}
      <div className="window-header flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200 cursor-grab active:cursor-grabbing">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-2">
            <button
              onClick={onClose}
              className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
            />
            <button
              onClick={onMinimize}
              className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-600 transition-colors"
            />
            <button className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-600 transition-colors" />
          </div>
          <span className="text-sm font-medium text-gray-700 ml-4">{window.title}</span>
        </div>
      </div>

      {/* Window Content */}
      <div className="flex-1 p-4 h-full">
        <textarea
          value={window.content}
          onChange={(e) => onContentChange(e.target.value)}
          placeholder="Start typing your memo..."
          className="w-full h-full resize-none border-none outline-none text-gray-800 font-mono text-sm leading-relaxed"
          style={{ height: 'calc(100% - 60px)' }}
        />
      </div>

      {/* Resize Handle */}
      <div
        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
        onMouseDown={handleResizeMouseDown}
      >
        <div className="absolute bottom-1 right-1 w-2 h-2 border-r-2 border-b-2 border-gray-400" />
      </div>
    </div>
  );
}

// Browser Window Component
function BrowserWindow({ 
  window, 
  onClose, 
  onMinimize, 
  onBringToFront,
  onPositionChange,
  onSizeChange
}: {
  window: BrowserWindow;
  onClose: () => void;
  onMinimize: () => void;
  onBringToFront: () => void;
  onPositionChange: (position: { x: number; y: number }) => void;
  onSizeChange: (size: { width: number; height: number }) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains('window-header')) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - window.position.x,
        y: e.clientY - window.position.y
      });
      onBringToFront();
    }
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: window.size.width,
      height: window.size.height
    });
    onBringToFront();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        onPositionChange({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y
        });
      } else if (isResizing) {
        const newWidth = Math.max(400, resizeStart.width + (e.clientX - resizeStart.x));
        const newHeight = Math.max(300, resizeStart.height + (e.clientY - resizeStart.y));
        onSizeChange({ width: newWidth, height: newHeight });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragStart, resizeStart, onPositionChange, onSizeChange]);

  return (
    <div
      className="fixed bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden"
      style={{
        left: window.position.x,
        top: window.position.y,
        width: window.size.width,
        height: window.size.height,
        zIndex: window.zIndex,
        cursor: isDragging ? 'grabbing' : 'default'
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Window Header */}
      <div className="window-header flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200 cursor-grab active:cursor-grabbing">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-2">
            <button
              onClick={onClose}
              className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
            />
            <button
              onClick={onMinimize}
              className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-600 transition-colors"
            />
            <button className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-600 transition-colors" />
          </div>
          <span className="text-sm font-medium text-gray-700 ml-4">{window.title}</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {window.url}
          </div>
        </div>
      </div>

      {/* Browser Content */}
      <div className="flex-1 h-full">
        <iframe
          src={window.url}
          className="w-full h-full border-0"
          style={{ height: 'calc(100% - 50px)' }}
          title={window.title}
        />
      </div>

      {/* Resize Handle */}
      <div
        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
        onMouseDown={handleResizeMouseDown}
      >
        <div className="absolute bottom-1 right-1 w-2 h-2 border-r-2 border-b-2 border-gray-400" />
      </div>
    </div>
  );
}

// Folder Window Component
function FolderWindow({ 
  window, 
  folderContents,
  apps,
  onClose, 
  onMinimize, 
  onBringToFront,
  onRemoveApp,
  onAppClick,
  onPositionChange,
  onSizeChange
}: {
  window: FolderWindow;
  folderContents: string[];
  apps: AppIcon[];
  onClose: () => void;
  onMinimize: () => void;
  onBringToFront: () => void;
  onRemoveApp: (appId: string) => void;
  onAppClick: (app: AppIcon) => void;
  onPositionChange: (position: { x: number; y: number }) => void;
  onSizeChange: (size: { width: number; height: number }) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains('window-header')) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - window.position.x,
        y: e.clientY - window.position.y
      });
      onBringToFront();
    }
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: window.size.width,
      height: window.size.height
    });
    onBringToFront();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        onPositionChange({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y
        });
      } else if (isResizing) {
        const newWidth = Math.max(400, resizeStart.width + (e.clientX - resizeStart.x));
        const newHeight = Math.max(300, resizeStart.height + (e.clientY - resizeStart.y));
        onSizeChange({ width: newWidth, height: newHeight });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragStart, resizeStart, onPositionChange, onSizeChange]);

  const renderAppIcon = (app: AppIcon) => {
    if (app.type === 'website' && app.favicon) {
      return (
        <img
          src={app.favicon}
          alt={app.name}
          className="w-6 h-6 rounded-sm"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            target.nextElementSibling?.classList.remove('hidden');
          }}
        />
      );
    }
    return <app.icon size={24} className="text-white drop-shadow-sm" />;
  };

  const folderApps = folderContents.map(appId => apps.find(app => app.id === appId)).filter(Boolean) as AppIcon[];

  return (
    <div
      className="fixed bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden"
      style={{
        left: window.position.x,
        top: window.position.y,
        width: window.size.width,
        height: window.size.height,
        zIndex: window.zIndex,
        cursor: isDragging ? 'grabbing' : 'default'
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Window Header */}
      <div className="window-header flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200 cursor-grab active:cursor-grabbing">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-2">
            <button
              onClick={onClose}
              className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
            />
            <button
              onClick={onMinimize}
              className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-600 transition-colors"
            />
            <button className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-600 transition-colors" />
          </div>
          <span className="text-sm font-medium text-gray-700 ml-4">{window.title}</span>
        </div>
        <div className="text-xs text-gray-500">
          {folderApps.length} item{folderApps.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Folder Content */}
      <div className="flex-1 p-4 h-full overflow-auto" style={{ height: 'calc(100% - 50px)' }}>
        {folderApps.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500 text-center">
            <div>
              <FolderIcon size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-sm">This folder is empty</p>
              <p className="text-xs mt-1">Drag apps here to organize them</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-6 gap-4">
            {folderApps.map((app) => (
              <div key={app.id} className="group flex flex-col items-center">
                <div className="relative">
                  <div
                    onClick={() => onAppClick(app)}
                    className={`
                      relative w-12 h-12 rounded-xl ${app.color}
                      shadow-md hover:shadow-lg
                      flex items-center justify-center
                      border border-white/20
                      cursor-pointer
                      transition-all duration-200
                      group-hover:scale-110
                    `}
                  >
                    {renderAppIcon(app)}
                    {app.type === 'website' && app.favicon && (
                      <Globe size={24} className="text-white drop-shadow-sm hidden" />
                    )}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/20 to-white/10" />
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveApp(app.id);
                    }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <X size={12} />
                  </button>
                </div>
                <div className="mt-1 text-xs text-gray-700 text-center font-medium max-w-full truncate">
                  {app.name}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Resize Handle */}
      <div
        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
        onMouseDown={handleResizeMouseDown}
      >
        <div className="absolute bottom-1 right-1 w-2 h-2 border-r-2 border-b-2 border-gray-400" />
      </div>
    </div>
  );
}
