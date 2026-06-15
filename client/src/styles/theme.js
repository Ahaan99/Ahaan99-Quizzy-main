export const theme = {
  colors: {
    background: {
      main: "bg-[#0a0a0a]",
      panel: "bg-[#050505]",
      input: "bg-[#141414]",
      hover: "hover:bg-[#1a1a1a]",
    },
    border: {
      default: "border-white/10",
      focus: "focus:border-purple-500",
      active: "border-purple-500/50",
      hover: "hover:border-purple-500/30",
    },
    text: {
      primary: "text-white",
      secondary: "text-gray-300",
      muted: "text-gray-400",
      placeholder: "placeholder-gray-400",
      accent: "text-purple-400",
      accentHover: "hover:text-purple-300",
      error: "text-red-400",
    },
    primary: "bg-[#9b51e0] hover:bg-[#8540c4]",
  },
  typography: {
    label: "text-xs font-semibold mb-1.5 block",
    heading: "text-2xl sm:text-3xl font-bold mb-1",
    subheading: "text-sm",
    error: "text-[10px] mt-1 font-medium",
    button: "font-semibold text-sm",
  },
  components: {
    input: "w-full rounded-lg py-3 pl-11 pr-4 text-sm transition-all focus:outline-none focus:ring-1 focus:ring-purple-500",
    socialButton: "flex items-center justify-center gap-2 py-2.5 rounded-lg transition-all",
    primaryButton: "w-full py-3 rounded-lg mt-2 transition-all shadow-md shadow-purple-500/20 disabled:opacity-70",
    roleCard: "flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all",
  }
};

export const getClasses = (component) => {
  switch (component) {
    case 'input':
      return `${theme.components.input} ${theme.colors.background.input} ${theme.colors.border.default} ${theme.colors.text.primary} ${theme.colors.text.placeholder} ${theme.colors.border.focus}`;
    case 'socialButton':
      return `${theme.components.socialButton} ${theme.colors.background.input} ${theme.colors.border.default} ${theme.colors.background.hover} ${theme.colors.border.hover}`;
    case 'primaryButton':
      return `${theme.components.primaryButton} ${theme.colors.primary} ${theme.colors.text.primary} ${theme.typography.button}`;
    default:
      return '';
  }
};
