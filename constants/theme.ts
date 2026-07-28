/**
 * FlowTodo — Ocean Flow palette.
 * All UI colors live here so screens stay portable.
 */
export const colors = {
  primary: '#0d9488',
  primaryHover: '#0f766e',
  primaryLight: 'rgba(13, 148, 136, 0.2)',

  red: '#ef4444',
  redHover: '#dc2626',
  green: '#22c55e',
  pink: '#fbcfe8',

  bgPageStart: '#f8fffe',
  bgPageMid: '#ccfbf1',
  bgPageEnd: '#a5f3fc',
  bgSurface: '#ffffff',
  bgContent: '#f0fdfa',
  bgTodoItem: '#ffffff',
  bgAuthCard: 'rgba(255, 255, 255, 0.72)',

  textPrimary: '#0f172a',
  textSecondary: '#475569',
  textMuted: '#94a3b8',

  borderColor: '#e2e8f0',

  sidebarItemActiveBg: '#0d9488',
  sidebarItemActiveText: '#ffffff',
  sidebarItemText: '#475569',
  sidebarLogoutText: '#ef4444',

  overlayBg: 'rgba(0, 0, 0, 0.35)',
} as const;

export const tokens = {
  borderRadius: 14,
  inputHeight: 46,
  buttonHeight: 48,
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 25,
    elevation: 4,
  },
  authCardMaxWidth: 448,
  desktopBreakpoint: 768,
} as const;

export const brand = {
  name: 'FlowTodo',
} as const;
